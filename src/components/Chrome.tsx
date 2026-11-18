import { useEffect, useState } from 'react'

/** Boot preloader: logo clip reveal + progress bar, then wipes upward. */
export function Preloader() {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 2800)
    document.body.style.overflow = 'hidden'
    const t2 = setTimeout(() => (document.body.style.overflow = ''), 2200)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [])
  if (gone) return null
  return (
    <div className="preloader">
      <div className="preloader-logo">
        KART<em>RUSH</em>
      </div>
      <div className="preloader-bar" />
    </div>
  )
}

/** Custom blend-mode cursor that follows the pointer (desktop only). */
export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.body.classList.add('custom-cursor')
    const el = document.createElement('div')
    el.className = 'kursor small'
    el.innerHTML = '<div class="kursor-dot"></div>'
    document.body.appendChild(el)
    let x = -100, y = -100, cx = -100, cy = -100
    let raf = 0
    const move = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      const target = e.target as HTMLElement
      const interactive = target.closest('a,button,input,select,textarea,label,.flip,[data-cursor]')
      el.classList.toggle('small', !interactive)
    }
    const loop = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      el.style.transform = `translate(${cx}px, ${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
      el.remove()
      document.body.classList.remove('custom-cursor')
    }
  }, [])
  return null
}
