import { useEffect, useRef } from 'react'
import * as THREE from 'three'

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

const fogVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fogFragment = /* glsl */ `
uniform sampler2D uScene;
uniform sampler2D uMask;
uniform vec2 uPointer;
uniform float uZoom;
uniform vec3 uFogColor;
varying vec2 vUv;

void main() {
  float reveal = texture2D(uMask, vUv).r;
  float lens = smoothstep(0.05, 0.85, reveal);
  vec2 centered = vUv - uPointer;
  vec2 zoomedUv = uPointer + centered / mix(1.0, uZoom, lens);
  zoomedUv = clamp(zoomedUv, 0.001, 0.999);
  vec3 scene = texture2D(uScene, mix(vUv, zoomedUv, lens)).rgb;
  float fogAmount = 1.0 - smoothstep(0.0, 0.95, reveal);
  vec3 fogged = mix(scene, uFogColor, fogAmount * 0.9);
  float rim = smoothstep(0.15, 0.45, reveal) * (1.0 - smoothstep(0.55, 0.95, reveal));
  fogged += vec3(0.07, 0.09, 0.11) * rim * 0.4;
  gl_FragColor = vec4(fogged, 1.0);
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

async function loadDem() {
  const [meta, buffer] = await Promise.all([
    fetch('/fitz-roy/meta.json').then((r) => r.json() as Promise<DemMeta>),
    fetch('/fitz-roy/heightmap.f32').then((r) => r.arrayBuffer()),
  ])
  return { meta, elev: new Float32Array(buffer) }
}

export function FogRevealHero() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    let raf = 0
    let renderer: THREE.WebGLRenderer | null = null

    const boot = async () => {
      const { meta, elev } = await loadDem()
      if (disposed || !mount) return

      const isMobile = window.matchMedia('(max-width: 720px)').matches
      const segs = isMobile ? 160 : 256

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0xdde6ee, 1)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.08
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0xd5e0ea, 0.007)

      // Geographic extents → world meters, then fit into scene
      const latMid = (meta.bbox.north + meta.bbox.south) / 2
      const lonSpan = meta.bbox.east - meta.bbox.west
      const latSpan = meta.bbox.north - meta.bbox.south
      const mPerDegLon = 111_320 * Math.cos((latMid * Math.PI) / 180)
      const mPerDegLat = 110_540
      const realW = lonSpan * mPerDegLon
      const realD = latSpan * mPerDegLat
      const fit = 92 / realW
      const worldW = realW * fit
      const worldD = realD * fit
      // Exaggerate vertically so granite spires read at hero scale
      const vertExag = 2.65
      const elevSpan = Math.max(1, meta.elevationMax - meta.elevationMin)
      const heightScale = fit * vertExag

      const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 500)
      const peakH = (meta.elevationMax - meta.elevationMin) * heightScale
      camera.position.set(worldW * 0.08, peakH * 0.42, worldD * 0.62)
      camera.lookAt(0, peakH * 0.28, -worldD * 0.05)

      // Sky
      const skyGeo = new THREE.SphereGeometry(220, 32, 16)
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color(0xaec6dc) },
          uHorizon: { value: new THREE.Color(0xe7eef4) },
          uBottom: { value: new THREE.Color(0xd0dae4) },
        },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uBottom;
          varying vec3 vPos;
          void main() {
            float h = normalize(vPos).y;
            vec3 col = mix(uBottom, uHorizon, smoothstep(-0.15, 0.1, h));
            col = mix(col, uTop, smoothstep(0.1, 0.9, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      })
      scene.add(new THREE.Mesh(skyGeo, skyMat))

      // Terrain from GIS DEM — u: west→east, v: north→south (image row 0 = north tile)
      const terrainGeo = new THREE.PlaneGeometry(worldW, worldD, segs, segs)
      terrainGeo.rotateX(-Math.PI / 2)
      {
        const pos = terrainGeo.attributes.position
        const colors = new Float32Array(pos.count * 3)
        const cValley = new THREE.Color(0x6d7a6a)
        const cRock = new THREE.Color(0x8e969c)
        const cHigh = new THREE.Color(0xc5ccd2)
        const cSnow = new THREE.Color(0xf4f7f9)
        const tmp = new THREE.Color()

        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i)
          const z = pos.getZ(i)
          const u = (x / worldW + 0.5)
          // Plane z: -worldD/2 (north / -Z) → +worldD/2 (south)
          const v = (z / worldD + 0.5)
          const meters = sampleElev(elev, meta.width, meta.height, u, v)
          const y = (meters - meta.elevationMin) * heightScale
          pos.setY(i, y)

          const t = THREE.MathUtils.clamp(
            (meters - meta.elevationMin) / elevSpan,
            0,
            1,
          )
          if (t < 0.4) tmp.copy(cValley).lerp(cRock, t / 0.4)
          else if (t < 0.7) tmp.copy(cRock).lerp(cHigh, (t - 0.4) / 0.3)
          else tmp.copy(cHigh).lerp(cSnow, (t - 0.7) / 0.3)

          colors[i * 3] = tmp.r
          colors[i * 3 + 1] = tmp.g
          colors[i * 3 + 2] = tmp.b
        }
        pos.needsUpdate = true
        terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        terrainGeo.computeVertexNormals()
      }

      const terrainMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.86,
        metalness: 0.06,
      })
      const terrain = new THREE.Mesh(terrainGeo, terrainMat)
      scene.add(terrain)

      scene.add(new THREE.AmbientLight(0xd7e3ee, 0.7))
      const sun = new THREE.DirectionalLight(0xfff1df, 1.6)
      sun.position.set(40, 70, 25)
      scene.add(sun)
      const fill = new THREE.DirectionalLight(0xb4c7de, 0.55)
      fill.position.set(-30, 25, -20)
      scene.add(fill)

      const sceneTarget = new THREE.WebGLRenderTarget(1, 1, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      })

      const maskCanvas = document.createElement('canvas')
      const maskCtx = maskCanvas.getContext('2d')
      if (!maskCtx) return
      const maskTexture = new THREE.CanvasTexture(maskCanvas)
      maskTexture.flipY = true
      maskTexture.generateMipmaps = false

      const fillMaskFog = () => {
        maskCtx.globalCompositeOperation = 'source-over'
        maskCtx.fillStyle = '#000'
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
        maskCtx.globalCompositeOperation = 'lighter'
        const cx = maskCanvas.width * 0.55
        const cy = maskCanvas.height * 0.4
        const r = Math.min(maskCanvas.width, maskCanvas.height) * 0.4
        const g = maskCtx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, 'rgba(255,255,255,0.72)')
        g.addColorStop(0.5, 'rgba(255,255,255,0.28)')
        g.addColorStop(1, 'rgba(255,255,255,0)')
        maskCtx.fillStyle = g
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
        maskTexture.needsUpdate = true
      }

      const clearMaskAt = (nx: number, ny: number, radiusPx: number, strength: number) => {
        const x = nx * maskCanvas.width
        const y = (1 - ny) * maskCanvas.height
        maskCtx.globalCompositeOperation = 'lighter'
        const g = maskCtx.createRadialGradient(x, y, 0, x, y, radiusPx)
        const a = Math.min(1, strength)
        g.addColorStop(0, `rgba(255,255,255,${0.85 * a})`)
        g.addColorStop(0.4, `rgba(255,255,255,${0.38 * a})`)
        g.addColorStop(1, 'rgba(255,255,255,0)')
        maskCtx.fillStyle = g
        maskCtx.beginPath()
        maskCtx.arc(x, y, radiusPx, 0, Math.PI * 2)
        maskCtx.fill()
        maskTexture.needsUpdate = true
      }

      const composeScene = new THREE.Scene()
      const composeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const composeMat = new THREE.ShaderMaterial({
        uniforms: {
          uScene: { value: sceneTarget.texture },
          uMask: { value: maskTexture },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uZoom: { value: 1.28 },
          uFogColor: { value: new THREE.Color(0xdce6ef) },
        },
        vertexShader: fogVertex,
        fragmentShader: fogFragment,
        depthTest: false,
        depthWrite: false,
      })
      composeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), composeMat))

      const pointer = { x: 0.55, y: 0.48, active: false, force: 0 }
      const target = { x: 0.55, y: 0.48 }
      let camAngle = 0.05
      const start = performance.now()

      const resize = () => {
        if (!renderer) return
        const w = mount.clientWidth
        const h = mount.clientHeight
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        renderer.setSize(w, h, false)
        renderer.domElement.style.width = `${w}px`
        renderer.domElement.style.height = `${h}px`
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        sceneTarget.setSize(Math.floor(w * dpr), Math.floor(h * dpr))
        const maskScale = isMobile ? 0.5 : 0.65
        maskCanvas.width = Math.max(1, Math.floor(w * maskScale))
        maskCanvas.height = Math.max(1, Math.floor(h * maskScale))
        fillMaskFog()
      }

      const setFromEvent = (clientX: number, clientY: number, boost: number) => {
        if (!renderer) return
        const rect = renderer.domElement.getBoundingClientRect()
        target.x = (clientX - rect.left) / rect.width
        target.y = 1 - (clientY - rect.top) / rect.height
        pointer.active = true
        pointer.force = Math.min(1.5, pointer.force + boost)
      }

      const onMove = (e: PointerEvent) => setFromEvent(e.clientX, e.clientY, 0.22)
      const onDown = (e: PointerEvent) => setFromEvent(e.clientX, e.clientY, 0.85)
      const onLeave = () => {
        pointer.active = false
      }

      const animate = () => {
        if (!renderer || disposed) return
        const t = (performance.now() - start) / 1000
        pointer.x += (target.x - pointer.x) * 0.12
        pointer.y += (target.y - pointer.y) * 0.12

        const baseR = Math.min(maskCanvas.width, maskCanvas.height)
        if (pointer.active || pointer.force > 0.02) {
          clearMaskAt(
            pointer.x,
            pointer.y,
            baseR * (0.18 + pointer.force * 0.14),
            0.5 + pointer.force * 0.45,
          )
          pointer.force *= 0.9
        } else {
          clearMaskAt(
            0.52 + Math.sin(t * 0.16) * 0.18,
            0.48 + Math.cos(t * 0.12) * 0.1,
            baseR * 0.12,
            0.055,
          )
        }

        maskCtx.globalCompositeOperation = 'source-over'
        maskCtx.fillStyle = 'rgba(0,0,0,0.011)'
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
        maskTexture.needsUpdate = true

        camAngle += 0.00022
        camera.position.x = worldW * 0.08 + Math.sin(camAngle) * 2.8
        camera.position.y = peakH * 0.4 + Math.sin(t * 0.14) * 0.35
        camera.position.z = worldD * 0.6 + Math.cos(camAngle * 0.8) * 1.4
        camera.lookAt(
          (pointer.x - 0.5) * worldW * 0.08,
          peakH * 0.26 + (pointer.y - 0.5) * 2,
          -worldD * 0.04,
        )

        composeMat.uniforms.uPointer.value.set(pointer.x, pointer.y)
        composeMat.uniforms.uZoom.value = 1.26 + pointer.force * 0.16

        renderer.setRenderTarget(sceneTarget)
        renderer.render(scene, camera)
        renderer.setRenderTarget(null)
        renderer.render(composeScene, composeCamera)
        raf = requestAnimationFrame(animate)
      }

      resize()
      animate()

      window.addEventListener('resize', resize)
      renderer.domElement.addEventListener('pointermove', onMove)
      renderer.domElement.addEventListener('pointerdown', onDown)
      renderer.domElement.addEventListener('pointerleave', onLeave)
      renderer.domElement.addEventListener('pointerup', onLeave)

      // stash cleanup on mount element
      ;(mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
        renderer?.domElement.removeEventListener('pointermove', onMove)
        renderer?.domElement.removeEventListener('pointerdown', onDown)
        renderer?.domElement.removeEventListener('pointerleave', onLeave)
        renderer?.domElement.removeEventListener('pointerup', onLeave)
        terrainGeo.dispose()
        terrainMat.dispose()
        skyGeo.dispose()
        skyMat.dispose()
        sceneTarget.dispose()
        maskTexture.dispose()
        composeMat.dispose()
        renderer?.dispose()
        if (renderer?.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement)
        }
      }
    }

    boot().catch((err) => {
      console.error('Failed to load Fitz Roy DEM', err)
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      const el = mount as HTMLDivElement & { __cleanup?: () => void }
      el.__cleanup?.()
      el.__cleanup = undefined
    }
  }, [])

  return (
    <div className="fog-hero" ref={mountRef} aria-hidden="true">
      <p className="fog-hero__credit">
        Terrain: Cerro Fitz Roy · AWS Terrain Tiles (GIS)
      </p>
    </div>
  )
}
