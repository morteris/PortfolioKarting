import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useLang } from '../i18n'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/Reveal'
import { FlipCard } from '../components/FlipCard'
import { useCounter, useInView } from '../hooks/anim'
import { TRACKS, IMAGES } from '../data'

/** Splits text into chars that flip up one by one (after the preloader). */
function CharReveal({ text, offset = 0, className = '' }: { text: string; offset?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} className="char-mask" aria-hidden>
          <span style={{ ['--d' as string]: `${2.1 + offset + i * 0.045}s` }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        </span>
      ))}
    </span>
  )
}

function Stat({ value, suffix, label, start, delay }: { value: number; suffix: string; label: string; start: boolean; delay: number }) {
  const v = useCounter(value, start)
  return (
    <Reveal delay={delay} className="border-l border-[#1f1f1f] pl-5">
      <div className="stat-num text-4xl md:text-6xl">
        {v}
        <span className="text-[#ff0000]">{suffix}</span>
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#9a9a9a]">{label}</div>
    </Reveal>
  )
}

export default function Home() {
  const { t } = useLang()
  const heroImg = useRef<HTMLDivElement>(null)

  // hero parallax
  useEffect(() => {
    const el = heroImg.current
    if (!el) return
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.08)`
      })
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  const { ref: statsRef, inView: statsIn } = useInView<HTMLDivElement>()

  return (
    <div className="page">
      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[100svh] min-h-[620px] flex-col justify-end overflow-hidden">
        <div ref={heroImg} className="absolute inset-0 will-change-transform">
          <img src={IMAGES.hero} alt="Kart racing" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/25 to-[#050505]/40" />

        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-8 md:px-10">
          <Reveal className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff0000]" delay={2.2}>
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#ff0000]" />
            {t('hero.kicker')}
          </Reveal>

          <h1 className="font-display uppercase leading-[0.9]">
            <span className="block text-[clamp(3.2rem,11vw,9.5rem)]">
              <CharReveal text={t('hero.title1')} />
            </span>
            <span className="block text-[clamp(3.2rem,11vw,9.5rem)] text-[#ff0000]">
              <CharReveal text={t('hero.title2')} offset={0.25} />
            </span>
            <span className="text-outline block text-[clamp(3.2rem,11vw,9.5rem)]">
              <CharReveal text={t('hero.title3')} offset={0.5} />
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal delay={2.6} className="max-w-md text-[15px] leading-relaxed text-[#c9c9c9]">
              {t('hero.sub')}
            </Reveal>
            <Reveal delay={2.75} className="flex flex-wrap gap-4">
              <Link to="/booking" className="btn-rush solid">
                {t('hero.cta1')} <span className="arrow">→</span>
              </Link>
              <Link to="/tracks" className="btn-rush">
                {t('hero.cta2')}
              </Link>
            </Reveal>
          </div>
        </div>

        <Reveal delay={3} className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#9a9a9a] md:flex">
          {t('hero.scroll')}
          <span className="inline-block h-px w-12 bg-[#ff0000]" />
        </Reveal>
      </section>

      <div className="checker" />

      {/* ---------------- MARQUEE ---------------- */}
      <Marquee tag={t('marquee.tag')} text={t('marquee1')} red />

      {/* ---------------- STATS ---------------- */}
      <section ref={statsRef} className="mx-auto grid max-w-[1500px] grid-cols-2 gap-x-5 gap-y-10 px-5 py-16 md:grid-cols-4 md:px-10 md:py-24">
        <Stat value={3} suffix="" label={t('stats.tracks')} start={statsIn} delay={0} />
        <Stat value={34} suffix="" label={t('stats.karts')} start={statsIn} delay={0.1} />
        <Stat value={80} suffix="+" label={t('stats.speed')} start={statsIn} delay={0.2} />
        <Stat value={4200} suffix="+" label={t('stats.racers')} start={statsIn} delay={0.3} />
      </section>

      {/* ---------------- FEATURED TRACKS ---------------- */}
      <section className="mx-auto max-w-[1500px] px-5 pb-20 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff0000]">
              — {t('home.feat.kicker')}
            </Reveal>
            <Reveal delay={0.1} as="h2" className="mt-3 font-display text-3xl uppercase md:text-5xl">
              {t('home.feat.title')}
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link to="/tracks" className="btn-rush">
              {t('home.feat.more')} <span className="arrow">→</span>
            </Link>
          </Reveal>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TRACKS.map((tr, i) => (
            <Reveal key={tr.id} delay={i * 0.15}>
              <FlipCard track={tr} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee tag={t('marquee.tag')} text={t('marquee2')} outline baseSpeed={45} />

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
        <Reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff0000]">
          — {t('home.how.kicker')}
        </Reveal>
        <Reveal as="h2" delay={0.1} className="mt-3 font-display text-3xl uppercase md:text-5xl">
          {t('home.how.title')}
        </Reveal>

        <div className="mt-12 grid gap-px bg-[#1f1f1f] md:grid-cols-4">
          {[1, 2, 3, 4].map((n, i) => (
            <Reveal key={n} delay={i * 0.12} className="group relative bg-[#0a0a0a] p-7 transition-colors duration-300 hover:bg-[#ff0000]">
              <div className="font-display text-5xl text-[#2a2a2a] transition-colors group-hover:text-white/40">
                0{n}
              </div>
              <h3 className="mt-6 font-display text-xl uppercase">
                {t(`home.how.s${n}.t` as never)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#9a9a9a] transition-colors group-hover:text-white/85">
                {t(`home.how.s${n}.d` as never)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- BIG CTA ---------------- */}
      <section className="relative overflow-hidden border-t border-[#1f1f1f]">
        <div className="img-zoom mask-slope absolute inset-0 opacity-35">
          <img src={IMAGES.aerialNight} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-36">
          <Reveal as="h2" className="font-display uppercase leading-[0.9]">
            <span className="block text-[clamp(3rem,10vw,8rem)]">{t('home.cta.title')}</span>
            <span className="block text-[clamp(3rem,10vw,8rem)] text-[#ff0000]">{t('home.cta.title2')}</span>
          </Reveal>
          <Reveal delay={0.15} className="mt-5 max-w-md text-[15px] text-[#c9c9c9]">
            {t('home.cta.sub')}
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <Link to="/booking" className="btn-rush solid">
              {t('nav.book')} <span className="arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
