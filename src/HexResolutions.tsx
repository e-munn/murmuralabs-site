import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SQRT7 = Math.sqrt(7)
const AP7_ROT = Math.atan2(Math.sqrt(3), 5) // ~19.1°

function hexCorners(r: number, rot: number): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot
    pts.push([r * Math.cos(a), r * Math.sin(a)])
  }
  return pts
}

function makeHexPrism(
  r: number, h: number, rot: number,
  edgeColor: number, edgeOpacity: number,
): THREE.Group {
  const group = new THREE.Group()
  const corners = hexCorners(r, rot)

  const pts: number[] = []
  for (let i = 0; i < 6; i++) {
    const [x1, z1] = corners[i]
    const [x2, z2] = corners[(i + 1) % 6]
    pts.push(x1, 0, z1, x2, 0, z2)
    pts.push(x1, h, z1, x2, h, z2)
    pts.push(x1, 0, z1, x1, h, z1)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  const mat = new THREE.LineBasicMaterial({
    color: edgeColor, transparent: true, opacity: edgeOpacity,
  })
  group.add(new THREE.LineSegments(geo, mat))
  return group
}

function honeycomb(r: number, rot: number, rings: number): [number, number][] {
  if (rings === 0) return [[0, 0]]
  const dist = r * Math.sqrt(3)
  const dirs: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + rot
    dirs.push([dist * Math.cos(a), dist * Math.sin(a)])
  }

  const centers: [number, number][] = [[0, 0]]
  const seen = new Set<string>()
  seen.add('0,0')

  for (let ring = 1; ring <= rings; ring++) {
    let x = dirs[4][0] * ring
    let y = dirs[4][1] * ring
    for (let side = 0; side < 6; side++) {
      for (let step = 0; step < ring; step++) {
        const key = `${Math.round(x * 100)},${Math.round(y * 100)}`
        if (!seen.has(key)) {
          seen.add(key)
          centers.push([x, y])
        }
        x += dirs[side][0]
        y += dirs[side][1]
      }
    }
  }
  return centers
}

export default function HexResolutions({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    // H3 aperture-7 radii and rotations
    const rot3 = 0
    const R3 = 1.2

    const rot2 = rot3 + AP7_ROT
    const R2 = R3 * SQRT7

    const rot1 = rot2 + AP7_ROT
    const R1 = R2 * SQRT7 // R3 * 7

    const H = 1.5
    const layerGap = 3.5

    // Isometric camera — centered on middle layer
    const frustum = 22
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 200)
    const centerY = -(H + layerGap)
    camera.position.set(18, 14 + centerY, 18)
    camera.lookAt(0, centerY, 0)

    // Layer 1: 1 parent — top
    const layer1 = honeycomb(R1, rot1, 0)
    for (const [cx, cz] of layer1) {
      const prism = makeHexPrism(R1, H, rot1, 0xFFE4CC, 0.6)
      prism.position.set(cx, 0, cz)
      scene.add(prism)
    }

    // Layer 2: 7 cells — middle
    const layer2 = honeycomb(R2, rot2, 1)
    for (const [cx, cz] of layer2) {
      const prism = makeHexPrism(R2, H, rot2, 0xc6a181, 0.5)
      prism.position.set(cx, -(H + layerGap), cz)
      scene.add(prism)
    }

    // Layer 3: ~60 cells — bottom
    const layer3 = honeycomb(R3, rot3, 4)
    for (const [cx, cz] of layer3) {
      const prism = makeHexPrism(R3, H, rot3, 0x7f5e46, 0.4)
      prism.position.set(cx, -2 * (H + layerGap), cz)
      scene.add(prism)
    }

    // Sizing
    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h)
      const aspect = w / h
      camera.left = -frustum * aspect
      camera.right = frustum * aspect
      camera.top = frustum
      camera.bottom = -frustum
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    const animate = () => {
      frame = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    />
  )
}
