# Portfolio 2026

Mobile-first portfolio for Po Yen Tseng — interactive home bio + case study pages with table-of-contents navigation.

## Structure

- `/` — Home: 3D fantasy mountain viewport with fog-reveal + project listing
- `/readme` — README.MD
- `/forma-editor` — Forma Editor
- `/gen-ai` — Gen AI in Render Studio
- `/render-studio` — Render Studio
- `/forma-cloud` — Forma Cloud
- `/ar-vr` — AR/VR Design

Content mirrors [pytseng.com](https://www.pytseng.com/). Each project page includes a mobile TOC sheet + desktop sticky rail.

## Stack

- Vite + React + TypeScript
- React Router
- Three.js hero: real Fitz Roy DEM (AWS Terrain Tiles / Terrarium GIS) + fog clear + local zoom
- Framer Motion (TOC sheet)

### Fitz Roy DEM

Height data lives in `public/fitz-roy/` — a wide Patagonia footprint from AWS Terrain Tiles (zoom 9, 1536² DEM).

```bash
python3 scripts/fetch-fitz-roy-dem.py
```

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
