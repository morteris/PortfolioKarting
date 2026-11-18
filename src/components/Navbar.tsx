import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useLang } from '../i18n'

export function Navbar() {
  const { t, toggle, lang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [loc.pathname])

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/tracks', label: t('nav.tracks') },
    { to: '/prices', label: t('nav.prices') },
    { to: '/about', label: t('nav.about') },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#050505]/90 backdrop-blur-md border-b border-[#1f1f1f]' : ''
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10">
        <Link to="/" className="font-display text-xl tracking-wide md:text-2xl">
          KART<span className="text-[#ff0000]">RUSH</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `nav-link font-mono text-[11px] uppercase tracking-[0.22em] ${
                  isActive ? 'active text-white' : 'text-[#9a9a9a] hover:text-white'
                } transition-colors`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="border border-[#1f1f1f] px-3 py-2 font-mono text-[11px] tracking-[0.2em] text-[#9a9a9a] transition-colors hover:border-[#ff0000] hover:text-white"
            aria-label="switch language"
          >
            {lang.toUpperCase()}
          </button>
          <Link
            to="/booking"
            className="hidden bg-[#ff0000] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5 sm:block"
          >
            {t('nav.book')}
          </Link>
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            <span
              className={`h-[2px] w-6 bg-white transition-transform ${open ? 'translate-y-[4px] rotate-45' : ''}`}
            />
            <span
              className={`h-[2px] w-6 bg-white transition-transform ${open ? '-translate-y-[4px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`overflow-hidden border-b border-[#1f1f1f] bg-[#050505] transition-all duration-500 lg:hidden ${
          open ? 'max-h-[420px]' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 pb-6 pt-2">
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="border-b border-[#141414] py-3 font-display text-2xl uppercase"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/booking"
            className="mt-4 bg-[#ff0000] py-3 text-center font-mono text-xs uppercase tracking-[0.2em]"
          >
            {t('nav.book')}
          </Link>
        </nav>
      </div>
    </header>
  )
}
