#!/usr/bin/env python3
"""Download Fitz Roy massif DEM from AWS Terrain Tiles (Terrarium) into public/fitz-roy."""

from __future__ import annotations

import json
import math
import urllib.request
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image

WEST, SOUTH, EAST, NORTH = -73.10, -49.32, -72.96, -49.23
ZOOM = 13
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "fitz-roy"


def latlon_to_tile(lat: float, lon: float, z: int) -> tuple[int, int]:
    n = 2**z
    x = int((lon + 180.0) / 360.0 * n)
    lat_r = math.radians(lat)
    y = int(
        (1.0 - math.log(math.tan(lat_r) + 1.0 / math.cos(lat_r)) / math.pi)
        / 2.0
        * n
    )
    return x, y


def tile_to_latlon(x: int, y: int, z: int) -> tuple[float, float]:
    n = 2**z
    lon = x / n * 360.0 - 180.0
    lat_r = math.atan(math.sinh(math.pi * (1 - 2 * y / n)))
    return math.degrees(lat_r), lon


def decode_terrarium(img: Image.Image) -> np.ndarray:
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    return arr[:, :, 0] * 256.0 + arr[:, :, 1] + arr[:, :, 2] / 256.0 - 32768.0


def resize_bilinear(dem: np.ndarray, target: int) -> np.ndarray:
    h, w = dem.shape
    ys = np.linspace(0, h - 1, target)
    xs = np.linspace(0, w - 1, target)
    out = np.zeros((target, target), dtype=np.float32)
    for j, yy in enumerate(ys):
        for i, xx in enumerate(xs):
            y0, x0 = int(np.floor(yy)), int(np.floor(xx))
            y1, x1 = min(y0 + 1, h - 1), min(x0 + 1, w - 1)
            wy, wx = yy - y0, xx - x0
            out[j, i] = (
                dem[y0, x0] * (1 - wx) * (1 - wy)
                + dem[y0, x1] * wx * (1 - wy)
                + dem[y1, x0] * (1 - wx) * wy
                + dem[y1, x1] * wx * wy
            )
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    x0, y1 = latlon_to_tile(SOUTH, WEST, ZOOM)
    x1, y0 = latlon_to_tile(NORTH, EAST, ZOOM)
    xmin, xmax = min(x0, x1), max(x0, x1)
    ymin, ymax = min(y0, y1), max(y0, y1)

    rows = []
    for y in range(ymin, ymax + 1):
        row = []
        for x in range(xmin, xmax + 1):
            url = f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{ZOOM}/{x}/{y}.png"
            req = urllib.request.Request(url, headers={"User-Agent": "Portfolio2026/1.0"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                elev = decode_terrarium(Image.open(BytesIO(resp.read())))
            row.append(elev)
            print(f"fetched {ZOOM}/{x}/{y}")
        rows.append(np.concatenate(row, axis=1))

    dem = np.concatenate(rows, axis=0)
    if dem.shape[0] > 768:
        dem = resize_bilinear(dem, 768)

    hmin, hmax = float(dem.min()), float(dem.max())
    norm = (dem - hmin) / max(1e-6, hmax - hmin)
    Image.fromarray((norm * 255).astype(np.uint8)).save(OUT / "heightmap.png")
    dem.astype("<f4").tofile(OUT / "heightmap.f32")

    lat_n, lon_w = tile_to_latlon(xmin, ymin, ZOOM)
    lat_s, lon_e = tile_to_latlon(xmax + 1, ymax + 1, ZOOM)
    meta = {
        "name": "Cerro Fitz Roy massif (Patagonia)",
        "source": "AWS Terrain Tiles — Terrarium encoding (Mapzen / open data)",
        "sourceUrl": "https://registry.opendata.aws/terrain-tiles/",
        "zoom": ZOOM,
        "tiles": {"xMin": xmin, "xMax": xmax, "yMin": ymin, "yMax": ymax},
        "bbox": {"west": lon_w, "south": lat_s, "east": lon_e, "north": lat_n},
        "width": int(dem.shape[1]),
        "height": int(dem.shape[0]),
        "elevationMin": hmin,
        "elevationMax": hmax,
        "center": {"lat": -49.2712, "lon": -73.0432},
        "attribution": "Elevation © AWS Terrain Tiles / Mapzen open data",
        "note": "SRTM-derived tiles under-sample sharp granite spires vs true Fitz Roy summit (3405 m). Vertical exaggeration applied in the 3D viewport.",
    }
    (OUT / "meta.json").write_text(json.dumps(meta, indent=2))
    print("wrote", OUT, f"peak≈{hmax:.0f}m")


if __name__ == "__main__":
    main()
