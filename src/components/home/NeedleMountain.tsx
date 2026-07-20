import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
attribute vec3 aBase;
attribute vec3 aNormal;
attribute float aLen;
attribute float aSeed;

uniform float uTime;
uniform vec3 uPointer;
uniform float uStrength;
uniform float uIdle;

varying float vShade;
varying float vLenFactor;

mat3 rotAlign(vec3 from, vec3 to) {
  vec3 axis = cross(from, to);
  float c = clamp(dot(from, to), -1.0, 1.0);
  float s = length(axis);
  if (s < 1e-5) {
    return mat3(1.0);
  }
  axis /= s;
  float k = 1.0 - c;
  return mat3(
    axis.x * axis.x * k + c,
    axis.x * axis.y * k + axis.z * s,
    axis.x * axis.z * k - axis.y * s,
    axis.y * axis.x * k - axis.z * s,
    axis.y * axis.y * k + c,
    axis.y * axis.z * k + axis.x * s,
    axis.z * axis.x * k + axis.y * s,
    axis.z * axis.y * k - axis.x * s,
    axis.z * axis.z * k + c
  );
}

void main() {
  float idleWave = sin(uTime * 0.95 + aSeed * 6.2831853 + aBase.x * 0.35 + aBase.z * 0.28) * 0.12 * uIdle;
  float idleWave2 = cos(uTime * 0.65 + aSeed * 4.1 + aBase.z * 0.4) * 0.08 * uIdle;

  vec3 tipDir = normalize(aNormal + vec3(idleWave, 0.0, idleWave2));

  float dist = length(aBase.xz - uPointer.xz);
  float falloff = exp(-dist * dist * 0.065) * uStrength;
  vec3 away = normalize(aBase - uPointer + vec3(0.001));
  tipDir = normalize(mix(tipDir, away + aNormal * 0.35, clamp(falloff, 0.0, 1.0)));

  float len = aLen * (1.0 + falloff * 0.35);
  mat3 basis = rotAlign(vec3(0.0, 1.0, 0.0), tipDir);

  vec3 local = position;
  // Cylinder is centered (-0.5..0.5); lift so base sits on terrain.
  float along = local.y + 0.5;
  local.y = along * len;
  local.xz *= mix(0.9, 0.2, along);

  vec3 world = aBase + basis * local;
  vShade = tipDir.y * 0.45 + 0.55 + falloff * 0.35;
  vLenFactor = along;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
}
`

const fragmentShader = /* glsl */ `
varying float vShade;
varying float vLenFactor;

void main() {
  vec3 silver = mix(vec3(0.55, 0.6, 0.66), vec3(0.95, 0.97, 1.0), vShade);
  silver += vec3(0.12, 0.16, 0.2) * pow(vLenFactor, 1.6);
  float alpha = mix(0.35, 0.95, vLenFactor) * (0.75 + 0.25 * vShade);
  gl_FragColor = vec4(silver, alpha);
}
`

function patagoniaHeight(x: number, z: number) {
  // Fitz Roy / Torres-like massifs: sharp granite spires + ridgelines
  const nx = x * 0.11
  const nz = z * 0.11
  const ridge =
    Math.exp(-Math.pow((nx + 0.2) * 1.1, 2) * 1.4) *
    Math.exp(-Math.pow(nz * 0.55, 2)) *
    4.8
  const fitz =
    Math.exp(-Math.pow(nx - 1.1, 2) * 3.2 - Math.pow(nz + 0.35, 2) * 2.4) * 6.2
  const torres =
    Math.exp(-Math.pow(nx + 1.35, 2) * 4.0 - Math.pow(nz - 0.15, 2) * 3.5) * 5.4
  const spur =
    Math.exp(-Math.pow(nx - 0.15, 2) * 2.2 - Math.pow(nz - 1.1, 2) * 2.8) * 3.6
  const foothills =
    Math.sin(nx * 2.4 + nz * 1.1) * 0.35 +
    Math.cos(nx * 1.3 - nz * 2.0) * 0.28 +
    Math.sin(nx * 5.5) * Math.cos(nz * 4.2) * 0.18
  const valley = Math.max(0, 1.15 - Math.abs(nz + 0.05) * 0.55)
  return Math.max(0.05, ridge + fitz + torres + spur + foothills * valley)
}

function sampleNormal(x: number, z: number) {
  const e = 0.08
  const hL = patagoniaHeight(x - e, z)
  const hR = patagoniaHeight(x + e, z)
  const hD = patagoniaHeight(x, z - e)
  const hU = patagoniaHeight(x, z + e)
  return new THREE.Vector3(hL - hR, 2 * e, hD - hU).normalize()
}

export function NeedleMountain() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.matchMedia('(max-width: 720px)').matches
    const cols = isMobile ? 90 : 140
    const rows = isMobile ? 56 : 86
    const count = cols * rows

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x070b0e, 1)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.set(0.4, isMobile ? 6.2 : 7.2, isMobile ? 11.5 : 13.2)
    camera.lookAt(0, 2.4, 0)

    const ambient = new THREE.AmbientLight(0xc5d0d8, 0.75)
    const key = new THREE.DirectionalLight(0xf7fafc, 1.7)
    key.position.set(6, 12, 4)
    const rim = new THREE.DirectionalLight(0xa8bfd0, 0.9)
    rim.position.set(-8, 4, -6)
    const glow = new THREE.PointLight(0xe8f0f6, 2.4, 45)
    glow.position.set(0, 6.5, 2)
    scene.add(ambient, key, rim, glow)

    // Soft reflective ground plane
    const groundGeo = new THREE.PlaneGeometry(48, 48, 1, 1)
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x10161b,
      metalness: 0.9,
      roughness: 0.28,
      transparent: true,
      opacity: 0.7,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.02
    scene.add(ground)

    // Solid mountain body for readable Patagonia silhouette
    const terrainSeg = isMobile ? 64 : 96
    const terrainGeo = new THREE.PlaneGeometry(18, 12, terrainSeg, terrainSeg)
    terrainGeo.rotateX(-Math.PI / 2)
    {
      const pos = terrainGeo.attributes.position
      for (let p = 0; p < pos.count; p++) {
        const x = pos.getX(p)
        const z = pos.getZ(p)
        pos.setY(p, patagoniaHeight(x, z) * 0.98)
      }
      pos.needsUpdate = true
      terrainGeo.computeVertexNormals()
    }
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xb7c2cc,
      metalness: 0.88,
      roughness: 0.28,
      emissive: 0x3a4650,
      emissiveIntensity: 0.35,
    })
    const terrain = new THREE.Mesh(terrainGeo, terrainMat)
    scene.add(terrain)

    const wire = new THREE.Mesh(
      terrainGeo.clone(),
      new THREE.MeshBasicMaterial({
        color: 0xd7e2ea,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      }),
    )
    wire.position.y = 0.01
    scene.add(wire)

    const baseNeedle = new THREE.CylinderGeometry(0.028, 0.008, 1, 5, 1)

    const bases = new Float32Array(count * 3)
    const normals = new Float32Array(count * 3)
    const lengths = new Float32Array(count)
    const seeds = new Float32Array(count)

    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const u = c / (cols - 1)
        const v = r / (rows - 1)
        const x = (u - 0.5) * 18
        const z = (v - 0.5) * 12
        const y = patagoniaHeight(x, z)
        const n = sampleNormal(x, z)
        bases[i * 3] = x
        bases[i * 3 + 1] = y
        bases[i * 3 + 2] = z
        normals[i * 3] = n.x
        normals[i * 3 + 1] = n.y
        normals[i * 3 + 2] = n.z
        lengths[i] = 0.28 + y * 0.16 + Math.random() * 0.12
        seeds[i] = Math.random()
        i++
      }
    }

    const needleGeo = new THREE.InstancedBufferGeometry()
    needleGeo.index = baseNeedle.index
    needleGeo.attributes.position = baseNeedle.attributes.position
    needleGeo.attributes.normal = baseNeedle.attributes.normal
    needleGeo.instanceCount = count
    needleGeo.setAttribute('aBase', new THREE.InstancedBufferAttribute(bases, 3))
    needleGeo.setAttribute(
      'aNormal',
      new THREE.InstancedBufferAttribute(normals, 3),
    )
    needleGeo.setAttribute('aLen', new THREE.InstancedBufferAttribute(lengths, 1))
    needleGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector3(0, 2, 0) },
        uStrength: { value: 0 },
        uIdle: { value: 1 },
      },
    })

    const needles = new THREE.Mesh(needleGeo, material)
    scene.add(needles)

    // Atmospheric haze sprites (simple lights)
    const hazeGeo = new THREE.SphereGeometry(0.35, 16, 16)
    const hazeMat = new THREE.MeshBasicMaterial({
      color: 0xcfd8e0,
      transparent: true,
      opacity: 0.08,
    })
    ;[
      [2.2, 5.5, -1],
      [-3.5, 4.2, 0.5],
      [0.5, 6.8, -2.2],
    ].forEach(([x, y, z]) => {
      const s = new THREE.Mesh(hazeGeo, hazeMat)
      s.position.set(x, y, z)
      s.scale.setScalar(6)
      scene.add(s)
    })

    const pointer = new THREE.Vector3(0, 2, 0)
    const targetPointer = new THREE.Vector3(0, 2, 0)
    let strength = 0
    let targetStrength = 0
    let idle = 1
    let raf = 0
    const startTime = performance.now()
    const raycaster = new THREE.Raycaster()
    const hitPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const ndc = new THREE.Vector2()

    const setPointerFromEvent = (clientX: number, clientY: number, boost: number) => {
      const rect = renderer.domElement.getBoundingClientRect()
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      const hit = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(hitPlane, hit)) {
        targetPointer.copy(hit)
        targetPointer.y = patagoniaHeight(hit.x, hit.z)
        targetStrength = Math.min(1.6, boost)
        idle = 0.25
      }
    }

    const onPointerMove = (e: PointerEvent) => setPointerFromEvent(e.clientX, e.clientY, 0.85)
    const onPointerDown = (e: PointerEvent) => setPointerFromEvent(e.clientX, e.clientY, 1.55)
    const onPointerLeave = () => {
      targetStrength = 0
      idle = 1
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerleave', onPointerLeave)

    let camAngle = 0.15
    const animate = () => {
      const t = (performance.now() - startTime) / 1000
      pointer.lerp(targetPointer, 0.08)
      strength += (targetStrength - strength) * 0.06
      targetStrength *= 0.985
      idle += ((targetStrength > 0.05 ? 0.2 : 1) - idle) * 0.02

      material.uniforms.uTime.value = t
      material.uniforms.uPointer.value.copy(pointer)
      material.uniforms.uStrength.value = strength
      material.uniforms.uIdle.value = idle

      camAngle += 0.00035
      camera.position.x = Math.sin(camAngle) * 0.35 + 0.4
      camera.position.y = (isMobile ? 6.2 : 7.2) + Math.sin(t * 0.2) * 0.12
      camera.lookAt(0, 2.4, 0)

      glow.intensity = 1.5 + Math.sin(t * 0.7) * 0.35
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      needleGeo.dispose()
      baseNeedle.dispose()
      material.dispose()
      terrainGeo.dispose()
      terrainMat.dispose()
      groundGeo.dispose()
      groundMat.dispose()
      hazeGeo.dispose()
      hazeMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div className="needle-mount" ref={mountRef} aria-hidden="true" />
}
