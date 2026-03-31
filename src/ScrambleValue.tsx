import { useState, useEffect, useRef } from 'react'

const CHARS = '0123456789.'

interface Props {
  value: string
  active: boolean
  speed?: number
  settleDelay?: number
}

export default function ScrambleValue({ value, active, speed = 40, settleDelay = 1500 }: Props) {
  const [display, setDisplay] = useState(value)
  const [settled, setSettled] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (!active) {
      setSettled(false)
      setDisplay(value)
      return
    }

    // Scramble continuously
    intervalRef.current = setInterval(() => {
      setDisplay(
        value
          .split('')
          .map((ch) => {
            if (ch === '.' || ch === ' ') return ch
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
    }, speed)

    // Settle after delay
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplay(value)
      setSettled(true)
    }, settleDelay)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [active, value, speed, settleDelay])

  return <span className={settled ? 'text-sand' : 'text-sand/40'}>{display}</span>
}
