import { useEffect, useRef } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router'
import { useLang } from './i18n'
import type { Message } from './i18n'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import Tracks from './pages/Tracks'
import Prices from './pages/Prices'
import About from './pages/About'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Profile from './pages/Profile'

const titles: Record<string, Message> = {
  '/': 'home',
  '/tracks': 'tracks',
  '/prices': 'prices',
  '/about': 'about',
  '/booking': 'booking',
  '/login': 'loginHeading',
  '/profile': 'account',
  '/admin': 'adminKicker',
}
export default function App() {
  const { pathname, search } = useLocation()
  const { lang, t } = useLang()
  const main = useRef<HTMLElement>(null)
  const route = pathname + search
  const last = useRef(route)
  const title = `${t(titles[pathname] ?? 'notFound')} — ${t('author')} | KART RUSH`
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = title
  }, [lang, title])
  useEffect(() => {
    if (last.current !== route) {
      main.current?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
      last.current = route
    }
  }, [route])
  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={(e) => {
          e.preventDefault()
          main.current?.focus()
        }}
      >
        {t('skip')}
      </a>
      <Navbar key={pathname} />
      <main id="content" tabIndex={-1} ref={main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracks" element={<Tracks />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking key={search} />} />
          <Route path="/login" element={<Login key={search} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Profile adminOnly />} />
          <Route
            path="*"
            element={
              <section className="shell inner-page">
                <span className="label">ERROR / 404</span>
                <h1>{t('notFound')}</h1>
                <Link className="btn outline" to="/">
                  {t('back')}
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
