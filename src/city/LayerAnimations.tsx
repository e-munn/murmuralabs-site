import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FadeInLayerProps {
  children: ReactNode
  revealed: boolean
  duration?: number // seconds
  delay?: number // seconds
}

// Wrapper that fades in children smoothly when revealed
export function FadeInLayer({ children, revealed, duration = 0.8, delay = 0 }: FadeInLayerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progress = useRef(0)
  const delayTimer = useRef(0)
  const wasRevealed = useRef(false)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (revealed && !wasRevealed.current) {
      // Just became revealed - reset animation
      progress.current = 0
      delayTimer.current = 0
      wasRevealed.current = true
    } else if (!revealed && wasRevealed.current) {
      // Just became hidden
      wasRevealed.current = false
      progress.current = 0
    }

    if (revealed) {
      // Handle delay
      if (delayTimer.current < delay) {
        delayTimer.current += delta
        groupRef.current.visible = false
        return
      }

      groupRef.current.visible = true

      // Animate progress
      if (progress.current < 1) {
        progress.current = Math.min(1, progress.current + delta / duration)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress.current, 3)

        // Apply opacity to all materials in children
        groupRef.current.traverse((child) => {
          if ('material' in child && child.material) {
            const mat = child.material as THREE.Material & { opacity?: number }
            if (mat.opacity !== undefined) {
              // Store original opacity on first run
              if (!('_originalOpacity' in mat)) {
                (mat as unknown as Record<string, number>)._originalOpacity = mat.opacity
              }
              mat.opacity = (mat as unknown as Record<string, number>)._originalOpacity * eased
            }
          }
        })
      }
    } else {
      groupRef.current.visible = false
    }
  })

  return <group ref={groupRef}>{children}</group>
}

interface DropInLayerProps {
  children: ReactNode
  revealed: boolean
  duration?: number // seconds
  delay?: number // seconds
  dropHeight?: number // units to drop from
}

// Wrapper that drops in children from above with fade when revealed
export function DropInLayer({
  children,
  revealed,
  duration = 1.0,
  delay = 0,
  dropHeight = 100
}: DropInLayerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progress = useRef(0)
  const delayTimer = useRef(0)
  const wasRevealed = useRef(false)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (revealed && !wasRevealed.current) {
      // Just became revealed - reset animation
      progress.current = 0
      delayTimer.current = 0
      wasRevealed.current = true
    } else if (!revealed && wasRevealed.current) {
      // Just became hidden
      wasRevealed.current = false
      progress.current = 0
    }

    if (revealed) {
      // Handle delay
      if (delayTimer.current < delay) {
        delayTimer.current += delta
        groupRef.current.visible = false
        return
      }

      groupRef.current.visible = true

      // Animate progress
      if (progress.current < 1) {
        progress.current = Math.min(1, progress.current + delta / duration)
        // Ease out back (slight overshoot for bounce feel)
        const c1 = 1.70158
        const c3 = c1 + 1
        const eased = 1 + c3 * Math.pow(progress.current - 1, 3) + c1 * Math.pow(progress.current - 1, 2)

        // Apply Z position (drop from above)
        groupRef.current.position.z = dropHeight * (1 - eased)

        // Apply opacity to all materials
        groupRef.current.traverse((child) => {
          if ('material' in child && child.material) {
            const mat = child.material as THREE.Material & { opacity?: number }
            if (mat.opacity !== undefined) {
              if (!('_originalOpacity' in mat)) {
                (mat as unknown as Record<string, number>)._originalOpacity = mat.opacity
              }
              mat.opacity = (mat as unknown as Record<string, number>)._originalOpacity * Math.min(1, progress.current * 1.5)
            }
          }
        })
      } else {
        // Ensure final position
        groupRef.current.position.z = 0
      }
    } else {
      groupRef.current.visible = false
      groupRef.current.position.z = dropHeight
    }
  })

  return <group ref={groupRef}>{children}</group>
}
