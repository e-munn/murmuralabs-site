const SQRT7 = Math.sqrt(7)
const AP7_ROT = Math.atan2(Math.sqrt(3), 5)

function hexPoints(cx: number, cy: number, r: number, rot = 0): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
  }
  return pts.join(' ')
}

function hexVertices(cx: number, cy: number, r: number, rot = 0): [number, number][] {
  const verts: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot
    verts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return verts
}

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-40 h-40 flex items-center justify-center text-espresso">
        <svg viewBox="-60 -60 120 120" className="w-full h-full">{children}</svg>
      </div>
      <div className="w-40 h-40 bg-espresso rounded-xl flex items-center justify-center text-[#c6a181]">
        <svg viewBox="-60 -60 120 120" className="w-full h-full">{children}</svg>
      </div>
      <p className="font-mono text-xs text-driftwood/60 text-center">{label}</p>
    </div>
  )
}

export default function Logos() {
  const R = 48
  return (
    <div className="min-h-screen bg-linen p-16">
      <h1 className="font-mono text-xs text-driftwood tracking-[0.3em] uppercase mb-16">Aperture-7 Rotation Variants</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">

        {/* 1. Two layers — original */}
        <Tile label="2 layers">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <polygon points={hexPoints(0, 0, R, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 2. Three layers cascading — original sqrt7 */}
        <Tile label="3 layers (÷√7)">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 0, R / SQRT7 / SQRT7, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 2b. Three layers — ×0.75 scale */}
        <Tile label="3 layers (×0.75)">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R * 0.75, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 0, R * 0.75 * 0.75, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 2c. Three layers — ×0.8 scale */}
        <Tile label="3 layers (×0.8)">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R * 0.8, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 0, R * 0.8 * 0.8, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 2d. Three layers — ×0.85 scale */}
        <Tile label="3 layers (×0.85)">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R * 0.85, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 0, R * 0.85 * 0.85, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 2e. Three layers — ×0.7 scale */}
        <Tile label="3 layers (×0.7)">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R * 0.7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 0, R * 0.7 * 0.7, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 2f. Three layers — ×0.8 scale, filled core */}
        <Tile label="×0.8 filled core">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R * 0.8, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 0, R * 0.8 * 0.8, AP7_ROT * 2)} fill="currentColor" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
        </Tile>

        {/* 2g. Three layers — ×0.85 scale, filled gradient */}
        <Tile label="×0.85 filled gradient">
          <polygon points={hexPoints(0, 0, R, 0)} fill="currentColor" stroke="none" opacity="0.08" />
          <polygon points={hexPoints(0, 0, R * 0.85, AP7_ROT)} fill="currentColor" stroke="none" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R * 0.85 * 0.85, AP7_ROT * 2)} fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </Tile>

        {/* 3. Four layers cascading */}
        <Tile label="4 layers cascade">
          {[0, 1, 2, 3].map(i => {
            const r = R / Math.pow(SQRT7, i)
            const rot = AP7_ROT * i
            const o = 0.15 + (i / 3) * 0.85
            const sw = 0.8 + (i / 3) * 1.5
            return <polygon key={i} points={hexPoints(0, 0, r, rot)} fill="none" stroke="currentColor" strokeWidth={sw} opacity={o} />
          })}
        </Tile>

        {/* 4. Five layers deep */}
        <Tile label="5 layers deep">
          {[0, 1, 2, 3, 4].map(i => {
            const r = R / Math.pow(SQRT7, i)
            const rot = AP7_ROT * i
            const o = 0.1 + (i / 4) * 0.9
            const sw = 0.5 + (i / 4) * 2
            return <polygon key={i} points={hexPoints(0, 0, r, rot)} fill="none" stroke="currentColor" strokeWidth={sw} opacity={o} />
          })}
        </Tile>

        {/* 5. Three layers — filled smallest */}
        <Tile label="Filled core">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 0, R / SQRT7 / SQRT7, AP7_ROT * 2)} fill="currentColor" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
        </Tile>

        {/* 6. All filled gradient */}
        <Tile label="Filled gradient">
          <polygon points={hexPoints(0, 0, R, 0)} fill="currentColor" stroke="none" opacity="0.08" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="currentColor" stroke="none" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R / SQRT7 / SQRT7, AP7_ROT * 2)} fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </Tile>

        {/* 7. Two layers heavy */}
        <Tile label="2 layers heavy">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <polygon points={hexPoints(0, 0, R, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="3.5" />
        </Tile>

        {/* 8. Two layers — inner filled */}
        <Tile label="Inner filled">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="currentColor" stroke="none" opacity="0.7" />
        </Tile>

        {/* 9. Dashed outer */}
        <Tile label="Dashed outer">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="4 3" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <polygon points={hexPoints(0, 0, R / SQRT7 / SQRT7, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 10. Center dot */}
        <Tile label="Center dot">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 0, R / SQRT7 / SQRT7, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="0" cy="0" r="3.5" fill="currentColor" />
        </Tile>

        {/* 11. Vertex dots */}
        <Tile label="With vertices">
          {[0, 1, 2].map(i => {
            const r = R / Math.pow(SQRT7, i)
            const rot = AP7_ROT * i
            const o = 0.2 + (i / 2) * 0.8
            return (
              <g key={i}>
                <polygon points={hexPoints(0, 0, r, rot)} fill="none" stroke="currentColor" strokeWidth={1 + i * 0.5} opacity={o} />
                {hexVertices(0, 0, r, rot).map(([x, y], j) => (
                  <circle key={j} cx={x} cy={y} r={1.5 + i * 0.5} fill="currentColor" opacity={o} />
                ))}
              </g>
            )
          })}
        </Tile>

        {/* 12. Offset cascade — stacked downward */}
        <Tile label="Offset cascade">
          <polygon points={hexPoints(0, -18, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <polygon points={hexPoints(0, 18, R / SQRT7 / SQRT7, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 13. Three layers — thin uniform stroke */}
        <Tile label="Uniform thin">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
          <polygon points={hexPoints(0, 0, R / SQRT7 / SQRT7, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="1" />
        </Tile>

        {/* 14. Outer only — two rotated same size */}
        <Tile label="Same size rotated">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <polygon points={hexPoints(0, 0, R, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
          <polygon points={hexPoints(0, 0, R, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="1.5" />
        </Tile>

        {/* 15. Filled outer, stroke inner */}
        <Tile label="Filled outer">
          <polygon points={hexPoints(0, 0, R, 0)} fill="currentColor" stroke="none" opacity="0.1" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="2" />
        </Tile>

        {/* 16. Three layers — only strokes, equal weight, decreasing opacity */}
        <Tile label="Equal weight fade">
          <polygon points={hexPoints(0, 0, R, 0)} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.15" />
          <polygon points={hexPoints(0, 0, R / SQRT7, AP7_ROT)} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.45" />
          <polygon points={hexPoints(0, 0, R / SQRT7 / SQRT7, AP7_ROT * 2)} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.9" />
        </Tile>

      </div>
    </div>
  )
}
