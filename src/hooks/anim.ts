import { useEffect, useRef, useState } from 'react'

/** IntersectionObserver-based reveal. Attach ref, get `in` flag once visible. */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

/** Smoothed scroll velocity (px/frame-ish), decays to 0. */
export function useScrollVelocity() {
  const vel = useRef(0)
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const loop = () => {
      const y = window.scrollY
      const dy = y - last
      last = y
      vel.current = vel.current * 0.88 + dy * 0.12
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return vel
}

/** Animated counter that runs when visible. */
export function useCounter(target: number, start: boolean, duration = 1600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])
  return val
}
