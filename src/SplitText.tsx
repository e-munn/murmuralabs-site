import { useRef, useEffect, useState, type CSSProperties } from 'react'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  splitType?: 'chars' | 'words'
  from?: CSSProperties
  to?: CSSProperties
  threshold?: number
  tag?: keyof HTMLElementTagNameMap
  textAlign?: CSSProperties['textAlign']
}

export default function SplitText({
  text,
  className = '',
  delay = 30,
  duration = 600,
  splitType = 'chars',
  from = { opacity: 0, transform: 'translateY(40px)' },
  to = { opacity: 1, transform: 'translateY(0)' },
  threshold = 0.1,
  tag: Tag = 'p',
  textAlign = 'left',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const units =
    splitType === 'words'
      ? text.split(/(\s+)/)
      : text.split('').map((ch) => (ch === ' ' ? '\u00A0' : ch))

  let tokenIndex = 0

  return (
    // @ts-expect-error dynamic tag
    <Tag
      ref={ref}
      className={`split-parent ${className}`}
      style={{ textAlign, display: 'inline-block', overflow: 'hidden', whiteSpace: 'normal', wordWrap: 'break-word' } as CSSProperties}
    >
      {units.map((unit, i) => {
        // Whitespace between words — render as-is
        if (splitType === 'words' && /^\s+$/.test(unit)) {
          return <span key={i}>{' '}</span>
        }

        const idx = tokenIndex++
        const style: CSSProperties = {
          display: 'inline-block',
          transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * delay}ms`,
          willChange: 'transform, opacity',
          ...(visible ? to : from),
        }

        return (
          <span key={i} style={style}>
            {unit}
          </span>
        )
      })}
    </Tag>
  )
}
