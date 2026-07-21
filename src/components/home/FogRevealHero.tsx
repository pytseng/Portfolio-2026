import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { playCrackSound, stopHeroAudio } from './heroAudio'

type DemMeta = {
  name: string
  width: number
  height: number
  elevationMin: number
  elevationMax: number
  bbox: { west: number; south: number; east: number; north: number }
  attribution: string
  center: { lat: number; lon: number }
}

const terrainVertex = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vElev;
attribute float elevNorm;

void main() {
  vElev = elevNorm;
  vNormal = normalize(normalMatrix * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPos = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const terrainFragment = /* glsl */ `
uniform vec3 uSunDir;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uTime;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vElev;

vec3 palette(float t, float slope) {
  // Strict site palette tones: blue #96BBFF, yellow #F4F493, neutral #CFCFCF
  vec3 cValley = vec3(0.71, 0.81, 1.0);
  vec3 cMeadow = vec3(0.93, 0.93, 0.75);
  vec3 cSlope  = vec3(0.81, 0.81, 0.81);
  vec3 cRock   = vec3(0.68, 0.68, 0.68);
  vec3 cHigh   = vec3(0.90, 0.90, 0.90);
  vec3 cSnow   = vec3(0.99, 0.99, 1.0);

  vec3 col;
  if (t < 0.28) col = mix(cValley, cMeadow, t / 0.28);
  else if (t < 0.48) col = mix(cMeadow, cSlope, (t - 0.28) / 0.20);
  else if (t < 0.62) col = mix(cSlope, cRock, (t - 0.48) / 0.14);
  else if (t < 0.74) col = mix(cRock, cHigh, (t - 0.62) / 0.12);
  else col = mix(cHigh, cSnow, (t - 0.74) / 0.26);

  col = mix(col, cRock, clamp(slope * 0.9 - 0.15, 0.0, 0.4));
  float snow = smoothstep(0.48, 0.72, t) * mix(1.0, 0.55, slope);
  snow = max(snow, smoothstep(0.62, 0.82, t));
  col = mix(col, cSnow, clamp(snow, 0.0, 1.0));
  return col;
}

void main() {
  vec3 n = normalize(vNormal);
  float slope = 1.0 - clamp(n.y, 0.0, 1.0);
  vec3 albedo = palette(vElev, slope);

  vec3 sun = normalize(uSunDir);
  float ndl = max(dot(n, sun), 0.0);
  // Soft half-Lambert for smoother, less faceted shading
  float wrap = ndl * 0.5 + 0.5;
  float lit = mix(0.78, 1.15, wrap * wrap);
  vec3 warm = vec3(1.0, 0.92, 0.95);
  vec3 cool = vec3(0.82, 0.9, 1.0);
  vec3 shade = mix(cool, warm, wrap);
  vec3 col = albedo * lit * shade;

  float valleyMist = (1.0 - smoothstep(0.05, 0.4, vElev)) * 0.28;
  valleyMist *= 0.9 + 0.1 * sin(uTime * 0.12 + vWorldPos.x * 0.02);
  col = mix(col, uFogColor, valleyMist);

  float dist = length(vWorldPos);
  float fog = smoothstep(uFogNear, uFogFar, dist) * 0.45;
  col = mix(col, uFogColor, fog);

  float snowAmt = smoothstep(0.5, 0.78, vElev);
  float spark = smoothstep(0.992, 0.999, fract(sin(dot(vWorldPos.xz, vec2(12.9898, 78.233))) * 43758.5453));
  col += spark * snowAmt * 0.28;

  // Soft micro-variation (kept subtle for a polished look)
  float g = fract(sin(dot(vWorldPos.xz * 8.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`

const skyFragment = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uMid;
uniform vec3 uHorizon;
uniform vec3 uBottom;
uniform float uTime;
varying vec3 vPos;

void main() {
  vec3 n = normalize(vPos);
  float h = n.y;

  // Slow dreamy hue drift across the sky
  float drift = sin(uTime * 0.07) * 0.5 + 0.5;
  vec3 top = mix(uTop, vec3(0.59, 0.73, 1.0), drift * 0.45);
  vec3 mid = mix(uMid, vec3(0.96, 0.62, 0.62), (1.0 - drift) * 0.4);
  vec3 hor = mix(uHorizon, vec3(0.96, 0.96, 0.58), sin(uTime * 0.05 + 1.2) * 0.3 + 0.3);

  vec3 col = mix(uBottom, hor, smoothstep(-0.2, 0.1, h));
  col = mix(col, mid, smoothstep(0.1, 0.45, h));
  col = mix(col, top, smoothstep(0.45, 0.95, h));

  // Soft aurora ribbons near the horizon / mid sky
  float ribbon = sin(n.x * 6.0 + uTime * 0.12) * cos(n.z * 4.0 - uTime * 0.08);
  ribbon = smoothstep(0.35, 0.9, ribbon) * smoothstep(-0.05, 0.25, h) * (1.0 - smoothstep(0.55, 0.9, h));
  col += vec3(0.96, 0.62, 0.62) * ribbon * 0.22;
  col += vec3(0.59, 0.73, 1.0) * ribbon * 0.18 * (sin(uTime * 0.2) * 0.5 + 0.5);

  // Drifting cloud bands
  float clouds = sin(n.x * 7.0 + uTime * 0.018) * sin(n.z * 4.5 - uTime * 0.012);
  clouds = smoothstep(0.2, 0.78, clouds) * smoothstep(0.02, 0.4, h) * (1.0 - smoothstep(0.5, 0.92, h));
  col = mix(col, vec3(1.0, 0.96, 0.98), clouds * 0.55);

  // Gentle shimmer stars / dust high up
  float twinkle = step(0.997, fract(sin(dot(n.xy + uTime * 0.001, vec2(12.9898, 78.233))) * 43758.5453));
  col += twinkle * smoothstep(0.35, 0.9, h) * 0.55;

  // Breathing brightness
  col *= 0.96 + 0.04 * sin(uTime * 0.15);

  // Fully transparent — grid layer behind the canvas is the backdrop
  gl_FragColor = vec4(col, 0.0);
}
`

const grainVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const grainFragment = /* glsl */ `
uniform sampler2D uScene;
uniform float uTime;
uniform float uStrength;
uniform float uGlitch;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float g = clamp(uGlitch, 0.0, 1.0);

  // Slice / tear displacement while glitching
  if (g > 0.01) {
    float band = floor(uv.y * mix(8.0, 28.0, hash(vec2(floor(uTime * 18.0), 2.1))));
    float tear = (hash(vec2(band, floor(uTime * 40.0))) - 0.5) * 0.08 * g;
    uv.x = clamp(uv.x + tear, 0.0, 1.0);
    float blockY = floor(uv.y * 14.0);
    if (hash(vec2(blockY, floor(uTime * 9.0))) > 0.72) {
      uv.y = clamp(uv.y + (hash(vec2(blockY, 3.3)) - 0.5) * 0.04 * g, 0.0, 1.0);
    }
  }

  // Chromatic split biased toward pink / blue
  vec2 pinkOff = vec2(0.012, -0.004) * g;
  vec2 blueOff = vec2(-0.014, 0.005) * g;
  float r = texture2D(uScene, clamp(uv + pinkOff, 0.0, 1.0)).r;
  float ga = texture2D(uScene, uv).g;
  float b = texture2D(uScene, clamp(uv + blueOff, 0.0, 1.0)).b;
  vec3 col = vec3(r, ga, b);

  // Pink / blue flash bands
  if (g > 0.01) {
    float scan = step(0.82, hash(vec2(floor(uv.y * 60.0), floor(uTime * 30.0))));
    vec3 pink = vec3(0.96, 0.62, 0.62);
    vec3 blue = vec3(0.59, 0.73, 1.0);
    float which = step(0.5, hash(vec2(floor(uv.y * 20.0), floor(uTime * 12.0))));
    col = mix(col, mix(pink, blue, which), scan * 0.55 * g);
    col = mix(col, pink, hash(uv * 40.0 + uTime) * 0.12 * g);
    col = mix(col, blue, hash(uv.yx * 55.0 - uTime) * 0.12 * g);
    float bar = step(0.92, hash(vec2(floor(uv.y * 90.0), floor(uTime * 50.0))));
    col += mix(pink, blue, which) * bar * 0.35 * g;
  }

  float n = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime * 12.7));
  float n2 = hash(vUv * vec2(911.0, 643.0) - fract(uTime * 7.3));
  float grain = (n * 0.7 + n2 * 0.3) - 0.5;
  col += grain * (uStrength + g * 0.08);

  float vig = smoothstep(1.15, 0.35, length(vUv - 0.5));
  col *= mix(0.97, 1.0, vig);

  // Primary-color glass tint over the whole viewport
  vec3 glassTint = vec3(0.588, 0.733, 1.0);
  col = mix(col, glassTint, 0.16);

  float alpha = texture2D(uScene, uv).a;
  gl_FragColor = vec4(col, alpha);
}
`

function sampleElev(
  elev: Float32Array,
  width: number,
  height: number,
  u: number,
  v: number,
) {
  const x = THREE.MathUtils.clamp(u, 0, 1) * (width - 1)
  const y = THREE.MathUtils.clamp(v, 0, 1) * (height - 1)
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = Math.min(x0 + 1, width - 1)
  const y1 = Math.min(y0 + 1, height - 1)
  const tx = x - x0
  const ty = y - y0
  const a = elev[y0 * width + x0]
  const b = elev[y0 * width + x1]
  const c = elev[y1 * width + x0]
  const d = elev[y1 * width + x1]
  return a * (1 - tx) * (1 - ty) + b * tx * (1 - ty) + c * (1 - tx) * ty + d * tx * ty
}

function makeBirdGeometry() {
  const geo = new THREE.BufferGeometry()
  const verts = new Float32Array([
    0, 0, 0, -0.55, 0.08, 0.1, -0.15, 0, 0.05, 0, 0, 0, 0.55, 0.08, 0.1, 0.15, 0,
    0.05,
  ])
  geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
  geo.computeVertexNormals()
  return geo
}

async function loadDem() {
  const [meta, buffer] = await Promise.all([
    fetch('/fitz-roy/meta.json').then((r) => r.json() as Promise<DemMeta>),
    fetch('/fitz-roy/heightmap.f32').then((r) => r.arrayBuffer()),
  ])
  return { meta, elev: new Float32Array(buffer) }
}

export function FogRevealHero({
  active = true,
  onBrokenChange,
  stitchApi,
}: {
  active?: boolean
  onBrokenChange?: (broken: boolean) => void
  stitchApi?: { current: (() => void) | null }
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const axeRef = useRef<HTMLImageElement>(null)
  const activeRef = useRef(active)
  const wakeRef = useRef<(() => void) | null>(null)
  const pauseRef = useRef<(() => void) | null>(null)
  const stitchRef = useRef<(() => void) | null>(null)
  const onBrokenRef = useRef(onBrokenChange)
  activeRef.current = active
  onBrokenRef.current = onBrokenChange

  useEffect(() => {
    if (!stitchApi) return
    stitchApi.current = () => stitchRef.current?.()
    return () => {
      stitchApi.current = null
    }
  }, [stitchApi])

  useEffect(() => {
    const mount = mountRef.current
    const axeEl = axeRef.current
    if (!mount) return

    let disposed = false
    let raf = 0
    let renderer: THREE.WebGLRenderer | null = null
    let tearDown: (() => void) | null = null

    const boot = async () => {
      const { meta, elev } = await loadDem()
      if (disposed || !mount.isConnected) return

      const isMobile = window.matchMedia('(max-width: 720px)').matches
      // Higher mesh density → smoother slopes (DEM is 1536²)
      const segs = isMobile ? 384 : 640

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
        premultipliedAlpha: false,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.75 : 2))
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.32
      renderer.outputColorSpace = THREE.SRGBColorSpace
      mount.appendChild(renderer.domElement)

      if (disposed) {
        renderer.dispose()
        renderer.forceContextLoss()
        if (renderer.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement)
        }
        renderer = null
        return
      }

      const scene = new THREE.Scene()
      const fogColor = new THREE.Color(0xb8c8e8)
      scene.fog = new THREE.Fog(fogColor, 180, 680)

      const latMid = (meta.bbox.north + meta.bbox.south) / 2
      const lonSpan = meta.bbox.east - meta.bbox.west
      const latSpan = meta.bbox.north - meta.bbox.south
      const mPerDegLon = 111_320 * Math.cos((latMid * Math.PI) / 180)
      const mPerDegLat = 110_540
      const realW = lonSpan * mPerDegLon
      const realD = latSpan * mPerDegLat
      const fit = 280 / realW
      const worldW = realW * fit
      const worldD = realD * fit
      const vertExag = 6.2
      const elevMin = Math.max(0, meta.elevationMin)
      const elevMax = meta.elevationMax
      const elevSpan = Math.max(1, elevMax - elevMin)
      const heightScale = fit * vertExag
      const peakH = elevSpan * heightScale

      const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 1600)
      const lookTarget = new THREE.Vector3(0, peakH * 0.32, 0)
      const span = Math.max(worldW, worldD)
      // Stay close to the terrain — tight max zoom-out so tile edges stay off-screen
      const orbit = {
        azimuth: 0.72,
        polar: Math.PI / 2 - Math.PI / 6,
        radius: span * 0.42,
        minPolar: 0.45,
        maxPolar: 1.2,
        minRadius: span * 0.14,
        maxRadius: span * 0.48,
        dragging: false,
        lastX: 0,
        lastY: 0,
        idleUntil: 0,
        targetAzimuth: 0.72,
        targetPolar: Math.PI / 2 - Math.PI / 6,
        targetRadius: span * 0.42,
      }

      // WASD / arrows — smooth, slow look
      const keys = { left: false, right: false, up: false, down: false }
      const keysActive = () => keys.left || keys.right || keys.up || keys.down
      const KEY_YAW = 0.28 // rad/s
      const KEY_PITCH = 0.18

      const applyOrbitCamera = () => {
        const sinP = Math.sin(orbit.polar)
        camera.position.set(
          lookTarget.x + Math.sin(orbit.azimuth) * sinP * orbit.radius,
          lookTarget.y + Math.cos(orbit.polar) * orbit.radius + peakH * 0.05,
          lookTarget.z + Math.cos(orbit.azimuth) * sinP * orbit.radius,
        )
        camera.lookAt(lookTarget)
      }
      applyOrbitCamera()

      const pickIdleTarget = () => {
        orbit.targetAzimuth = orbit.azimuth + (Math.random() - 0.5) * 1.1
        orbit.targetPolar = THREE.MathUtils.clamp(
          orbit.polar + (Math.random() - 0.5) * 0.35,
          orbit.minPolar,
          orbit.maxPolar,
        )
        orbit.targetRadius = THREE.MathUtils.clamp(
          orbit.minRadius + Math.random() * (orbit.maxRadius - orbit.minRadius),
          orbit.minRadius,
          orbit.maxRadius,
        )
        orbit.idleUntil = performance.now() / 1000 + 4 + Math.random() * 5
      }
      pickIdleTarget()

      const skyGeo = new THREE.SphereGeometry(900, 64, 32)
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        transparent: true,
        uniforms: {
          uTop: { value: new THREE.Color(0x96bbff) },
          uMid: { value: new THREE.Color(0xf49d9d) },
          uHorizon: { value: new THREE.Color(0xf4f493) },
          uBottom: { value: new THREE.Color(0xa8c4f0) },
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: skyFragment,
      })
      const skyMesh = new THREE.Mesh(skyGeo, skyMat)
      skyMesh.userData.noFall = true
      scene.add(skyMesh)

      const terrainGeo = new THREE.PlaneGeometry(worldW, worldD, segs, segs)
      terrainGeo.rotateX(-Math.PI / 2)
      const elevNorm = new Float32Array(terrainGeo.attributes.position.count)
      {
        const pos = terrainGeo.attributes.position
        const rawH = new Float32Array(pos.count)
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i)
          const z = pos.getZ(i)
          const u = x / worldW + 0.5
          const v = z / worldD + 0.5
          rawH[i] = Math.max(elevMin, sampleElev(elev, meta.width, meta.height, u, v))
        }
        // Light 3×3 blur on heights → softer normals, less faceted look
        const cols = segs + 1
        const rows = segs + 1
        for (let i = 0; i < pos.count; i++) {
          const cx = i % cols
          const cy = (i / cols) | 0
          let sum = 0
          let wSum = 0
          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              const nx = cx + ox
              const ny = cy + oy
              if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
              const w = ox === 0 && oy === 0 ? 4 : ox === 0 || oy === 0 ? 2 : 1
              sum += rawH[ny * cols + nx] * w
              wSum += w
            }
          }
          const meters = sum / wSum
          pos.setY(i, (meters - elevMin) * heightScale)
          elevNorm[i] = THREE.MathUtils.clamp((meters - elevMin) / elevSpan, 0, 1)
        }
        pos.needsUpdate = true
        terrainGeo.setAttribute('elevNorm', new THREE.BufferAttribute(elevNorm, 1))
        terrainGeo.computeVertexNormals()
      }

      const sunDir = new THREE.Vector3(0.45, 0.88, 0.2).normalize()
      const terrainMat = new THREE.ShaderMaterial({
        uniforms: {
          uSunDir: { value: sunDir },
          uFogColor: { value: fogColor.clone() },
          uFogNear: { value: 200 },
          uFogFar: { value: 640 },
          uTime: { value: 0 },
        },
        vertexShader: terrainVertex,
        fragmentShader: terrainFragment,
      })
      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat)
      scene.add(terrainMesh)

      // Terrain height lookup for placing props
      const terrainAt = (x: number, z: number) => {
        const u = x / worldW + 0.5
        const v = z / worldD + 0.5
        const meters = Math.max(elevMin, sampleElev(elev, meta.width, meta.height, u, v))
        return {
          y: (meters - elevMin) * heightScale,
          n: THREE.MathUtils.clamp((meters - elevMin) / elevSpan, 0, 1),
        }
      }

      // Ponds — organic blobs of still water pooled in low basins
      const pondGeos: THREE.BufferGeometry[] = []
      const pondMat = new THREE.MeshBasicMaterial({
        color: 0xaecbff,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
      const makePondGeometry = () => {
        // Wobbly closed outline from layered radial harmonics
        const n = 26
        const k2 = 2 + ((Math.random() * 2) | 0)
        const k3 = 4 + ((Math.random() * 3) | 0)
        const a2 = 0.16 + Math.random() * 0.14
        const a3 = 0.06 + Math.random() * 0.08
        const ph2 = Math.random() * Math.PI * 2
        const ph3 = Math.random() * Math.PI * 2
        const pts: THREE.Vector2[] = []
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * Math.PI * 2
          const r =
            1 +
            a2 * Math.sin(k2 * ang + ph2) +
            a3 * Math.sin(k3 * ang + ph3)
          pts.push(new THREE.Vector2(Math.cos(ang) * r, Math.sin(ang) * r))
        }
        const geo = new THREE.ShapeGeometry(new THREE.Shape(pts), 10)
        pondGeos.push(geo)
        return geo
      }
      {
        const spots: { x: number; z: number }[] = []
        let guard = 0
        while (spots.length < 5 && guard < 1200) {
          guard++
          const x = (Math.random() - 0.5) * worldW * 0.8
          const z = (Math.random() - 0.5) * worldD * 0.8
          const { y, n } = terrainAt(x, z)
          if (n > 0.12) continue
          // Only true basins — surroundings must rise above the center
          const r = 5
          let basin = true
          for (let k = 0; k < 6; k++) {
            const a = (k / 6) * Math.PI * 2
            if (terrainAt(x + Math.cos(a) * r, z + Math.sin(a) * r).y < y - 0.3) {
              basin = false
              break
            }
          }
          if (!basin) continue
          if (spots.some((s) => Math.hypot(s.x - x, s.z - z) < worldW * 0.12)) continue
          spots.push({ x, z })
          const pond = new THREE.Mesh(makePondGeometry(), pondMat)
          pond.rotation.x = -Math.PI / 2
          pond.rotation.z = Math.random() * Math.PI * 2
          // Lake-sized bodies of water
          const pr = 5.5 + Math.random() * 5.5
          pond.scale.set(pr, pr * (0.7 + Math.random() * 0.5), 1)
          pond.position.set(x, y + 0.55, z)
          scene.add(pond)
        }
      }

      // Streams — ribbons of water running downhill, with waterfall foam
      const streamGeos: THREE.BufferGeometry[] = []
      const streamMat = new THREE.MeshBasicMaterial({
        color: 0xaecbff,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      const foamMat = new THREE.MeshBasicMaterial({
        color: 0xf2f7ff,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      {
        const step = 1.3
        for (let s = 0; s < 4; s++) {
          // Start at mid elevation
          let sx = 0
          let sz = 0
          let found = false
          for (let k = 0; k < 300 && !found; k++) {
            const x = (Math.random() - 0.5) * worldW * 0.7
            const z = (Math.random() - 0.5) * worldD * 0.7
            const { n } = terrainAt(x, z)
            if (n > 0.22 && n < 0.42) {
              sx = x
              sz = z
              found = true
            }
          }
          if (!found) continue
          // Steepest-descent walk down the terrain
          const path: THREE.Vector3[] = []
          let cx = sx
          let cz = sz
          let cy = terrainAt(cx, cz).y
          path.push(new THREE.Vector3(cx, cy, cz))
          for (let i = 0; i < 150; i++) {
            let bestX = cx
            let bestZ = cz
            let bestY = cy
            for (let d = 0; d < 10; d++) {
              const a = (d / 10) * Math.PI * 2
              const nx = cx + Math.cos(a) * step
              const nz = cz + Math.sin(a) * step
              const ny = terrainAt(nx, nz).y
              if (ny < bestY) {
                bestY = ny
                bestX = nx
                bestZ = nz
              }
            }
            if (bestY >= cy - 1e-4) break
            cx = bestX
            cz = bestZ
            cy = bestY
            path.push(new THREE.Vector3(cx, cy, cz))
            if (terrainAt(cx, cz).n < 0.045) break
          }
          if (path.length < 8) continue

          // Smooth the raw descent into a fluid curve, re-anchored to the terrain
          const curve = new THREE.CatmullRomCurve3(
            path.filter((_, idx) => idx % 2 === 0),
            false,
            'centripetal',
          )
          const pts = curve.getPoints(path.length * 2)
          for (const p of pts) p.y = terrainAt(p.x, p.z).y

          const wBase = 0.4 + Math.random() * 0.3
          const positions: number[] = []
          const dir = new THREE.Vector3()
          const perp = new THREE.Vector3()
          // Centered-difference directions keep ribbon edges smooth
          const edgeAt = (i: number) => {
            const pPrev = pts[Math.max(0, i - 1)]
            const pNext = pts[Math.min(pts.length - 1, i + 1)]
            dir.subVectors(pNext, pPrev)
            dir.y = 0
            if (dir.lengthSq() < 1e-6) dir.set(1, 0, 0)
            dir.normalize()
            // Streams widen as they gather water downstream
            const w = wBase * (0.45 + (i / (pts.length - 1)) * 0.9)
            perp.set(-dir.z, 0, dir.x).multiplyScalar(w)
            const p = pts[i]
            return {
              lx: p.x + perp.x,
              lz: p.z + perp.z,
              rx: p.x - perp.x,
              rz: p.z - perp.z,
              y: p.y + 0.14,
            }
          }
          let prev = edgeAt(0)
          for (let i = 1; i < pts.length; i++) {
            const cur = edgeAt(i)
            positions.push(
              prev.lx, prev.y, prev.lz,
              prev.rx, prev.y, prev.rz,
              cur.lx, cur.y, cur.lz,
              prev.rx, prev.y, prev.rz,
              cur.rx, cur.y, cur.rz,
              cur.lx, cur.y, cur.lz,
            )
            // Waterfall foam sheet over steep drops
            const drop = pts[i - 1].y - pts[i].y
            if (drop > 1.8) {
              dir.subVectors(pts[i], pts[i - 1])
              dir.y = 0
              if (dir.lengthSq() > 1e-6) dir.normalize()
              const foamGeo = new THREE.PlaneGeometry(wBase * 2.4, drop + 0.7)
              streamGeos.push(foamGeo)
              const foam = new THREE.Mesh(foamGeo, foamMat)
              foam.position.set(
                (pts[i - 1].x + pts[i].x) / 2,
                (pts[i - 1].y + pts[i].y) / 2 + 0.25,
                (pts[i - 1].z + pts[i].z) / 2,
              )
              foam.lookAt(
                foam.position.x + dir.x,
                foam.position.y,
                foam.position.z + dir.z,
              )
              scene.add(foam)
            }
            prev = cur
          }
          const geo = new THREE.BufferGeometry()
          geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
          streamGeos.push(geo)
          scene.add(new THREE.Mesh(geo, streamMat))
        }
      }

      // Sky fleet — hot air balloons and zeppelins
      const skyGeos: THREE.BufferGeometry[] = []
      const skyMats: THREE.Material[] = []
      const trackG = <T extends THREE.BufferGeometry>(g: T): T => {
        skyGeos.push(g)
        return g
      }
      const trackM = <T extends THREE.Material>(m: T): T => {
        skyMats.push(m)
        return m
      }

      type Balloon = {
        group: THREE.Group
        speed: number
        phase: number
        baseY: number
      }
      const balloons: Balloon[] = []
      {
        const envGeo = trackG(new THREE.SphereGeometry(1, 14, 12))
        const skirtGeo = trackG(new THREE.ConeGeometry(0.72, 0.9, 8, 1, true))
        const basketGeo = trackG(new THREE.BoxGeometry(0.55, 0.45, 0.55))
        const basketMat = trackM(
          new THREE.MeshStandardMaterial({ color: 0x8f8f8f, roughness: 0.9 }),
        )
        // Full-tone vibrant primaries
        const balloonColors = [0xff5a4e, 0x4d86ff, 0xffe626]
        for (let i = 0; i < 3; i++) {
          const group = new THREE.Group()
          const mat = trackM(
            new THREE.MeshStandardMaterial({
              color: balloonColors[i % balloonColors.length],
              roughness: 0.55,
              emissive: new THREE.Color(
                balloonColors[i % balloonColors.length],
              ).multiplyScalar(0.35),
            }),
          )
          const env = new THREE.Mesh(envGeo, mat)
          env.scale.set(1.6, 1.95, 1.6)
          group.add(env)
          const skirt = new THREE.Mesh(skirtGeo, mat)
          skirt.rotation.x = Math.PI
          skirt.position.y = -2.15
          group.add(skirt)
          const basket = new THREE.Mesh(basketGeo, basketMat)
          basket.position.y = -2.9
          group.add(basket)
          group.position.set(
            (Math.random() - 0.5) * worldW * 0.9,
            peakH * (0.85 + Math.random() * 0.45),
            (Math.random() - 0.5) * worldD * 0.7,
          )
          scene.add(group)
          balloons.push({
            group,
            speed: 0.5 + Math.random() * 0.7,
            phase: Math.random() * Math.PI * 2,
            baseY: group.position.y,
          })
        }
      }

      type Zeppelin = { group: THREE.Group; speed: number; phase: number; baseY: number }
      const zeppelins: Zeppelin[] = []
      {
        const hullGeo = trackG(new THREE.SphereGeometry(1, 16, 12))
        const hullMat = trackM(
          new THREE.MeshStandardMaterial({
            color: 0x4d86ff,
            roughness: 0.45,
            emissive: new THREE.Color(0x4d86ff).multiplyScalar(0.35),
          }),
        )
        const finGeo = trackG(new THREE.BoxGeometry(0.9, 0.85, 0.08))
        const finMat = trackM(
          new THREE.MeshStandardMaterial({
            color: 0xff5a4e,
            roughness: 0.55,
            emissive: new THREE.Color(0xff5a4e).multiplyScalar(0.3),
          }),
        )
        const gondolaGeo = trackG(new THREE.BoxGeometry(1.2, 0.32, 0.45))
        const gondolaMat = trackM(
          new THREE.MeshStandardMaterial({ color: 0x6f6f6f, roughness: 0.7 }),
        )
        for (let i = 0; i < 2; i++) {
          const group = new THREE.Group()
          const hull = new THREE.Mesh(hullGeo, hullMat)
          hull.scale.set(3.4, 0.95, 0.95)
          group.add(hull)
          const finV = new THREE.Mesh(finGeo, finMat)
          finV.position.set(-2.9, 0.35, 0)
          group.add(finV)
          const finH = new THREE.Mesh(finGeo, finMat)
          finH.rotation.x = Math.PI / 2
          finH.position.set(-2.9, 0, 0)
          group.add(finH)
          const gondola = new THREE.Mesh(gondolaGeo, gondolaMat)
          gondola.position.y = -1.05
          group.add(gondola)
          group.position.set(
            (Math.random() - 0.5) * worldW * 0.9,
            peakH * (1.0 + Math.random() * 0.4),
            (Math.random() - 0.5) * worldD * 0.7,
          )
          scene.add(group)
          zeppelins.push({
            group,
            speed: 1.4 + Math.random() * 1.0,
            phase: Math.random() * Math.PI * 2,
            baseY: group.position.y,
          })
        }
      }

      // Forest patches — a few dense groves instead of scattered trees
      const forestCenters: { x: number; z: number; r: number }[] = []
      {
        let guard = 0
        while (forestCenters.length < 6 && guard < 900) {
          guard++
          const x = (Math.random() - 0.5) * worldW * 0.8
          const z = (Math.random() - 0.5) * worldD * 0.8
          const { n } = terrainAt(x, z)
          if (n < 0.06 || n > 0.3) continue
          if (
            forestCenters.some((c) => Math.hypot(c.x - x, c.z - z) < worldW * 0.14)
          )
            continue
          forestCenters.push({ x, z, r: 9 + Math.random() * 8 })
        }
      }

      const treeCount = isMobile ? 130 : 300
      const trunkGeo = new THREE.CylinderGeometry(0.09, 0.14, 1, 5)
      trunkGeo.translate(0, 0.5, 0)
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0xb8b8b8,
        roughness: 0.9,
      })
      const foliageGeo = new THREE.ConeGeometry(0.55, 1, 7)
      foliageGeo.translate(0, 0.5, 0)
      const foliageMat = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        emissive: new THREE.Color(0xffffff).multiplyScalar(0.14),
      })
      const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount)
      const foliageMesh = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount)
      {
        const dummy = new THREE.Object3D()
        // Palette-strict: tones of primary blue with rare pink accents
        const foliageColors = [
          new THREE.Color(0xa9c9ff),
          new THREE.Color(0x8fb9ff),
          new THREE.Color(0xc4dbff),
          new THREE.Color(0xffb0b0),
        ]
        const tint = new THREE.Color()
        let placed = 0
        let guard = 0
        while (placed < treeCount && guard < treeCount * 50 && forestCenters.length > 0) {
          guard++
          const c = forestCenters[placed % forestCenters.length]
          // Cluster falloff — denser toward the grove center
          const rad = (Math.random() + Math.random()) * 0.5 * c.r
          const ang = Math.random() * Math.PI * 2
          const x = c.x + Math.cos(ang) * rad
          const z = c.z + Math.sin(ang) * rad
          const { y, n } = terrainAt(x, z)
          if (n < 0.04 || n > 0.34) continue
          const h = 2.2 + Math.random() * 3.0
          dummy.position.set(x, y - 0.15, z)
          dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
          dummy.scale.set(h * 0.5, h * 0.35, h * 0.5)
          dummy.updateMatrix()
          trunkMesh.setMatrixAt(placed, dummy.matrix)
          dummy.position.set(x, y + h * 0.22, z)
          dummy.scale.set(h * 0.55, h, h * 0.55)
          dummy.updateMatrix()
          foliageMesh.setMatrixAt(placed, dummy.matrix)
          tint
            .copy(foliageColors[(Math.random() * foliageColors.length) | 0])
            .offsetHSL(0, 0, (Math.random() - 0.5) * 0.05)
          foliageMesh.setColorAt(placed, tint)
          placed++
        }
        trunkMesh.count = placed
        foliageMesh.count = placed
      }
      scene.add(trunkMesh)
      scene.add(foliageMesh)

      // Glowing crystals on mid slopes
      const crystalGeo = new THREE.IcosahedronGeometry(1, 0)
      const crystalMats = [
        new THREE.MeshStandardMaterial({
          color: 0x96bbff,
          emissive: new THREE.Color(0x96bbff).multiplyScalar(0.55),
          roughness: 0.15,
          metalness: 0.2,
          transparent: true,
          opacity: 0.9,
        }),
        new THREE.MeshStandardMaterial({
          color: 0xf4f493,
          emissive: new THREE.Color(0xf4f493).multiplyScalar(0.5),
          roughness: 0.15,
          metalness: 0.2,
          transparent: true,
          opacity: 0.9,
        }),
      ]
      const crystalCountEach = isMobile ? 10 : 20
      const crystalMeshes = crystalMats.map(
        (m) => new THREE.InstancedMesh(crystalGeo, m, crystalCountEach),
      )
      {
        const dummy = new THREE.Object3D()
        for (const mesh of crystalMeshes) {
          let placed = 0
          let guard = 0
          while (placed < crystalCountEach && guard < crystalCountEach * 40) {
            guard++
            const x = (Math.random() - 0.5) * worldW * 0.85
            const z = (Math.random() - 0.5) * worldD * 0.85
            const { y, n } = terrainAt(x, z)
            if (n < 0.25 || n > 0.62) continue
            const s = 0.7 + Math.random() * 1.6
            dummy.position.set(x, y + s * 0.3, z)
            dummy.rotation.set(
              Math.random() * 0.6,
              Math.random() * Math.PI * 2,
              Math.random() * 0.6,
            )
            dummy.scale.set(s * 0.5, s * 1.4, s * 0.5)
            dummy.updateMatrix()
            mesh.setMatrixAt(placed, dummy.matrix)
            placed++
          }
          mesh.count = placed
          scene.add(mesh)
        }
      }

      // Bushes — undergrowth hugging the grove edges
      const bushCount = isMobile ? 80 : 170
      const bushGeo = new THREE.IcosahedronGeometry(1, 1)
      const bushMat = new THREE.MeshStandardMaterial({
        roughness: 0.85,
        emissive: new THREE.Color(0xffffff).multiplyScalar(0.14),
      })
      const bushMesh = new THREE.InstancedMesh(bushGeo, bushMat, bushCount)
      {
        const dummy = new THREE.Object3D()
        const bushColors = [
          new THREE.Color(0xd2e2ff),
          new THREE.Color(0xbdd5ff),
          new THREE.Color(0xffc9c9),
        ]
        const tint = new THREE.Color()
        let placed = 0
        let guard = 0
        while (placed < bushCount && guard < bushCount * 50 && forestCenters.length > 0) {
          guard++
          const c = forestCenters[placed % forestCenters.length]
          // Ring around the grove — forest skirt
          const rad = c.r * (0.7 + Math.random() * 0.7)
          const ang = Math.random() * Math.PI * 2
          const x = c.x + Math.cos(ang) * rad
          const z = c.z + Math.sin(ang) * rad
          const { y, n } = terrainAt(x, z)
          if (n < 0.03 || n > 0.34) continue
          const s = 0.5 + Math.random() * 0.9
          dummy.position.set(x, y + s * 0.28, z)
          dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
          dummy.scale.set(s, s * 0.62, s)
          dummy.updateMatrix()
          bushMesh.setMatrixAt(placed, dummy.matrix)
          tint
            .copy(bushColors[(Math.random() * bushColors.length) | 0])
            .offsetHSL(0, 0, (Math.random() - 0.5) * 0.04)
          bushMesh.setColorAt(placed, tint)
          placed++
        }
        bushMesh.count = placed
        scene.add(bushMesh)
      }

      // Floating rock islands with tiny trees — slow bob + drift
      type Island = {
        group: THREE.Group
        baseY: number
        phase: number
        speed: number
        amp: number
        spin: number
      }
      const islands: Island[] = []
      const islandCount = isMobile ? 3 : 5
      const rockGeo = new THREE.DodecahedronGeometry(1, 0)
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0xcfcfcf,
        roughness: 0.85,
      })
      const islandTreeGeo = new THREE.ConeGeometry(0.4, 1.1, 6)
      islandTreeGeo.translate(0, 0.55, 0)
      const islandTreeMat = new THREE.MeshStandardMaterial({
        color: 0x96bbff,
        roughness: 0.7,
      })
      for (let i = 0; i < islandCount; i++) {
        const group = new THREE.Group()
        const rock = new THREE.Mesh(rockGeo, rockMat)
        const rs = 1.4 + Math.random() * 2.2
        rock.scale.set(rs, rs * 0.62, rs)
        group.add(rock)
        const nTrees = 1 + ((Math.random() * 3) | 0)
        for (let k = 0; k < nTrees; k++) {
          const tree = new THREE.Mesh(islandTreeGeo, islandTreeMat)
          const ts = 0.8 + Math.random() * 1.1
          tree.scale.setScalar(ts)
          tree.position.set(
            (Math.random() - 0.5) * rs * 0.9,
            rs * 0.5,
            (Math.random() - 0.5) * rs * 0.9,
          )
          group.add(tree)
        }
        const baseY = peakH * (0.55 + Math.random() * 0.5)
        group.position.set(
          (Math.random() - 0.5) * worldW * 0.6,
          baseY,
          (Math.random() - 0.5) * worldD * 0.6,
        )
        group.rotation.y = Math.random() * Math.PI * 2
        scene.add(group)
        islands.push({
          group,
          baseY,
          phase: Math.random() * Math.PI * 2,
          speed: 0.14 + Math.random() * 0.2,
          amp: 1.2 + Math.random() * 2.4,
          spin: (Math.random() - 0.5) * 0.05,
        })
      }

      // Fantasy castle — placed on the flattest mid-elevation perch we can find
      const castleGroup = new THREE.Group()
      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0xf1f1f1,
        roughness: 0.8,
        emissive: new THREE.Color(0xffffff).multiplyScalar(0.12),
      })
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xff9494,
        roughness: 0.6,
        emissive: new THREE.Color(0xff9494).multiplyScalar(0.18),
      })
      const windowMat = new THREE.MeshStandardMaterial({
        color: 0xf4f493,
        emissive: new THREE.Color(0xf4f493).multiplyScalar(0.6),
        roughness: 0.4,
      })
      const castleGeos: THREE.BufferGeometry[] = []
      {
        let bx = 0
        let bz = worldD * 0.18
        let by = terrainAt(bx, bz).y
        let bestScore = Infinity
        for (let k = 0; k < 400; k++) {
          const x = (Math.random() - 0.5) * worldW * 0.55
          const z = (Math.random() - 0.5) * worldD * 0.55
          const { y, n } = terrainAt(x, z)
          if (n < 0.2 || n > 0.48) continue
          const r = 7
          const flat =
            Math.abs(terrainAt(x + r, z).y - y) +
            Math.abs(terrainAt(x - r, z).y - y) +
            Math.abs(terrainAt(x, z + r).y - y) +
            Math.abs(terrainAt(x, z - r).y - y)
          if (flat < bestScore) {
            bestScore = flat
            bx = x
            bz = z
            by = y
          }
        }

        const addMesh = (
          geo: THREE.BufferGeometry,
          mat: THREE.Material,
          x: number,
          y: number,
          z: number,
          ry = 0,
        ) => {
          castleGeos.push(geo)
          const m = new THREE.Mesh(geo, mat)
          m.position.set(x, y, z)
          m.rotation.y = ry
          castleGroup.add(m)
          return m
        }

        // Central keep + pyramid roof
        addMesh(new THREE.BoxGeometry(5, 7.5, 5), stoneMat, 0, 3.75, 0)
        const keepRoof = addMesh(new THREE.ConeGeometry(3.9, 3.2, 4), roofMat, 0, 9.1, 0)
        keepRoof.rotation.y = Math.PI / 4
        // Corner towers + roofs
        const towerOffsets = [
          [-4.5, -4.5],
          [4.5, -4.5],
          [-4.5, 4.5],
          [4.5, 4.5],
        ]
        for (const [tx, tz] of towerOffsets) {
          addMesh(new THREE.CylinderGeometry(1.15, 1.35, 9, 8), stoneMat, tx, 4.5, tz)
          addMesh(new THREE.ConeGeometry(1.7, 3.2, 8), roofMat, tx, 10.6, tz)
        }
        // Curtain walls
        addMesh(new THREE.BoxGeometry(9, 4.2, 0.8), stoneMat, 0, 2.1, -4.5)
        addMesh(new THREE.BoxGeometry(9, 4.2, 0.8), stoneMat, 0, 2.1, 4.5)
        addMesh(new THREE.BoxGeometry(0.8, 4.2, 9), stoneMat, -4.5, 2.1, 0)
        addMesh(new THREE.BoxGeometry(0.8, 4.2, 9), stoneMat, 4.5, 2.1, 0)
        // Battlements — merlons along every wall top
        const merlonGeo = new THREE.BoxGeometry(0.44, 0.52, 0.44)
        for (let m = -3.45; m <= 3.45; m += 1.15) {
          addMesh(merlonGeo, stoneMat, m, 4.46, -4.5)
          addMesh(merlonGeo, stoneMat, m, 4.46, 4.5)
          addMesh(merlonGeo, stoneMat, -4.5, 4.46, m)
          addMesh(merlonGeo, stoneMat, 4.5, 4.46, m)
        }
        // Stone plinth grounding the whole castle
        addMesh(new THREE.BoxGeometry(11.5, 1.4, 11.5), stoneMat, 0, 0.2, 0)
        // Tower arrow-slit windows
        for (const [tx, tz] of towerOffsets) {
          addMesh(
            new THREE.BoxGeometry(0.26, 0.9, 0.26),
            windowMat,
            tx * 1.02,
            6.2,
            tz * 1.02,
          )
        }
        // Gatehouse arch + glowing windows
        addMesh(new THREE.BoxGeometry(2.6, 3.4, 0.6), stoneMat, 0, 1.7, 4.78)
        addMesh(new THREE.BoxGeometry(1.6, 2.4, 0.5), roofMat, 0, 1.2, 4.95)
        addMesh(new THREE.BoxGeometry(0.7, 1.1, 0.2), windowMat, -1.2, 5.4, 2.56)
        addMesh(new THREE.BoxGeometry(0.7, 1.1, 0.2), windowMat, 1.2, 5.4, 2.56)
        addMesh(new THREE.BoxGeometry(0.7, 1.1, 0.2), windowMat, 0, 6.6, 2.56)
        // Banner pole + pennant on the keep
        addMesh(new THREE.CylinderGeometry(0.07, 0.07, 3, 5), stoneMat, 0, 12.1, 0)
        const flagGeo = new THREE.ConeGeometry(0.5, 1.4, 3)
        const flag = addMesh(flagGeo, windowMat, 0.5, 13.2, 0)
        flag.rotation.z = -Math.PI / 2

        castleGroup.position.set(bx, by - 0.4, bz)
        castleGroup.rotation.y = Math.random() * Math.PI * 2
        castleGroup.scale.setScalar(1.25)
        scene.add(castleGroup)
      }

      // Villages — clusters of tiny houses in the valleys
      const houseCount = isMobile ? 26 : 48
      const houseBodyGeo = new THREE.BoxGeometry(1, 0.85, 1)
      houseBodyGeo.translate(0, 0.425, 0)
      const houseRoofGeo = new THREE.ConeGeometry(0.9, 0.75, 4)
      houseRoofGeo.translate(0, 0.375, 0)
      houseRoofGeo.rotateY(Math.PI / 4)
      const houseBodyMat = new THREE.MeshStandardMaterial({
        roughness: 0.85,
        emissive: new THREE.Color(0xffffff).multiplyScalar(0.16),
      })
      const houseRoofMat = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        emissive: new THREE.Color(0xffffff).multiplyScalar(0.14),
      })
      const houseBodyMesh = new THREE.InstancedMesh(houseBodyGeo, houseBodyMat, houseCount)
      const houseRoofMesh = new THREE.InstancedMesh(houseRoofGeo, houseRoofMat, houseCount)
      {
        const dummy = new THREE.Object3D()
        const bodyColors = [
          new THREE.Color(0xffffff),
          new THREE.Color(0xffe3e3),
          new THREE.Color(0xe9f1ff),
        ]
        const roofColors = [
          new THREE.Color(0xff8f8f),
          new THREE.Color(0x86b3ff),
          new THREE.Color(0xffef6e),
        ]
        // Pick 4 village centers in the valleys
        const centers: { x: number; z: number }[] = []
        let guard = 0
        while (centers.length < 4 && guard < 600) {
          guard++
          const x = (Math.random() - 0.5) * worldW * 0.8
          const z = (Math.random() - 0.5) * worldD * 0.8
          const { n } = terrainAt(x, z)
          if (n < 0.05 || n > 0.28) continue
          if (centers.some((c) => Math.hypot(c.x - x, c.z - z) < worldW * 0.15)) continue
          centers.push({ x, z })
        }
        let placed = 0
        guard = 0
        const housePlots: { x: number; z: number; r: number }[] = []
        while (placed < houseCount && guard < houseCount * 60 && centers.length > 0) {
          guard++
          const c = centers[placed % centers.length]
          const x = c.x + (Math.random() - 0.5) * 16
          const z = c.z + (Math.random() - 0.5) * 16
          const { y, n } = terrainAt(x, z)
          if (n < 0.03 || n > 0.34) continue
          const s = 1.1 + Math.random() * 0.9
          // Keep a clear plot around each house — no overlaps
          const plotR = s * 1.05
          if (housePlots.some((h) => Math.hypot(h.x - x, h.z - z) < h.r + plotR)) {
            continue
          }
          housePlots.push({ x, z, r: plotR })
          const ry = Math.random() * Math.PI * 2
          dummy.position.set(x, y - 0.06, z)
          dummy.rotation.set(0, ry, 0)
          dummy.scale.setScalar(s)
          dummy.updateMatrix()
          houseBodyMesh.setMatrixAt(placed, dummy.matrix)
          houseBodyMesh.setColorAt(placed, bodyColors[(Math.random() * bodyColors.length) | 0])
          dummy.position.set(x, y - 0.06 + 0.85 * s, z)
          dummy.updateMatrix()
          houseRoofMesh.setMatrixAt(placed, dummy.matrix)
          houseRoofMesh.setColorAt(placed, roofColors[(Math.random() * roofColors.length) | 0])
          placed++
        }
        houseBodyMesh.count = placed
        houseRoofMesh.count = placed
        scene.add(houseBodyMesh)
        scene.add(houseRoofMesh)
      }

      // Birds
      const birdGeo = makeBirdGeometry()
      const birdMat = new THREE.MeshBasicMaterial({
        color: 0x5c5c5c,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      })
      const birdCount = isMobile ? 5 : 8
      type Bird = {
        mesh: THREE.Mesh
        radius: number
        speed: number
        height: number
        phase: number
        center: THREE.Vector3
      }
      const birds: Bird[] = []
      for (let i = 0; i < birdCount; i++) {
        const mesh = new THREE.Mesh(birdGeo, birdMat)
        mesh.scale.setScalar(1.1 + Math.random() * 1.2)
        // Birds survive the world break — they just keep circling
        mesh.userData.noFall = true
        scene.add(mesh)
        birds.push({
          mesh,
          radius: 16 + Math.random() * 36,
          speed: 0.25 + Math.random() * 0.35,
          height: peakH * (0.45 + Math.random() * 0.4),
          phase: Math.random() * Math.PI * 2,
          center: new THREE.Vector3(
            (Math.random() - 0.5) * worldW * 0.35,
            0,
            (Math.random() - 0.5) * worldD * 0.35,
          ),
        })
      }

      const ambient = new THREE.AmbientLight(0xf6f6f4, 1.0)
      ambient.userData.noFall = true
      scene.add(ambient)
      const sun = new THREE.DirectionalLight(0xf4f493, 1.2)
      sun.position.copy(sunDir).multiplyScalar(200)
      sun.userData.noFall = true
      scene.add(sun)
      const fill = new THREE.DirectionalLight(0x96bbff, 0.88)
      fill.position.set(-100, 80, -80)
      fill.userData.noFall = true
      scene.add(fill)
      const rim = new THREE.DirectionalLight(0xf49d9d, 0.68)
      rim.position.set(60, 50, 120)
      rim.userData.noFall = true
      scene.add(rim)

      // Grain post pass (MSAA on the scene target for cleaner edges)
      const sceneTarget = new THREE.WebGLRenderTarget(1, 1, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        samples: isMobile ? 2 : 4,
      })
      const composeScene = new THREE.Scene()
      const composeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const grainMat = new THREE.ShaderMaterial({
        uniforms: {
          uScene: { value: sceneTarget.texture },
          uTime: { value: 0 },
          uStrength: { value: isMobile ? 0.02 : 0.028 },
          uGlitch: { value: 0 },
        },
        vertexShader: grainVertex,
        fragmentShader: grainFragment,
        depthTest: false,
        depthWrite: false,
        transparent: true,
      })
      composeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), grainMat))

      const canvas = renderer.domElement
      const start = performance.now()
      let glitchPulse = 0
      const tNow = () => performance.now() / 1000

      // World shatter — 6 axe strikes and the terrain cracks into pieces
      // that tumble off into the void below, props riding along
      let hitCount = 0
      let breakTarget = 0
      const breakTimers: number[] = []

      type ShardPiece = {
        site: THREE.Vector2
        delay: number
        axis: THREE.Vector3
        spin: number
        drift: THREE.Vector2
        matrix: THREE.Matrix4
      }
      type ShardState = {
        time: number
        pieces: ShardPiece[]
        terrainShards: THREE.Mesh[]
        fallers: { obj: THREE.Object3D; orig: THREE.Matrix4; piece: number }[]
        instFallers: {
          mesh: THREE.InstancedMesh
          orig: Float32Array
          ids: Uint8Array
          count: number
        }[]
      }
      let shardState: ShardState | null = null
      const FALL_CLOCK_MAX = 3.2

      const startBreak = () => {
        if (shardState) return
        const pieceCount = 7
        const pieces: ShardPiece[] = []
        for (let k = 0; k < pieceCount; k++) {
          // One piece near the middle, the rest fanned around it
          const ang = (k / pieceCount) * Math.PI * 2 + Math.random()
          const rad = k === 0 ? 0 : worldW * (0.16 + Math.random() * 0.24)
          const site = new THREE.Vector2(Math.cos(ang) * rad, Math.sin(ang) * rad)
          const out = site.length() > 1 ? site.clone().normalize() : new THREE.Vector2()
          pieces.push({
            site,
            delay: Math.random() * 0.45,
            axis: new THREE.Vector3(
              Math.random() - 0.5,
              (Math.random() - 0.5) * 0.3,
              Math.random() - 0.5,
            ).normalize(),
            spin: (0.45 + Math.random() * 0.65) * (Math.random() < 0.5 ? -1 : 1),
            drift: new THREE.Vector2(
              out.x * (7 + Math.random() * 9),
              out.y * (7 + Math.random() * 9),
            ),
            matrix: new THREE.Matrix4(),
          })
        }
        const pieceAt = (x: number, z: number) => {
          let best = 0
          let bd = Infinity
          for (let k = 0; k < pieces.length; k++) {
            const dx = x - pieces[k].site.x
            const dz = z - pieces[k].site.y
            const d = dx * dx + dz * dz
            if (d < bd) {
              bd = d
              best = k
            }
          }
          return best
        }

        // Everything world-anchored rides a piece (collect before shard meshes exist)
        const fallers: ShardState['fallers'] = []
        const instFallers: ShardState['instFallers'] = []
        for (const child of scene.children) {
          if (child === terrainMesh || child.userData.noFall) continue
          if ((child as THREE.InstancedMesh).isInstancedMesh) {
            const im = child as THREE.InstancedMesh
            const count = im.count
            const orig = (im.instanceMatrix.array as Float32Array).slice(0, count * 16)
            const ids = new Uint8Array(count)
            for (let i = 0; i < count; i++) {
              ids[i] = pieceAt(orig[i * 16 + 12], orig[i * 16 + 14])
            }
            instFallers.push({ mesh: im, orig, ids, count })
          } else {
            child.updateMatrix()
            fallers.push({
              obj: child,
              orig: child.matrix.clone(),
              piece: pieceAt(child.position.x, child.position.z),
            })
            child.matrixAutoUpdate = false
          }
        }

        // Split the terrain into Voronoi shards — per-piece index buffers
        // sharing the original vertex attributes
        const idx = terrainGeo.index!
        const posAttr = terrainGeo.attributes.position
        const buckets: number[][] = pieces.map(() => [])
        for (let i = 0; i < idx.count; i += 3) {
          const a = idx.getX(i)
          const b = idx.getX(i + 1)
          const c = idx.getX(i + 2)
          const cx = (posAttr.getX(a) + posAttr.getX(b) + posAttr.getX(c)) / 3
          const cz = (posAttr.getZ(a) + posAttr.getZ(b) + posAttr.getZ(c)) / 3
          buckets[pieceAt(cx, cz)].push(a, b, c)
        }
        const terrainShards: THREE.Mesh[] = []
        for (let k = 0; k < pieces.length; k++) {
          const g = new THREE.BufferGeometry()
          g.setAttribute('position', posAttr)
          g.setAttribute('normal', terrainGeo.attributes.normal)
          g.setAttribute('uv', terrainGeo.attributes.uv)
          g.setAttribute('elevNorm', terrainGeo.attributes.elevNorm)
          g.setIndex(buckets[k])
          const m = new THREE.Mesh(g, terrainMat)
          m.matrixAutoUpdate = false
          m.frustumCulled = false
          m.userData.noFall = true
          scene.add(m)
          terrainShards.push(m)
        }
        terrainMesh.visible = false
        shardState = { time: 0, pieces, terrainShards, fallers, instFallers }
      }

      const shardTmpA = new THREE.Matrix4()
      const shardTmpB = new THREE.Matrix4()
      const shardRot = new THREE.Matrix4()
      const updateShards = () => {
        if (!shardState) return
        const st = shardState
        for (const pc of st.pieces) {
          const tt = Math.max(0, st.time - pc.delay)
          // A brief upward heave, then gravity takes over; each piece tumbles
          // around its own axis while drifting outward from the epicenter
          const y = 4.5 * tt - 40 * tt * tt
          pc.matrix.makeTranslation(-pc.site.x, 0, -pc.site.y)
          shardRot.makeRotationAxis(pc.axis, pc.spin * tt)
          pc.matrix.premultiply(shardRot)
          shardTmpA.makeTranslation(
            pc.site.x + pc.drift.x * tt,
            y,
            pc.site.y + pc.drift.y * tt,
          )
          pc.matrix.premultiply(shardTmpA)
        }
        for (let k = 0; k < st.terrainShards.length; k++) {
          const m = st.terrainShards[k]
          m.matrix.copy(st.pieces[k].matrix)
          m.matrixWorldNeedsUpdate = true
        }
        for (const f of st.fallers) {
          f.obj.matrix.multiplyMatrices(st.pieces[f.piece].matrix, f.orig)
          f.obj.matrixWorldNeedsUpdate = true
        }
        for (const inf of st.instFallers) {
          const arr = inf.mesh.instanceMatrix.array as Float32Array
          for (let i = 0; i < inf.count; i++) {
            shardTmpA.fromArray(inf.orig, i * 16)
            shardTmpB.multiplyMatrices(st.pieces[inf.ids[i]].matrix, shardTmpA)
            shardTmpB.toArray(arr, i * 16)
          }
          inf.mesh.instanceMatrix.needsUpdate = true
        }
      }

      const restoreWorld = () => {
        if (!shardState) return
        for (const m of shardState.terrainShards) {
          scene.remove(m)
          m.geometry.dispose()
        }
        terrainMesh.visible = true
        for (const f of shardState.fallers) {
          f.obj.matrix.copy(f.orig)
          f.obj.matrix.decompose(f.obj.position, f.obj.quaternion, f.obj.scale)
          f.obj.matrixAutoUpdate = true
          f.obj.matrixWorldNeedsUpdate = true
        }
        for (const inf of shardState.instFallers) {
          ;(inf.mesh.instanceMatrix.array as Float32Array).set(inf.orig)
          inf.mesh.instanceMatrix.needsUpdate = true
        }
        shardState = null
      }

      stitchRef.current = () => {
        breakTarget = 0
        hitCount = 0
        playCrackSound()
      }

      const placeAxe = (clientX: number, clientY: number) => {
        if (!axeEl) return
        const rect = mount.getBoundingClientRect()
        axeEl.style.left = `${clientX - rect.left}px`
        axeEl.style.top = `${clientY - rect.top}px`
      }

      const strike = (clientX: number, clientY: number) => {
        placeAxe(clientX, clientY)
        mount.classList.add('fog-hero--striking')
        axeEl?.classList.remove('fog-hero__axe--hit')
        // reflow so animation restarts
        void axeEl?.offsetWidth
        axeEl?.classList.add('fog-hero__axe--hit')
        playCrackSound()
        if (breakTarget === 0) {
          hitCount++
          // A six-frame flash, right on impact
          glitchPulse = 6
          if (hitCount >= 6) {
            breakTarget = 1
            startBreak()
            // Aftershock cracks as the pieces give way
            for (const delay of [160, 380, 640, 980]) {
              breakTimers.push(window.setTimeout(() => playCrackSound(), delay))
            }
            // Offer the needle and thread once the dust settles
            breakTimers.push(
              window.setTimeout(() => onBrokenRef.current?.(true), 2100),
            )
          }
        }
        window.setTimeout(() => {
          mount.classList.remove('fog-hero--striking')
          axeEl?.classList.remove('fog-hero__axe--hit')
        }, 420)
      }

      const resize = () => {
        if (!renderer) return
        const w = mount.clientWidth
        const h = mount.clientHeight
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2.25)
        renderer.setSize(w, h, false)
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        sceneTarget.setSize(Math.floor(w * dpr), Math.floor(h * dpr))
      }

      const onDown = (e: PointerEvent) => {
        orbit.dragging = true
        orbit.lastX = e.clientX
        orbit.lastY = e.clientY
        orbit.targetAzimuth = orbit.azimuth
        orbit.targetPolar = orbit.polar
        orbit.targetRadius = orbit.radius
        strike(e.clientX, e.clientY)
        canvas.setPointerCapture(e.pointerId)
      }

      const onMove = (e: PointerEvent) => {
        placeAxe(e.clientX, e.clientY)

        if (!orbit.dragging) return
        const dx = e.clientX - orbit.lastX
        const dy = e.clientY - orbit.lastY
        orbit.azimuth -= dx * 0.0055
        orbit.polar = THREE.MathUtils.clamp(
          orbit.polar + dy * 0.0042,
          orbit.minPolar,
          orbit.maxPolar,
        )
        orbit.targetAzimuth = orbit.azimuth
        orbit.targetPolar = orbit.polar
        orbit.lastX = e.clientX
        orbit.lastY = e.clientY
        applyOrbitCamera()
      }

      const onUp = (e: PointerEvent) => {
        orbit.dragging = false
        pickIdleTarget()
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId)
        }
      }

      const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        orbit.radius = THREE.MathUtils.clamp(
          orbit.radius + e.deltaY * 0.07,
          orbit.minRadius,
          orbit.maxRadius,
        )
        orbit.targetRadius = orbit.radius
        orbit.idleUntil = tNow() + 3
        applyOrbitCamera()
      }

      const setKey = (e: KeyboardEvent, down: boolean) => {
        if (!activeRef.current) return
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
        let hit = false
        if (k === 'a' || k === 'ArrowLeft') {
          keys.left = down
          hit = true
        } else if (k === 'd' || k === 'ArrowRight') {
          keys.right = down
          hit = true
        } else if (k === 'w' || k === 'ArrowUp') {
          keys.up = down
          hit = true
        } else if (k === 's' || k === 'ArrowDown') {
          keys.down = down
          hit = true
        }
        if (hit) {
          e.preventDefault()
          if (down) {
            orbit.targetAzimuth = orbit.azimuth
            orbit.targetPolar = orbit.polar
            orbit.targetRadius = orbit.radius
            orbit.idleUntil = tNow() + 6
          }
        }
      }
      const onKeyDown = (e: KeyboardEvent) => setKey(e, true)
      const onKeyUp = (e: KeyboardEvent) => setKey(e, false)
      const onBlurKeys = () => {
        keys.left = keys.right = keys.up = keys.down = false
      }

      let lastFrameT = 0
      const animate = () => {
        raf = 0
        if (!renderer || disposed) return
        // Parked route / background tab: stop the loop until woken
        if (!activeRef.current || document.hidden) return

        const t = (performance.now() - start) / 1000

        terrainMat.uniforms.uTime.value = t
        skyMat.uniforms.uTime.value = t
        grainMat.uniforms.uTime.value = t

        // Pink/blue glitch only while a click strike is active
        // Strike glitch renders for a fixed number of frames — a blink of static
        let glitch = glitchPulse > 0 ? 1 : 0
        if (glitchPulse > 0) glitchPulse--

        const dt = Math.min(0.05, Math.max(0, t - lastFrameT))
        lastFrameT = t

        // World shatter — run the fall clock forward, or rewind it to stitch
        if (shardState) {
          if (breakTarget === 1) {
            shardState.time = Math.min(shardState.time + dt, FALL_CLOCK_MAX)
          } else {
            shardState.time = Math.max(shardState.time - dt * 1.9, 0)
          }
          updateShards()
          const p = Math.min(1, shardState.time / 1.1)
          glitch = Math.max(glitch, p * (1 - p) * 1.6)
          if (breakTarget === 0 && shardState.time === 0) restoreWorld()
        }
        grainMat.uniforms.uGlitch.value = glitch

        if (!orbit.dragging && keysActive()) {
          if (keys.left) orbit.targetAzimuth += KEY_YAW * dt
          if (keys.right) orbit.targetAzimuth -= KEY_YAW * dt
          if (keys.up) {
            orbit.targetPolar = THREE.MathUtils.clamp(
              orbit.targetPolar - KEY_PITCH * dt,
              orbit.minPolar,
              orbit.maxPolar,
            )
          }
          if (keys.down) {
            orbit.targetPolar = THREE.MathUtils.clamp(
              orbit.targetPolar + KEY_PITCH * dt,
              orbit.minPolar,
              orbit.maxPolar,
            )
          }
          orbit.idleUntil = t + 6
          // Soft follow — eased, not snappy
          const ease = 1 - Math.exp(-2.2 * dt)
          orbit.azimuth += (orbit.targetAzimuth - orbit.azimuth) * ease
          orbit.polar += (orbit.targetPolar - orbit.polar) * ease
          applyOrbitCamera()
        } else if (!orbit.dragging) {
          if (t >= orbit.idleUntil) pickIdleTarget()
          // Slow random wander when idle
          orbit.azimuth += (orbit.targetAzimuth - orbit.azimuth) * 0.008
          orbit.polar += (orbit.targetPolar - orbit.polar) * 0.008
          orbit.radius += (orbit.targetRadius - orbit.radius) * 0.008
          applyOrbitCamera()
        }

        for (const b of birds) {
          const a = t * b.speed + b.phase
          b.mesh.position.set(
            b.center.x + Math.cos(a) * b.radius,
            b.height + Math.sin(a * 2.4) * 2.5,
            b.center.z + Math.sin(a) * b.radius,
          )
          b.mesh.rotation.y = -a + Math.PI / 2
          b.mesh.rotation.z = Math.sin(a * 6) * 0.35
        }

        for (const isl of islands) {
          const a = t * isl.speed + isl.phase
          isl.group.position.y = isl.baseY + Math.sin(a) * isl.amp
          isl.group.rotation.y += isl.spin * dt
        }

        for (const bl of balloons) {
          bl.group.position.x += bl.speed * dt
          bl.group.position.y = bl.baseY + Math.sin(t * 0.4 + bl.phase) * 1.4
          if (bl.group.position.x > worldW * 0.7) {
            bl.group.position.x = -worldW * 0.7
            bl.group.position.z = (Math.random() - 0.5) * worldD * 0.7
          }
        }

        for (const zp of zeppelins) {
          zp.group.position.x += zp.speed * dt
          zp.group.position.y = zp.baseY + Math.sin(t * 0.3 + zp.phase) * 0.8
          zp.group.rotation.z = Math.sin(t * 0.35 + zp.phase) * 0.03
          if (zp.group.position.x > worldW * 0.75) {
            zp.group.position.x = -worldW * 0.75
            zp.group.position.z = (Math.random() - 0.5) * worldD * 0.7
          }
        }

        // Seismic camera shake while pieces are breaking loose or knitting back
        if (shardState && shardState.time > 0 && shardState.time < 1.6) {
          const sh = (1 - shardState.time / 1.6) * 0.9
          camera.position.x += (Math.random() - 0.5) * sh
          camera.position.y += (Math.random() - 0.5) * sh
          camera.position.z += (Math.random() - 0.5) * sh * 0.5
        }

        renderer.setRenderTarget(sceneTarget)
        renderer.setClearColor(0x000000, 0)
        renderer.clear()
        renderer.render(scene, camera)
        renderer.setRenderTarget(null)
        renderer.setClearColor(0x000000, 0)
        renderer.render(composeScene, composeCamera)
        raf = requestAnimationFrame(animate)
      }

      const wake = () => {
        if (disposed || !renderer) return
        if (!activeRef.current || document.hidden) return
        if (!raf) raf = requestAnimationFrame(animate)
      }
      const pause = () => {
        if (raf) cancelAnimationFrame(raf)
        raf = 0
      }
      wakeRef.current = wake
      pauseRef.current = pause

      const onVisibility = () => {
        if (document.hidden) pause()
        else wake()
      }
      document.addEventListener('visibilitychange', onVisibility)

      resize()

      const onEnter = (e: PointerEvent) => {
        if (axeEl) axeEl.style.opacity = '1'
        placeAxe(e.clientX, e.clientY)
      }
      const onLeave = () => {
        if (axeEl) axeEl.style.opacity = '0'
      }
      if (axeEl) axeEl.style.opacity = '0'

      window.addEventListener('resize', resize)
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      window.addEventListener('blur', onBlurKeys)
      canvas.addEventListener('pointerdown', onDown)
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerup', onUp)
      canvas.addEventListener('pointercancel', onUp)
      canvas.addEventListener('pointerenter', onEnter)
      canvas.addEventListener('pointerleave', onLeave)
      canvas.addEventListener('wheel', onWheel, { passive: false })

      tearDown = () => {
        for (const id of breakTimers) window.clearTimeout(id)
        breakTimers.length = 0
        stitchRef.current = null
        if (shardState) {
          for (const m of shardState.terrainShards) m.geometry.dispose()
          shardState = null
        }
        if (raf) cancelAnimationFrame(raf)
        raf = 0
        document.removeEventListener('visibilitychange', onVisibility)
        window.removeEventListener('resize', resize)
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
        window.removeEventListener('blur', onBlurKeys)
        canvas.removeEventListener('pointerdown', onDown)
        canvas.removeEventListener('pointermove', onMove)
        canvas.removeEventListener('pointerup', onUp)
        canvas.removeEventListener('pointercancel', onUp)
        canvas.removeEventListener('pointerenter', onEnter)
        canvas.removeEventListener('pointerleave', onLeave)
        canvas.removeEventListener('wheel', onWheel)
        terrainGeo.dispose()
        terrainMat.dispose()
        skyGeo.dispose()
        skyMat.dispose()
        birdGeo.dispose()
        birdMat.dispose()
        trunkGeo.dispose()
        trunkMat.dispose()
        foliageGeo.dispose()
        foliageMat.dispose()
        trunkMesh.dispose()
        foliageMesh.dispose()
        crystalGeo.dispose()
        for (const m of crystalMats) m.dispose()
        for (const m of crystalMeshes) m.dispose()
        bushGeo.dispose()
        bushMat.dispose()
        bushMesh.dispose()
        rockGeo.dispose()
        rockMat.dispose()
        islandTreeGeo.dispose()
        islandTreeMat.dispose()
        for (const g of castleGeos) g.dispose()
        stoneMat.dispose()
        roofMat.dispose()
        windowMat.dispose()
        houseBodyGeo.dispose()
        houseRoofGeo.dispose()
        houseBodyMat.dispose()
        houseRoofMat.dispose()
        houseBodyMesh.dispose()
        houseRoofMesh.dispose()
        for (const g of pondGeos) g.dispose()
        pondMat.dispose()
        for (const g of streamGeos) g.dispose()
        streamMat.dispose()
        foamMat.dispose()
        for (const g of skyGeos) g.dispose()
        for (const m of skyMats) m.dispose()
        sceneTarget.dispose()
        grainMat.dispose()
        if (renderer) {
          renderer.dispose()
          renderer.forceContextLoss()
          if (renderer.domElement.parentElement === mount) {
            mount.removeChild(renderer.domElement)
          }
          renderer = null
        }
        tearDown = null
        wakeRef.current = null
        pauseRef.current = null
      }

      if (disposed) {
        tearDown()
        return
      }

      wake()
    }

    boot().catch((err) => {
      console.error('Failed to load Fitz Roy DEM', err)
    })

    return () => {
      disposed = true
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      stopHeroAudio()
      tearDown?.()
      tearDown = null
      wakeRef.current = null
      pauseRef.current = null
    }
  }, [])

  useEffect(() => {
    if (active) wakeRef.current?.()
    else pauseRef.current?.()
  }, [active])

  return (
    <div className="fog-hero" ref={mountRef}>
      <img
        className="fog-hero__axe"
        ref={axeRef}
        src="/cursors/ice-axe.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </div>
  )
}
