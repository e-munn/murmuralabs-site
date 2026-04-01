// 2D SVG — H3-style aperture-7 hex hierarchy
// Each parent is √7 larger and rotated ~19.1° relative to children

const SQRT7 = Math.sqrt(7)
const AP7_ROT = Math.atan2(Math.sqrt(3), 5) // ~19.1° aperture-7 rotation

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000
}

function hexPoints(cx: number, cy: number, r: number, rot = 0): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot
    pts.push(`${round4(cx + r * Math.cos(a))},${round4(cy + r * Math.sin(a))}`)
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

// Check if point is inside a flat-top hex with given center, radius, and rotation
function insideHex(px: number, py: number, cx: number, cy: number, r: number, rot: number): boolean {
  // Transform point into hex-local coordinates
  const dx = px - cx
  const dy = py - cy
  const cos = Math.cos(-rot)
  const sin = Math.sin(-rot)
  const lx = dx * cos - dy * sin
  const ly = dx * sin + dy * cos
  // Hex containment check (pointy-top after rotation removal)
  const ax = Math.abs(lx)
  const ay = Math.abs(ly)
  return ay <= r * Math.sqrt(3) / 2 && ax <= r && ax + ay / Math.sqrt(3) <= r
}

interface Props {
  className?: string
  visibleLayers?: number // 1, 2, or 3
  showAll?: boolean // force all layers visible at once
  colors?: { parcel?: string; block?: string; neighborhood?: string } // override layer colors
  svgScale?: number // multiplier for SVG size (default 0.8 = 80%)
}

export default function HexResolutions2D({ className = '', visibleLayers = 3, showAll = false, colors, svgScale }: Props) {
  const rot3 = 0
  const R3 = 12

  const rot2 = rot3 + AP7_ROT
  const R2 = R3 * SQRT7

  const rot1 = rot2 + AP7_ROT
  const R1 = R2 * SQRT7

  const layer1 = honeycomb(R1, rot1, 0)
  const layer2 = honeycomb(R2, rot2, 1)
  const layer3 = honeycomb(R3, rot3, 4)

  // Determine which layer3 hexes are covered by any layer2 hex
  const layer3Covered = layer3.map(([cx, cy]) => {
    return layer2.some(([l2x, l2y]) => insideHex(cx, cy, l2x, l2y, R2 * 0.98, rot2))
  })

  const viewBox = '-180 -180 360 360'

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={viewBox} style={{ width: `${(svgScale ?? 0.8) * 100}%`, height: `${(svgScale ?? 0.8) * 100}%` }}>
        {/* Layer 3 — finest (data layer) — always visible */}
        {layer3.map(([cx, cy], i) => {
          const maxDist = R3 * Math.sqrt(3) * 4
          const dist = Math.sqrt(cx * cx + cy * cy)
          const t = dist / maxDist
          const parcelColor = colors?.parcel ?? '#7f5e46'
          const fillAlpha = 0.3 * Math.exp(-3 * t * t)
          const isOverhang = !layer3Covered[i]
          // Fade out overhanging hexes when aggregate layer is visible
          const hexOpacity = !showAll && isOverhang && visibleLayers <= 2 ? 0 : 0.5
          return (
            <polygon
              key={`l3-${i}`}
              points={hexPoints(cx, cy, R3 * 0.97, rot3)}
              fill={`rgba(${hexToRgb(parcelColor)}, ${fillAlpha})`}
              stroke={parcelColor}
              strokeWidth={0.3}
              opacity={hexOpacity}
              style={{ transition: 'opacity 0.6s ease' }}
            />
          )
        })}
        {/* Layer 2 — medium (aggregate layer) */}
        {layer2.map(([cx, cy], i) => {
          const maxDist = R2 * Math.sqrt(3) * 1 // outermost ring distance (1 ring)
          const dist = Math.sqrt(cx * cx + cy * cy)
          const t = dist / maxDist
          const blockColor = colors?.block ?? '#c6a181'
          const fillAlpha = 0.05 + 0.15 * Math.exp(-3 * t * t)
          return (
            <polygon
              key={`l2-${i}`}
              points={hexPoints(cx, cy, R2 * 0.98, rot2)}
              fill={`rgba(${hexToRgb(blockColor)}, ${fillAlpha})`}
              stroke={blockColor}
              strokeWidth={1}
              opacity={showAll || visibleLayers <= 2 ? 0.7 : 0}
              style={{ transition: 'opacity 0.6s ease' }}
            />
          )
        })}
        {/* Layer 1 — parent (policy layer) */}
        {layer1.map(([cx, cy], i) => {
          const neighborhoodColor = colors?.neighborhood ?? '#FFE4CC'
          return (
          <polygon
            key={`l1-${i}`}
            points={hexPoints(cx, cy, R1 * 0.99, rot1)}
            fill="none"
            stroke={neighborhoodColor}
            strokeWidth={2}
            opacity={showAll || visibleLayers <= 1 ? 0.9 : 0}
            style={{ transition: 'opacity 0.6s ease' }}
          />
          )
        })}
      </svg>
    </div>
  )
}
