// 2D SVG — H3-style aperture-7 hex hierarchy
// Each parent is √7 larger and rotated ~19.1° relative to children

const SQRT7 = Math.sqrt(7)
const AP7_ROT = Math.atan2(Math.sqrt(3), 5) // ~19.1° aperture-7 rotation

function hexPoints(cx: number, cy: number, r: number, rot = 0): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
  }
  return pts.join(' ')
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

interface Props {
  className?: string
  visibleLayers?: number // 1, 2, or 3
}

export default function HexResolutions2D({ className = '', visibleLayers = 3 }: Props) {
  const rot3 = 0
  const R3 = 12

  const rot2 = rot3 + AP7_ROT
  const R2 = R3 * SQRT7

  const rot1 = rot2 + AP7_ROT
  const R1 = R2 * SQRT7

  const layer1 = honeycomb(R1, rot1, 0)
  const layer2 = honeycomb(R2, rot2, 1)
  const layer3 = honeycomb(R3, rot3, 4)

  const viewBox = '-180 -180 360 360'

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={viewBox} style={{ width: '80%', height: '80%' }}>
        {/* Layer 3 — finest (data layer) — always visible */}
        {layer3.map(([cx, cy], i) => (
          <polygon
            key={`l3-${i}`}
            points={hexPoints(cx, cy, R3 * 0.97, rot3)}
            fill="none"
            stroke="#7f5e46"
            strokeWidth={0.3}
            opacity={0.5}
            style={{ transition: 'opacity 0.6s ease' }}
          />
        ))}
        {/* Layer 2 — medium (aggregate layer) */}
        {layer2.map(([cx, cy], i) => (
          <polygon
            key={`l2-${i}`}
            points={hexPoints(cx, cy, R2 * 0.98, rot2)}
            fill="none"
            stroke="#c6a181"
            strokeWidth={1}
            opacity={visibleLayers <= 2 ? 0.7 : 0}
            style={{ transition: 'opacity 0.6s ease' }}
          />
        ))}
        {/* Layer 1 — parent (policy layer) */}
        {layer1.map(([cx, cy], i) => (
          <polygon
            key={`l1-${i}`}
            points={hexPoints(cx, cy, R1 * 0.99, rot1)}
            fill="none"
            stroke="#FFE4CC"
            strokeWidth={2}
            opacity={visibleLayers <= 1 ? 0.9 : 0}
            style={{ transition: 'opacity 0.6s ease' }}
          />
        ))}
      </svg>
    </div>
  )
}
