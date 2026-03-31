import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Hex helpers ──────────────────────────────────────────────
function hexCorners(cx: number, cy: number, r: number): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)])
  }
  return pts
}

function hexRingPositions(r: number, rings: number): [number, number][] {
  const positions: [number, number][] = [[0, 0]]
  const dx = r * 1.5
  const dy = r * Math.sqrt(3)
  for (let q = -rings; q <= rings; q++) {
    for (let s = -rings; s <= rings; s++) {
      const rr = -q - s
      if (Math.abs(rr) > rings) continue
      if (q === 0 && s === 0) continue
      const x = dx * q
      const y = dy * (s + q * 0.5)
      positions.push([x, y])
    }
  }
  return positions
}

// ── Config ───────────────────────────────────────────────────
const HEX_RADIUS = 1.4
const RINGS = 6
const LINE_OPACITY = 0.12
const HEX_OPACITY = 0.06
const NODE_OPACITY = 0.35
const EDGE_PROBABILITY = 0.15
const PULSE_SPEED = 0.4

interface Props {
  className?: string
  dark?: boolean
}

export default function HexNetwork({ className = '', dark = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // ── Renderer ─────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    camera.position.z = 10

    // ── Colors ───────────────────────────────────────────
    const lineColor = dark ? new THREE.Color('#c6a181') : new THREE.Color('#7f5e46')
    const hexColor = dark ? new THREE.Color('#c6a181') : new THREE.Color('#7f5e46')
    const nodeColor = dark ? new THREE.Color('#FFE4CC') : new THREE.Color('#3f2a1c')

    // ── Build hex grid ───────────────────────────────────
    const centers = hexRingPositions(HEX_RADIUS, RINGS)

    // Hex outlines
    const hexLinePositions: number[] = []
    for (const [cx, cy] of centers) {
      const corners = hexCorners(cx, cy, HEX_RADIUS * 0.95)
      for (let i = 0; i < 6; i++) {
        const [x1, y1] = corners[i]
        const [x2, y2] = corners[(i + 1) % 6]
        hexLinePositions.push(x1, y1, 0, x2, y2, 0)
      }
    }
    const hexGeo = new THREE.BufferGeometry()
    hexGeo.setAttribute('position', new THREE.Float32BufferAttribute(hexLinePositions, 3))
    const hexMat = new THREE.LineBasicMaterial({ color: hexColor, transparent: true, opacity: HEX_OPACITY })
    scene.add(new THREE.LineSegments(hexGeo, hexMat))

    // ── Nodes at hex centers ─────────────────────────────
    const nodeGeo = new THREE.BufferGeometry()
    const nodePositions = new Float32Array(centers.length * 3)
    const nodeSizes = new Float32Array(centers.length)
    const nodePhases = new Float32Array(centers.length)
    for (let i = 0; i < centers.length; i++) {
      nodePositions[i * 3] = centers[i][0]
      nodePositions[i * 3 + 1] = centers[i][1]
      nodePositions[i * 3 + 2] = 0
      nodeSizes[i] = 2 + Math.random() * 3
      nodePhases[i] = Math.random() * Math.PI * 2
    }
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
    nodeGeo.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1))

    const nodeMat = new THREE.PointsMaterial({
      color: nodeColor,
      transparent: true,
      opacity: NODE_OPACITY,
      size: 3,
      sizeAttenuation: false,
    })
    const nodePoints = new THREE.Points(nodeGeo, nodeMat)
    scene.add(nodePoints)

    // ── Network edges (random subset) ────────────────────
    const edgePositions: number[] = []
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const dx = centers[i][0] - centers[j][0]
        const dy = centers[i][1] - centers[j][1]
        const dist = Math.sqrt(dx * dx + dy * dy)
        // Connect neighbors (distance ~ HEX_RADIUS * sqrt(3)) with some randomness
        if (dist < HEX_RADIUS * 2.6 && Math.random() < EDGE_PROBABILITY) {
          edgePositions.push(
            centers[i][0], centers[i][1], 0,
            centers[j][0], centers[j][1], 0,
          )
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry()
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3))
    const edgeMat = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: LINE_OPACITY,
    })
    scene.add(new THREE.LineSegments(edgeGeo, edgeMat))

    // ── Pulse rings (a few animated expanding hexes) ─────
    const pulseCount = 4
    const pulseRings: THREE.LineLoop[] = []
    const pulseStates: { cx: number; cy: number; phase: number; speed: number }[] = []
    for (let p = 0; p < pulseCount; p++) {
      const idx = Math.floor(Math.random() * centers.length)
      const [cx, cy] = centers[idx]
      const corners = hexCorners(0, 0, 1)
      const ringGeo = new THREE.BufferGeometry()
      const pts = corners.map(([x, y]) => new THREE.Vector3(x, y, 0))
      pts.push(pts[0].clone())
      ringGeo.setFromPoints(pts)
      const ringMat = new THREE.LineBasicMaterial({
        color: dark ? new THREE.Color('#FFE4CC') : new THREE.Color('#7f5e46'),
        transparent: true,
        opacity: 0,
      })
      const ring = new THREE.LineLoop(ringGeo, ringMat)
      ring.position.set(cx, cy, 0)
      scene.add(ring)
      pulseRings.push(ring)
      pulseStates.push({ cx, cy, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.3 })
    }

    // ── Mouse interaction ────────────────────────────────
    const mouse = new THREE.Vector2(0, 0)
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    el.addEventListener('mousemove', onMouseMove)

    // ── Sizing ───────────────────────────────────────────
    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h)
      const aspect = w / h
      const viewSize = HEX_RADIUS * (RINGS + 2) * 2
      camera.left = (-viewSize * aspect) / 2
      camera.right = (viewSize * aspect) / 2
      camera.top = viewSize / 2
      camera.bottom = -viewSize / 2
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Animate ──────────────────────────────────────────
    let frame = 0
    const clock = new THREE.Clock()
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Gentle rotation
      scene.rotation.z = Math.sin(t * 0.05) * 0.02

      // Subtle camera shift following mouse
      camera.position.x = mouse.x * 0.8
      camera.position.y = mouse.y * 0.8
      camera.updateProjectionMatrix()

      // Pulse node sizes
      const sizes = nodeGeo.attributes.size as THREE.BufferAttribute
      for (let i = 0; i < centers.length; i++) {
        sizes.array[i] = nodeSizes[i] * (1 + 0.3 * Math.sin(t * PULSE_SPEED + nodePhases[i]))
      }
      sizes.needsUpdate = true

      // Pulse rings
      for (let p = 0; p < pulseCount; p++) {
        const state = pulseStates[p]
        const cycle = ((t * state.speed + state.phase) % (Math.PI * 2)) / (Math.PI * 2)
        const scale = 1 + cycle * 2
        pulseRings[p].scale.set(scale, scale, 1)
        const mat = pulseRings[p].material as THREE.LineBasicMaterial
        mat.opacity = (1 - cycle) * 0.15

        // Reset to new center periodically
        if (cycle < 0.01) {
          const idx = Math.floor(Math.random() * centers.length)
          state.cx = centers[idx][0]
          state.cy = centers[idx][1]
          pulseRings[p].position.set(state.cx, state.cy, 0)
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      el.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [dark])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    />
  )
}
