import { useEffect, useRef } from 'react'
import { useScrollVelocity } from '../hooks/anim'

/**
 * Infinite marquee strip whose speed is boosted by scroll velocity.
 * Hover pauses. Content duplicated for a seamless loop.
 */
export function Marquee({
  tag,
  text,
  size = 'clamp(2.2rem, 6vw, 5rem)',
  red = false,
  outline = false,
  baseSpeed = 60, // px per second
  repeat = 6,
}: {
  tag: string
  text: string
  size?: string
  red?: boolean
  outline?: boolean
  baseSpeed?: number
  repeat?: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const vel = useScrollVelocity()
  const hovering = useRef(false)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let x = 0
    let last = performance.now()
    let raf = 0
    const loop = (t: number) => {
      const dt = Math.min(64, t - last) / 1000
      last = t
      const half = el.scrollWidth / 2
      if (half > 0) {
        const boost = Math.min(14, Math.abs(vel.current) * 1.6)
        const speed = hovering.current ? 0 : baseSpeed * (1 + boost)
        x -= speed * dt
        if (x <= -half) x += half
        el.style.transform = `translate3d(${x}px,0,0)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [baseSpeed, vel])

  const chunk = (
    <>
      {Array.from({ length: repeat }).map((_, i) => (
        <span key={i} className="inline-flex items-center">
          <span>{text}</span>
          <span className="sep" />
        </span>
      ))}
    </>
  )

  return (
    <div
      className={`marquee-strip ${red ? 'bg-[#ff0000] text-black' : 'bg-[#0a0a0a] text-[#f4f4f4]'}`}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <div className="marquee-tag">
        <span className={`inline-block h-2 w-2 rotate-45 ${red ? 'bg-black' : 'bg-[#ff0000]'}`} />
        {tag}
      </div>
      <div className="marquee-viewport py-3">
        <div
          ref={trackRef}
          className={`marquee-track ${outline ? 'text-outline' : ''}`}
          style={{ fontSize: size }}
        >
          <span className="inline-flex items-center">{chunk}</span>
          <span className="inline-flex items-center">{chunk}</span>
        </div>
      </div>
    </div>
  )
}
