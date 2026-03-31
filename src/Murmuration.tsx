import { useEffect, useRef } from 'react'

interface Boid {
  x: number
  y: number
  vx: number
  vy: number
}

const COUNT = 350
const MAX_SPEED = 2.5
const VISUAL_RANGE = 60
const SEPARATION_DIST = 28
const COHESION = 0.002
const ALIGNMENT = 0.05
const SEPARATION = 0.05
const EDGE_MARGIN = 10
const EDGE_TURN = 0.2

export default function Murmuration({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boidsRef = useRef<Boid[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0
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
      // Clamp existing boids into new bounds
      for (const b of boidsRef.current) {
        b.x = Math.min(b.x, W - 10)
        b.y = Math.min(b.y, H - 10)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    // Init boids spread across full area
    if (boidsRef.current.length === 0) {
      const boids: Boid[] = []
      for (let i = 0; i < COUNT; i++) {
        boids.push({
          x: W * 0.5 + Math.random() * W * 0.4,
          y: H * 0.1 + Math.random() * H * 0.8,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        })
      }
      boidsRef.current = boids
    }

    const loop = () => {
      const boids = boidsRef.current

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i]
        let cx = 0, cy = 0, cCount = 0
        let ax = 0, ay = 0, aCount = 0
        let sx = 0, sy = 0

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue
          const o = boids[j]
          const dx = o.x - b.x
          const dy = o.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < VISUAL_RANGE) {
            // Cohesion
            cx += o.x
            cy += o.y
            cCount++

            // Alignment
            ax += o.vx
            ay += o.vy
            aCount++

            // Separation
            if (dist < SEPARATION_DIST) {
              sx -= dx / dist
              sy -= dy / dist
            }
          }
        }

        if (cCount > 0) {
          b.vx += (cx / cCount - b.x) * COHESION
          b.vy += (cy / cCount - b.y) * COHESION
        }
        if (aCount > 0) {
          b.vx += (ax / aCount - b.vx) * ALIGNMENT
          b.vy += (ay / aCount - b.vy) * ALIGNMENT
        }
        b.vx += sx * SEPARATION
        b.vy += sy * SEPARATION

        // Edge avoidance
        if (b.x < EDGE_MARGIN) b.vx += EDGE_TURN
        if (b.x > W - EDGE_MARGIN) b.vx -= EDGE_TURN
        if (b.y < EDGE_MARGIN) b.vy += EDGE_TURN
        if (b.y > H - EDGE_MARGIN) b.vy -= EDGE_TURN

        // Speed limit
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
        if (speed > MAX_SPEED) {
          b.vx = (b.vx / speed) * MAX_SPEED
          b.vy = (b.vy / speed) * MAX_SPEED
        }

        b.x += b.vx
        b.y += b.vy
      }

      // Draw
      ctx.clearRect(0, 0, W, H)
      for (const b of boids) {
        const angle = Math.atan2(b.vy, b.vx)
        const len = 6
        ctx.beginPath()
        ctx.moveTo(
          b.x + Math.cos(angle) * len,
          b.y + Math.sin(angle) * len,
        )
        ctx.lineTo(
          b.x + Math.cos(angle + 2.5) * len * 0.5,
          b.y + Math.sin(angle + 2.5) * len * 0.5,
        )
        ctx.lineTo(
          b.x + Math.cos(angle - 2.5) * len * 0.5,
          b.y + Math.sin(angle - 2.5) * len * 0.5,
        )
        ctx.closePath()
        ctx.fillStyle = 'rgba(127, 94, 70, 0.5)'
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
