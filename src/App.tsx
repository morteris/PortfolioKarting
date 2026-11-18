import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Lenis from 'lenis'
import { LangProvider } from './i18n'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Preloader, Cursor } from './components/Chrome'
import Home from './pages/Home'
import Tracks from './pages/Tracks'
import Prices from './pages/Prices'
import Booking from './pages/Booking'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  // smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <LangProvider>
      <div className="noise min-h-screen bg-[#050505] text-[#f4f4f4]">
        <Preloader />
        <Cursor />
        <Navbar />
        <ScrollToTop />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LangProvider>
  )
}
