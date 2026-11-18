import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Globe2, Menu, UserRound, X } from 'lucide-react'
import { useLang } from '../i18n'
import { useRole } from '../demo/store'
import { Mark } from './Design'

export function Navbar() {
  const { t, lang, toggle } = useLang()
  const role = useRole()
  const [open, setOpen] = useState(false)
  const control = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        control.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])
  const links = [
    ['/', 'home'],
    ['/tracks', 'tracks'],
    ['/prices', 'prices'],
    ['/about', 'about'],
  ] as const
  const items = links.map(([path, key]) => (
    <NavLink key={path} end to={path} onClick={() => setOpen(false)}>
      {t(key)}
    </NavLink>
  ))
  return (
    <header className="topbar">
      <div className="shell nav-row">
        <Link className="wordmark" to="/" aria-label={`${t('author')} — ${t('home')}`}>
          <Mark />
          <span>{t('author')}</span>
        </Link>
        <nav className="desktop-nav" aria-label={t('menu')}>
          {items}
        </nav>
        <div className="nav-actions">
          <button
            className="language-btn"
            onClick={toggle}
            aria-label={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          >
            <Globe2 size={15} />
            <span>{lang.toUpperCase()}</span>
          </button>
          <Link className="account-btn" to={role ? '/profile' : '/login'}>
            <UserRound size={16} />
            {t(role ? 'account' : 'login')}
          </Link>
          <button
            ref={control}
            className="menu-btn"
            aria-controls="mobile-nav"
            aria-label={t(open ? 'close' : 'menu')}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-nav" hidden={!open} aria-label={t('menu')}>
        {items}
        <Link to="/booking" onClick={() => setOpen(false)}>
          {t('booking')}
        </Link>
      </nav>
    </header>
  )
}
