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
  vec3 cValley = vec3(0.72, 0.82, 0.88);
  vec3 cMeadow = vec3(0.78, 0.88, 0.84);
  vec3 cSlope  = vec3(0.82, 0.78, 0.86);
  vec3 cRock   = vec3(0.74, 0.78, 0.88);
  vec3 cHigh   = vec3(0.88, 0.90, 0.96);
  vec3 cSnow   = vec3(0.98, 0.97, 1.0);

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
  float lit = mix(0.72, 1.2, smoothstep(0.0, 1.0, ndl));
  vec3 warm = vec3(1.0, 0.9, 0.94);
  vec3 cool = vec3(0.78, 0.88, 1.0);
  vec3 shade = mix(cool, warm, ndl * 0.85 + 0.15);
  vec3 col = albedo * lit * shade;

  float valleyMist = (1.0 - smoothstep(0.05, 0.4, vElev)) * 0.28;
  valleyMist *= 0.9 + 0.1 * sin(uTime * 0.12 + vWorldPos.x * 0.02);
  col = mix(col, uFogColor, valleyMist);

  float dist = length(vWorldPos);
  float fog = smoothstep(uFogNear, uFogFar, dist) * 0.45;
  col = mix(col, uFogColor, fog);

  float snowAmt = smoothstep(0.5, 0.78, vElev);
  float spark = step(0.988, fract(sin(dot(vWorldPos.xz, vec2(12.9898, 78.233))) * 43758.5453));
  col += spark * snowAmt * 0.55;

  // Fine surface grain
  float g = fract(sin(dot(vWorldPos.xz * 12.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.035;

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
  vec3 top = mix(uTop, vec3(0.78, 0.72, 0.92), drift * 0.35);
  vec3 mid = mix(uMid, vec3(0.92, 0.86, 0.96), (1.0 - drift) * 0.3);
  vec3 hor = mix(uHorizon, vec3(0.98, 0.88, 0.92), sin(uTime * 0.05 + 1.2) * 0.25 + 0.25);

  vec3 col = mix(uBottom, hor, smoothstep(-0.2, 0.1, h));
  col = mix(col, mid, smoothstep(0.1, 0.45, h));
  col = mix(col, top, smoothstep(0.45, 0.95, h));

  // Soft aurora ribbons near the horizon / mid sky
  float ribbon = sin(n.x * 6.0 + uTime * 0.12) * cos(n.z * 4.0 - uTime * 0.08);
  ribbon = smoothstep(0.35, 0.9, ribbon) * smoothstep(-0.05, 0.25, h) * (1.0 - smoothstep(0.55, 0.9, h));
  col += vec3(0.35, 0.2, 0.4) * ribbon * 0.18;
  col += vec3(0.2, 0.35, 0.55) * ribbon * 0.12 * (sin(uTime * 0.2) * 0.5 + 0.5);

  // Drifting cloud bands
  float clouds = sin(n.x * 7.0 + uTime * 0.018) * sin(n.z * 4.5 - uTime * 0.012);
  clouds = smoothstep(0.2, 0.78, clouds) * smoothstep(0.02, 0.4, h) * (1.0 - smoothstep(0.5, 0.92, h));
  col = mix(col, vec3(1.0, 0.96, 0.98), clouds * 0.55);

  // Gentle shimmer stars / dust high up
  float twinkle = step(0.997, fract(sin(dot(n.xy + uTime * 0.001, vec2(12.9898, 78.233))) * 43758.5453));
  col += twinkle * smoothstep(0.35, 0.9, h) * 0.55;

  // Breathing brightness
  col *= 0.96 + 0.04 * sin(uTime * 0.15);

  gl_FragColor = vec4(col, 1.0);
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
    vec3 pink = vec3(1.0, 0.55, 0.82);
    vec3 blue = vec3(0.45, 0.78, 1.0);
    float which = step(0.5, hash(vec2(floor(uv.y * 20.0), floor(uTime * 12.0))));
    col = mix(col, mix(pink, blue, which), scan * 0.55 * g);
    col = mix(col, pink, hash(uv * 40.0 + uTime) * 0.12 * g);
    col = mix(col, blue, hash(uv.yx * 55.0 - uTime) * 0.12 * g);
    // Brief horizontal noise bars
    float bar = step(0.92, hash(vec2(floor(uv.y * 90.0), floor(uTime * 50.0))));
    col += mix(pink, blue, which) * bar * 0.35 * g;
  }

  float n = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime * 12.7));
  float n2 = hash(vUv * vec2(911.0, 643.0) - fract(uTime * 7.3));
  float grain = (n * 0.7 + n2 * 0.3) - 0.5;
  col += grain * (uStrength + g * 0.08);

  float vig = smoothstep(1.15, 0.35, length(vUv - 0.5));
  col *= mix(0.92, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
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

export function FogRevealHero({ active = true }: { active?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const axeRef = useRef<HTMLImageElement>(null)
  const activeRef = useRef(active)
  const wakeRef = useRef<(() => void) | null>(null)
  const pauseRef = useRef<(() => void) | null>(null)
  activeRef.current = active

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
      const segs = isMobile ? 240 : 384

      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
      renderer.setClearColor(0xf0e8f4, 1)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.38
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
      const fogColor = new THREE.Color(0xf2eaf4)
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
        radius: span * 0.28,
        minPolar: 0.45,
        maxPolar: 1.2,
        minRadius: span * 0.14,
        maxRadius: span * 0.34,
        dragging: false,
        lastX: 0,
        lastY: 0,
        idleUntil: 0,
        targetAzimuth: 0.72,
        targetPolar: Math.PI / 2 - Math.PI / 6,
        targetRadius: span * 0.28,
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
        uniforms: {
          uTop: { value: new THREE.Color(0xb8d4f0) },
          uMid: { value: new THREE.Color(0xd8e8f8) },
          uHorizon: { value: new THREE.Color(0xf6e4ee) },
          uBottom: { value: new THREE.Color(0xe8d8ec) },
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
      scene.add(new THREE.Mesh(skyGeo, skyMat))

      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(Math.max(worldW, worldD) * 2.8, 64),
        new THREE.MeshBasicMaterial({ color: 0xd8e4f0 }),
      )
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -0.8
      scene.add(ground)

      const river = new THREE.Mesh(
        new THREE.PlaneGeometry(worldW * 0.08, worldD * 1.1, 1, 24),
        new THREE.MeshBasicMaterial({
          color: 0xa8d8f0,
          transparent: true,
          opacity: 0.65,
        }),
      )
      river.rotation.x = -Math.PI / 2
      river.rotation.z = 0.18
      river.position.set(-worldW * 0.05, -0.2, 0)
      scene.add(river)

      const terrainGeo = new THREE.PlaneGeometry(worldW, worldD, segs, segs)
      terrainGeo.rotateX(-Math.PI / 2)
      const elevNorm = new Float32Array(terrainGeo.attributes.position.count)
      {
        const pos = terrainGeo.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i)
          const z = pos.getZ(i)
          const u = x / worldW + 0.5
          const v = z / worldD + 0.5
          const meters = Math.max(elevMin, sampleElev(elev, meta.width, meta.height, u, v))
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
      scene.add(new THREE.Mesh(terrainGeo, terrainMat))

      // Birds
      const birdGeo = makeBirdGeometry()
      const birdMat = new THREE.MeshBasicMaterial({
        color: 0x6a7a90,
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

      // Soft point sprites — colorful + dense without mesh cost
      // Dense but CPU-safe — full per-frame updates of 300k+ points cause freezes
      const bubbleCount = isMobile ? 48_000 : 96_000
      const bubbleCanvas = document.createElement('canvas')
      bubbleCanvas.width = bubbleCanvas.height = 64
      const bctx = bubbleCanvas.getContext('2d')!
      const grad = bctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255,255,255,0.95)')
      grad.addColorStop(0.28, 'rgba(255,255,255,0.7)')
      grad.addColorStop(0.55, 'rgba(255,255,255,0.22)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      bctx.fillStyle = grad
      bctx.fillRect(0, 0, 64, 64)
      const bubbleTex = new THREE.CanvasTexture(bubbleCanvas)
      bubbleTex.colorSpace = THREE.SRGBColorSpace

      const bubblePositions = new Float32Array(bubbleCount * 3)
      const bubbleColors = new Float32Array(bubbleCount * 3)
      const baseX = new Float32Array(bubbleCount)
      const baseY = new Float32Array(bubbleCount)
      const baseZ = new Float32Array(bubbleCount)
      const phaseA = new Float32Array(bubbleCount)
      const speedA = new Float32Array(bubbleCount)
      const ampX = new Float32Array(bubbleCount)
      const ampY = new Float32Array(bubbleCount)
      const ampZ = new Float32Array(bubbleCount)
      const offX = new Float32Array(bubbleCount)
      const offY = new Float32Array(bubbleCount)
      const offZ = new Float32Array(bubbleCount)
      const velX = new Float32Array(bubbleCount)
      const velY = new Float32Array(bubbleCount)
      const velZ = new Float32Array(bubbleCount)
      const posX = new Float32Array(bubbleCount)
      const posY = new Float32Array(bubbleCount)
      const posZ = new Float32Array(bubbleCount)
      const reactA = new Float32Array(bubbleCount)
      const lightPink = new THREE.Color(0xffc2de)
      const lightSky = new THREE.Color(0xb8e7ff)
      const tint = new THREE.Color()
      const groundY = peakH * 0.02

      for (let i = 0; i < bubbleCount; i++) {
        baseX[i] = (Math.random() - 0.5) * worldW * 1.05
        // Rise height above ground — bubbles always originate at ground level
        ampY[i] = peakH * (0.18 + Math.random() * 0.55)
        baseY[i] = groundY
        baseZ[i] = (Math.random() - 0.5) * worldD * 1.05
        phaseA[i] = Math.random() * Math.PI * 2
        speedA[i] = 0.3 + Math.random() * 0.6
        ampX[i] = 1.0 + Math.random() * 3.4
        ampZ[i] = 1.0 + Math.random() * 3.4
        reactA[i] = 0.55 + Math.random() * 0.85
        const a0 = phaseA[i]
        const y0 = groundY + (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(a0))) * ampY[i]
        posX[i] = baseX[i]
        posY[i] = y0
        posZ[i] = baseZ[i]
        bubblePositions[i * 3] = baseX[i]
        bubblePositions[i * 3 + 1] = y0
        bubblePositions[i * 3 + 2] = baseZ[i]
        tint.copy(lightPink).lerp(lightSky, Math.random() < 0.5 ? 0 : 1)
        bubbleColors[i * 3] = tint.r
        bubbleColors[i * 3 + 1] = tint.g
        bubbleColors[i * 3 + 2] = tint.b
      }

      const bubbleDriftY = (i: number, a: number) =>
        groundY + (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(a))) * ampY[i]

      const bubbleScales = new Float32Array(bubbleCount)
      const regenDelay = new Float32Array(bubbleCount)
      for (let i = 0; i < bubbleCount; i++) bubbleScales[i] = 1

      const bubbleGeo = new THREE.BufferGeometry()
      const bubblePosAttr = new THREE.BufferAttribute(bubblePositions, 3)
      bubblePosAttr.setUsage(THREE.DynamicDrawUsage)
      const bubbleScaleAttr = new THREE.BufferAttribute(bubbleScales, 1)
      bubbleScaleAttr.setUsage(THREE.DynamicDrawUsage)
      bubbleGeo.setAttribute('position', bubblePosAttr)
      bubbleGeo.setAttribute('color', new THREE.BufferAttribute(bubbleColors, 3))
      bubbleGeo.setAttribute('aScale', bubbleScaleAttr)

      const bubbleSizeBase = isMobile ? 1.35 : 1.85
      const bubbleMat = new THREE.PointsMaterial({
        size: bubbleSizeBase,
        map: bubbleTex,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        sizeAttenuation: true,
        toneMapped: false,
      })
      bubbleMat.onBeforeCompile = (shader) => {
        shader.vertexShader =
          'attribute float aScale;\n' +
          shader.vertexShader.replace(
            'gl_PointSize = size;',
            'gl_PointSize = size * max(aScale, 0.0);',
          )
      }
      bubbleMat.customProgramCacheKey = () => 'bubble-ascale'

      const bubblePoints = new THREE.Points(bubbleGeo, bubbleMat)
      bubblePoints.frustumCulled = false
      scene.add(bubblePoints)

      const writeBubblePos = (i: number, x: number, y: number, z: number) => {
        const o = i * 3
        bubblePositions[o] = x
        bubblePositions[o + 1] = y
        bubblePositions[o + 2] = z
      }

      const pointerNdc = new THREE.Vector2(0, 0)
      const pointerVel = new THREE.Vector2(0, 0)
      const mouseWorld = new THREE.Vector3()
      const camDir = new THREE.Vector3()
      const bubbleRay = new THREE.Raycaster()
      const bubblePlane = new THREE.Plane()
      let pointerLive = false
      let exploding = false
      let regenerating = false
      let explodeStart = 0
      let regenStart = 0
      const EXPLODE_DUR = 0.9
      const REGEN_STAGGER = 7.5
      const REGEN_GROW = 2.2
      let lastBubbleT = 0

      const syncMouseWorld = () => {
        camera.getWorldDirection(camDir)
        bubblePlane.setFromNormalAndCoplanarPoint(camDir, lookTarget)
        bubbleRay.setFromCamera(pointerNdc, camera)
        return bubbleRay.ray.intersectPlane(bubblePlane, mouseWorld)
      }

      const explodeBubbles = () => {
        const hit = syncMouseWorld()
        const ox = hit ? mouseWorld.x : 0
        const oy = hit ? mouseWorld.y : peakH * 0.4
        const oz = hit ? mouseWorld.z : 0
        const t = tNow()
        for (let i = 0; i < bubbleCount; i++) {
          const a = t * speedA[i] + phaseA[i]
          const px = baseX[i] + Math.sin(a * 0.65) * ampX[i] + offX[i]
          const py = bubbleDriftY(i, a) + offY[i]
          const pz = baseZ[i] + Math.cos(a * 0.5) * ampZ[i] + offZ[i]
          posX[i] = px
          posY[i] = py
          posZ[i] = pz
          let dx = px - ox + (Math.random() - 0.5) * 2
          let dy = py - oy + (Math.random() - 0.5) * 2
          let dz = pz - oz + (Math.random() - 0.5) * 2
          const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
          const speed = 35 + Math.random() * 95
          velX[i] = (dx / len) * speed
          velY[i] = (dy / len) * speed + 10 + Math.random() * 25
          velZ[i] = (dz / len) * speed
          offX[i] = 0
          offY[i] = 0
          offZ[i] = 0
          bubbleScales[i] = 1
        }
        regenerating = false
        exploding = true
        explodeStart = t
        bubbleScaleAttr.needsUpdate = true
      }

      scene.add(new THREE.AmbientLight(0xf0e8f8, 0.85))
      const sun = new THREE.DirectionalLight(0xfff0f6, 1.25)
      sun.position.copy(sunDir).multiplyScalar(200)
      scene.add(sun)
      const fill = new THREE.DirectionalLight(0xc8e0ff, 0.65)
      fill.position.set(-100, 80, -80)
      scene.add(fill)
      const rim = new THREE.DirectionalLight(0xffd0e4, 0.45)
      rim.position.set(60, 50, 120)
      scene.add(rim)

      // Grain post pass
      const sceneTarget = new THREE.WebGLRenderTarget(1, 1, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      })
      const composeScene = new THREE.Scene()
      const composeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const grainMat = new THREE.ShaderMaterial({
        uniforms: {
          uScene: { value: sceneTarget.texture },
          uTime: { value: 0 },
          uStrength: { value: isMobile ? 0.055 : 0.075 },
          uGlitch: { value: 0 },
        },
        vertexShader: grainVertex,
        fragmentShader: grainFragment,
        depthTest: false,
        depthWrite: false,
      })
      composeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), grainMat))

      const canvas = renderer.domElement
      const start = performance.now()
      let glitchUntil = 0
      const tNow = () => performance.now() / 1000

      const placeAxe = (clientX: number, clientY: number) => {
        if (!axeEl) return
        const rect = mount.getBoundingClientRect()
        axeEl.style.left = `${clientX - rect.left}px`
        axeEl.style.top = `${clientY - rect.top}px`
      }

      const strike = (clientX: number, clientY: number) => {
        placeAxe(clientX, clientY)
        const rect = canvas.getBoundingClientRect()
        pointerNdc.set(
          ((clientX - rect.left) / rect.width) * 2 - 1,
          -(((clientY - rect.top) / rect.height) * 2 - 1),
        )
        mount.classList.add('fog-hero--striking')
        axeEl?.classList.remove('fog-hero__axe--hit')
        // reflow so animation restarts
        void axeEl?.offsetWidth
        axeEl?.classList.add('fog-hero__axe--hit')
        playCrackSound()
        explodeBubbles()
        glitchUntil = tNow() + 0.16 + Math.random() * 0.14
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
        const rect = canvas.getBoundingClientRect()
        pointerNdc.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -(((e.clientY - rect.top) / rect.height) * 2 - 1),
        )
        pointerLive = true
        strike(e.clientX, e.clientY)
        canvas.setPointerCapture(e.pointerId)
      }

      const onMove = (e: PointerEvent) => {
        placeAxe(e.clientX, e.clientY)
        const rect = canvas.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
        pointerVel.set(nx - pointerNdc.x, ny - pointerNdc.y)
        pointerNdc.set(nx, ny)
        pointerLive = true

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

      let frameParity = 0
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
        let glitch = 0
        if (t < glitchUntil) {
          const remain = glitchUntil - t
          glitch = Math.min(1, remain * 10) * (0.7 + 0.3 * Math.sin(t * 100))
          if (Math.random() > 0.65) glitch = Math.min(1, glitch + 0.4)
        }
        grainMat.uniforms.uGlitch.value = glitch

        const dt = Math.min(0.05, Math.max(0, t - lastBubbleT))
        lastBubbleT = t

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

        if (exploding) {
          const progress = Math.min(1, (t - explodeStart) / EXPLODE_DUR)
          const shrink = (1 - progress) * (1 - progress)
          for (let i = 0; i < bubbleCount; i++) {
            velY[i] -= 40 * dt
            posX[i] += velX[i] * dt
            posY[i] += velY[i] * dt
            posZ[i] += velZ[i] * dt
            velX[i] *= 0.985
            velY[i] *= 0.985
            velZ[i] *= 0.985
            bubbleScales[i] = shrink * (1.1 + (1 - progress) * 0.4)
            writeBubblePos(i, posX[i], posY[i], posZ[i])
          }
          bubblePosAttr.needsUpdate = true
          bubbleScaleAttr.needsUpdate = true
          if (progress >= 1) {
            exploding = false
            regenerating = true
            regenStart = t
            for (let i = 0; i < bubbleCount; i++) {
              velX[i] = 0
              velY[i] = 0
              velZ[i] = 0
              offX[i] = 0
              offY[i] = 0
              offZ[i] = 0
              phaseA[i] = Math.random() * Math.PI * 2
              regenDelay[i] = Math.random() * REGEN_STAGGER
              bubbleScales[i] = 0
              writeBubblePos(i, baseX[i], groundY, baseZ[i])
            }
            bubblePosAttr.needsUpdate = true
            bubbleScaleAttr.needsUpdate = true
          }
        } else if (regenerating) {
          let pending = 0
          for (let i = 0; i < bubbleCount; i++) {
            const age = t - regenStart - regenDelay[i]
            if (age <= 0) {
              bubbleScales[i] = 0
              pending++
              writeBubblePos(i, baseX[i], groundY, baseZ[i])
              continue
            }
            const grow = Math.min(1, age / REGEN_GROW)
            const ease = 1 - (1 - grow) * (1 - grow)
            bubbleScales[i] = ease
            if (grow < 1) pending++

            const a = t * speedA[i] + phaseA[i]
            const driftX = baseX[i] + Math.sin(a * 0.65) * ampX[i]
            const driftY = bubbleDriftY(i, a)
            const driftZ = baseZ[i] + Math.cos(a * 0.5) * ampZ[i]
            // Rise from ground into float height
            const y = groundY + (driftY - groundY) * ease
            writeBubblePos(i, driftX, y, driftZ)
          }
          bubblePosAttr.needsUpdate = true
          bubbleScaleAttr.needsUpdate = true
          if (pending === 0) regenerating = false
        } else {
          const hit = syncMouseWorld()
          const influenceR = span * 0.24
          const influenceR2 = influenceR * influenceR
          const mx = mouseWorld.x
          const my = mouseWorld.y
          const mz = mouseWorld.z
          const pvx = pointerVel.x
          const pvy = pointerVel.y
          // Idle float: stagger updates (1/4 of bubbles per frame) when the cursor is idle
          for (let i = 0; i < bubbleCount; i++) {
            if (!pointerLive && (i & 3) !== frameParity) continue
            const a = t * speedA[i] + phaseA[i]
            const driftX = baseX[i] + Math.sin(a * 0.65) * ampX[i]
            const driftY = bubbleDriftY(i, a)
            const driftZ = baseZ[i] + Math.cos(a * 0.5) * ampZ[i]

            let ox = offX[i]
            let oy = offY[i]
            let oz = offZ[i]

            if (pointerLive && hit) {
              const dx = driftX - mx
              const dy = driftY - my
              const dz = driftZ - mz
              const d2 = dx * dx + dy * dy + dz * dz
              if (d2 < influenceR2 && d2 > 1e-4) {
                const d = Math.sqrt(d2)
                const falloff = 1 - d / influenceR
                const force = falloff * falloff * 10 * reactA[i]
                const inv = force / d
                const tx = dx * inv + pvx * 18 * reactA[i] * falloff
                const ty = dy * inv + pvy * 14 * reactA[i] * falloff
                const tz = dz * inv
                ox += (tx - ox) * 0.14
                oy += (ty - oy) * 0.14
                oz += (tz - oz) * 0.14
              } else {
                ox *= 0.9
                oy *= 0.9
                oz *= 0.9
              }
            } else {
              ox *= 0.92
              oy *= 0.92
              oz *= 0.92
            }

            offX[i] = ox
            offY[i] = oy
            offZ[i] = oz
            writeBubblePos(i, driftX + ox, driftY + oy, driftZ + oz)
          }
          frameParity = (frameParity + 1) & 3
          bubblePosAttr.needsUpdate = true
        }
        pointerVel.multiplyScalar(0.85)

        renderer.setRenderTarget(sceneTarget)
        renderer.render(scene, camera)
        renderer.setRenderTarget(null)
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
        pointerLive = true
      }
      const onLeave = () => {
        if (axeEl) axeEl.style.opacity = '0'
        pointerLive = false
        pointerVel.set(0, 0)
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
        bubbleGeo.dispose()
        bubbleMat.dispose()
        bubbleTex.dispose()
        ground.geometry.dispose()
        ;(ground.material as THREE.Material).dispose()
        river.geometry.dispose()
        ;(river.material as THREE.Material).dispose()
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
    <div className="fog-hero" ref={mountRef} aria-hidden="true">
      <img
        className="fog-hero__axe"
        ref={axeRef}
        src="/cursors/ice-axe.svg"
        alt=""
        draggable={false}
      />
    </div>
  )
}
