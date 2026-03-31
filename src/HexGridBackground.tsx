import { useEffect, useRef } from 'react'

// Presets: [shade label, orange RGB, red RGB, layer1 max alpha, layer2 max alpha]
const PRESETS: { label: string; orange: [number, number, number]; red: [number, number, number]; a1: number; a2: number }[] = [
  { label: '1: 300 light, low alpha',    orange: [253, 186, 116], red: [252, 165, 165], a1: 0.08, a2: 0.03 },
  { label: '2: 300 light, med alpha',    orange: [253, 186, 116], red: [252, 165, 165], a1: 0.15, a2: 0.06 },
  { label: '3: 300 light, high alpha',   orange: [253, 186, 116], red: [252, 165, 165], a1: 0.25, a2: 0.10 },
  { label: '4: 400 mid, low alpha',      orange: [251, 146, 60],  red: [248, 113, 113], a1: 0.06, a2: 0.025 },
  { label: '5: 400 mid, med alpha',      orange: [251, 146, 60],  red: [248, 113, 113], a1: 0.12, a2: 0.04 },
  { label: '6: 400 mid, high alpha',     orange: [251, 146, 60],  red: [248, 113, 113], a1: 0.20, a2: 0.07 },
  { label: '7: 600 dark, low alpha',     orange: [234, 88, 12],   red: [220, 38, 38],   a1: 0.04, a2: 0.015 },
  { label: '8: 600 dark, med alpha',     orange: [234, 88, 12],   red: [220, 38, 38],   a1: 0.08, a2: 0.03 },
  { label: '9: 600 dark, high alpha',    orange: [234, 88, 12],   red: [220, 38, 38],   a1: 0.14, a2: 0.05 },
]

const SQRT7 = Math.sqrt(7)
const AP7_ROT = Math.atan2(Math.sqrt(3), 5) // ~19.1° aperture-7 rotation

// Hex centers in a honeycomb pattern
function honeycombCenters(
  r: number,
  rot: number,
  rings: number,
): { x: number; y: number }[] {
  const dist = r * Math.sqrt(3)
  const dirs: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + rot
    dirs.push([dist * Math.cos(a), dist * Math.sin(a)])
  }

  const centers: { x: number; y: number }[] = [{ x: 0, y: 0 }]
  const seen = new Set<string>()
  seen.add('0,0')

  for (let ring = 1; ring <= rings; ring++) {
    let x = dirs[4][0] * ring
    let y = dirs[4][1] * ring
    for (let side = 0; side < 6; side++) {
      for (let step = 0; step < ring; step++) {
        const key = `${Math.round(x * 10)},${Math.round(y * 10)}`
        if (!seen.has(key)) {
          seen.add(key)
          centers.push({ x, y })
        }
        x += dirs[side][0]
        y += dirs[side][1]
      }
    }
  }
  return centers
}

// Hex polygon path
function hexPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  rot: number,
) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot
    const px = cx + r * Math.cos(a)
    const py = cy + r * Math.sin(a)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

// Point-in-hex test (for mapping children to parents)
function insideHex(px: number, py: number, cx: number, cy: number, r: number, rot: number): boolean {
  const dx = px - cx
  const dy = py - cy
  const cos = Math.cos(-rot)
  const sin = Math.sin(-rot)
  const lx = dx * cos - dy * sin
  const ly = dx * sin + dy * cos
  const ax = Math.abs(lx)
  const ay = Math.abs(ly)
  return ay <= r * Math.sqrt(3) / 2 && ax <= r && ax + ay / Math.sqrt(3) <= r
}

// Wandering flock attractors — each traces a Lissajous-like path
const FLOCK_COUNT = 5
const FLOCK_RADIUS = 180

function flockCenter(i: number, t: number, W: number, H: number): [number, number] {
  const fx = 0.13 + i * 0.07
  const fy = 0.11 + i * 0.05
  const px = i * 1.7 + 0.3
  const py = i * 2.3 + 1.1
  const x = Math.sin(t * fx + px) * W * 0.4
  const y = Math.sin(t * fy + py) * H * 0.35
  return [x, y]
}

// Flock colors are set per-frame from active preset (80% orange, 20% red)
const FLOCK_COLORS: [number, number, number][] = [
  [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
]

interface CellResult {
  alpha: number
  r: number
  g: number
  b: number
}

function undulate(x: number, y: number, t: number, W: number, H: number): CellResult {
  let acc = 0
  let rr = 0, gg = 0, bb = 0
  for (let i = 0; i < FLOCK_COUNT; i++) {
    const [fx, fy] = flockCenter(i, t, W, H)
    const dx = x - fx
    const dy = y - fy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const influence = Math.exp(-(dist * dist) / (FLOCK_RADIUS * FLOCK_RADIUS * 2))
    const [cr, cg, cb] = FLOCK_COLORS[i]
    rr += cr * influence
    gg += cg * influence
    bb += cb * influence
    acc += influence
  }
  const v = Math.min(acc, 1.0)
  const alpha = v * v * v
  // Normalize color by total influence (weighted blend)
  if (acc > 0.001) {
    rr /= acc
    gg /= acc
    bb /= acc
  } else {
    rr = 127; gg = 94; bb = 70
  }
  return { alpha, r: rr, g: gg, b: bb }
}

// Build parent→child index: for each layer2 hex, which layer1 indices fall inside it
function buildChildMap(
  layer1: { x: number; y: number }[],
  layer2: { x: number; y: number }[],
  R2: number,
  rot2: number,
): number[][] {
  return layer2.map(({ x: px, y: py }) => {
    const children: number[] = []
    for (let i = 0; i < layer1.length; i++) {
      if (insideHex(layer1[i].x, layer1[i].y, px, py, R2, rot2)) {
        children.push(i)
      }
    }
    return children
  })
}

// Tailwind 400 palette for layer 2 quantized fill
const TW_COLORS: { name: string; rgb: [number, number, number] }[] = [
  { name: 'orange-600',  rgb: [234, 88, 12] },
  { name: 'red-600',     rgb: [220, 38, 38] },
]


function nearestTailwind(r: number, g: number, b: number): [number, number, number] {
  let best = TW_COLORS[0].rgb
  let bestDist = Infinity
  for (const tw of TW_COLORS) {
    const dr = r - tw.rgb[0]
    const dg = g - tw.rgb[1]
    const db = b - tw.rgb[2]
    const d = dr * dr + dg * dg + db * db
    if (d < bestDist) {
      bestDist = d
      best = tw.rgb
    }
  }
  return best
}

interface Props {
  className?: string
  dark?: boolean
  delay?: number // ms before animation starts + fades in
}

export default function HexGridBackground({ className = '', dark = false, delay = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const presetRef = useRef(2) // preset 3: 300 light, high alpha


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Layer config: aperture-7 relationship
    const R1 = 18
    const rot1 = 0
    const R2 = R1 * SQRT7
    const rot2 = AP7_ROT

    let W = 0
    let H = 0
    let layer1: { x: number; y: number }[] = []
    let layer2: { x: number; y: number }[] = []
    let childMap: number[][] = []
    // Per-cell results for layer1 (reused each frame)
    let cellResults: CellResult[] = []

    const buildGrid = () => {
      const maxDim = Math.max(W, H)
      const rings1 = Math.ceil(maxDim / (R1 * Math.sqrt(3))) + 2
      const rings2 = Math.ceil(maxDim / (R2 * Math.sqrt(3))) + 2
      layer1 = honeycombCenters(R1, rot1, rings1)
      layer2 = honeycombCenters(R2, rot2, rings2)
      childMap = buildChildMap(layer1, layer2, R2, rot2)
      cellResults = layer1.map(() => ({ alpha: 0, r: 127, g: 94, b: 70 }))
    }

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      W = rect.width
      H = rect.height
      canvas.width = W * devicePixelRatio
      canvas.height = H * devicePixelRatio
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      buildGrid()
    }
    resize()
    window.addEventListener('resize', resize)

    let t0: number | null = null
    const loop = (ts: number) => {
      if (t0 === null) t0 = ts
      const t = (ts - t0) / 1000
      const ox = W / 2
      const oy = H / 2

      ctx.clearRect(0, 0, W, H)

      // Apply active preset colors
      const p = PRESETS[presetRef.current]
      FLOCK_COLORS[0] = p.orange
      FLOCK_COLORS[1] = p.orange
      FLOCK_COLORS[2] = p.orange
      FLOCK_COLORS[3] = p.orange
      FLOCK_COLORS[4] = p.red

      // ── Layer 1: fine grid ──
      for (let i = 0; i < layer1.length; i++) {
        cellResults[i] = undulate(layer1[i].x, layer1[i].y, t, W, H)
      }

      for (let i = 0; i < layer1.length; i++) {
        const c = layer1[i]
        const sx = ox + c.x
        const sy = oy + c.y
        if (sx < -R1 || sx > W + R1 || sy < -R1 || sy > H + R1) continue

        const { alpha, r, g, b } = cellResults[i]
        const fa = alpha * p.a1

        if (fa > 0.005) {
          hexPath(ctx, sx, sy, R1, rot1)
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${fa.toFixed(3)})`
          ctx.fill()
        }
      }

      // ── Layer 2: coarse grid, fill = nearest tailwind of darkest child ──
      for (let j = 0; j < layer2.length; j++) {
        const c = layer2[j]
        const sx = ox + c.x
        const sy = oy + c.y
        if (sx < -R2 || sx > W + R2 || sy < -R2 || sy > H + R2) continue

        const children = childMap[j]
        let sumAlpha = 0
        let lightestIdx = -1
        let lightestAlpha = Infinity
        if (children.length > 0) {
          for (const ci of children) {
            sumAlpha += cellResults[ci].alpha
            if (cellResults[ci].alpha < lightestAlpha) {
              lightestAlpha = cellResults[ci].alpha
              lightestIdx = ci
            }
          }
          sumAlpha /= children.length
        }

        // Fill: nearest tailwind color from lightest child
        let fr = 127, fg = 94, fb = 70
        if (lightestIdx >= 0) {
          const d = cellResults[lightestIdx]
          ;[fr, fg, fb] = nearestTailwind(d.r, d.g, d.b)
        }
        const fa = sumAlpha * p.a2

        if (fa > 0.003) {
          hexPath(ctx, sx, sy, R2, rot2)
          ctx.fillStyle = `rgba(${fr},${fg},${fb},${fa.toFixed(3)})`
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [dark])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0,
        animation: `fade-in 1s ease-out ${delay}ms both`,
        pointerEvents: 'none',
      }}
    >
      {/* SVG grain filter definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </svg>
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
      {/* Grain overlay covering entire section */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'url(#grain)',
          opacity: 0.08,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
