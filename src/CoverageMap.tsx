'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import streets from './ground-data/mission.json'
import rail from './ground-data/captureRail.json'

type Point = number[]
const W = 1200, H = 800

export default function CoverageMap() {
  const ref = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const elapsed = useRef(0)
  const near = useInView(ref, { amount: 0.15 })
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [replay, setReplay] = useState(0)
  const [complete, setComplete] = useState(false)
  const geometry = useMemo(() => {
    const points = [...rail.points_geo, ...streets.streets.flatMap(s => s.paths.flat())]
    const lon0 = rail.origin_latlon[1], lat0 = rail.origin_latlon[0]
    const meters = ([lon, lat]: Point) => [(lon - lon0) * Math.cos(lat0 * Math.PI / 180), lat - lat0]
    const xy = points.map(meters)
    const xs = xy.map(p => p[0]), ys = xy.map(p => p[1])
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys)
    const scale = Math.min((W - 140) / (maxX - minX), (H - 120) / (maxY - minY))
    const project = (point: Point) => { const [x, y] = meters(point); return [W / 2 + (x - (minX + maxX) / 2) * scale, H / 2 - (y - (minY + maxY) / 2) * scale] }
    const path = (pts: Point[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${project(p).map(n => n.toFixed(2)).join(',')}`).join(' ')
    return { route: path(rail.points_geo), streets: streets.streets.map(s => ({ name: s.name, paths: s.paths.map(path) })), start: project(rail.points_geo[0]), labels: streets.streets.filter(s => ['16th Street', '18th Street', '20th Street', '22nd Street', 'Mission Street', 'Valencia Street'].includes(s.name)).map(s => ({ name: s.name.replace(' Street', ''), at: project(s.paths[0][0]) })) }
  }, [])

  useEffect(() => {
    const path = pathRef.current, dot = dotRef.current
    if (!path || !dot) return
    const length = path.getTotalLength()
    const draw = (fraction: number) => {
      path.style.strokeDashoffset = String(1 - fraction)
      const p = path.getPointAtLength(fraction * length)
      dot.setAttribute('cx', String(p.x)); dot.setAttribute('cy', String(p.y))
    }
    if (reduced) { draw(1); return }
    draw(Math.min(elapsed.current / 26000, 1))
    if (!near || paused || complete) return
    let frame = 0, last = 0
    const tick = (now: number) => {
      if (last && !document.hidden) elapsed.current += Math.min(now - last, 80)
      last = now
      const progress = Math.min(elapsed.current / 26000, 1)
      draw(progress)
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setComplete(true)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [near, paused, reduced, replay, complete])

  return <div ref={ref}>
    <div className="relative rounded-2xl border border-sand/25 overflow-hidden bg-[#21160f]">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Animated recorded Mission District capture route over OpenStreetMap street geometry" className="block w-full h-auto min-h-[330px]">
        <g fill="none" stroke="#c6a181" strokeWidth="1.2" opacity="0.25">{geometry.streets.map(street => <g key={street.name}>{street.paths.map((path, i) => <path key={i} d={path} />)}</g>)}</g>
        <path d={geometry.route} fill="none" stroke="#efaa64" strokeWidth="2" opacity="0.12" />
        <path ref={pathRef} d={geometry.route} fill="none" stroke="#efaa64" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
        <circle ref={dotRef} cx={geometry.start[0]} cy={geometry.start[1]} r="6" fill="#ffe4cc" stroke="#efaa64" strokeWidth="3" />
        <g fill="#c6a181" fontSize="16" fontFamily="monospace">{geometry.labels.map(label => <text key={label.name} x={label.at[0] + 8} y={label.at[1] - 10}>{label.name}</text>)}</g>
        <text x="40" y="48" fill="#c6a181" fontSize="16" fontFamily="monospace">MISSION DISTRICT / SAN FRANCISCO</text>
        <text x={W - 40} y="48" textAnchor="end" fill="#c6a181" fontSize="16" fontFamily="monospace">N ↑</text>
      </svg>
      <div className="flex flex-wrap justify-between gap-4 px-5 sm:px-8 pb-6 items-center text-sm">
        <span className="flex items-center gap-3 text-sand"><span className="w-6 h-0.5 bg-[#efaa64]" />Recorded capture route · July 16, 2026</span>
        <div className="flex gap-3">
          {!reduced && !complete && <button className="border border-sand/50 rounded-full px-4 py-2 hover:bg-linen/10" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Play route' : 'Pause route'}</button>}
          <button className="border border-sand/50 rounded-full px-4 py-2 hover:bg-linen/10" onClick={() => { elapsed.current = 0; setComplete(false); setPaused(false); setReplay(replay + 1) }}>Replay</button>
        </div>
      </div>
    </div>
    <p className="flex flex-wrap justify-between gap-3 mt-4 text-sm text-sand"><span>Capture route, not completed reconstruction coverage.</span><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Street geometry © OpenStreetMap contributors</a></p>
  </div>
}
