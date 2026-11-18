import { useLang } from '../i18n'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/Reveal'
import { Link } from 'react-router'
import { IMAGES } from '../data'

export default function About() {
  const { t } = useLang()
  return (
    <div className="page pt-24 md:pt-28">
      <section className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff0000]">
          — {t('about.kicker')}
        </Reveal>
        <Reveal as="h2" delay={0.05} className="mt-3 font-display uppercase leading-[0.9]">
          <span className="block text-4xl md:text-7xl">{t('about.title')}</span>
          <span className="text-outline-red block text-4xl md:text-7xl">{t('about.title2')}</span>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <Reveal delay={0.1} className="text-base leading-relaxed text-[#c9c9c9]">
              {t('about.p1')}
            </Reveal>
            <Reveal delay={0.2} className="mt-5 text-base leading-relaxed text-[#c9c9c9]">
              {t('about.p2')}
            </Reveal>
            <Reveal delay={0.3} className="mt-8">
              <Link to="/booking" className="btn-rush solid">
                {t('nav.book')} <span className="arrow">→</span>
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="img-zoom mask-slope border border-[#1f1f1f]">
            <img src={IMAGES.indoorAction} alt="Karting action" className="h-full w-full object-cover" />
          </Reveal>
        </div>
      </section>

      {/* gallery strip */}
      <section className="mx-auto mt-16 grid max-w-[1500px] grid-cols-2 gap-4 px-5 md:grid-cols-4 md:px-10">
        {[
          { src: IMAGES.neonDriver, cls: 'md:mt-10' },
          { src: IMAGES.helmet, cls: '' },
          { src: IMAGES.aerialNight, cls: 'md:mt-6' },
          { src: IMAGES.hero, cls: 'md:mt-14' },
        ].map((g, i) => (
          <Reveal key={i} delay={i * 0.1} className={`img-zoom border border-[#1f1f1f] ${g.cls}`}>
            <img src={g.src} alt="" className="aspect-[3/4] w-full object-cover md:aspect-auto md:h-[320px]" loading="lazy" />
          </Reveal>
        ))}
      </section>

      <div className="mt-20">
        <Marquee tag={t('marquee.tag')} text={t('marquee1')} outline baseSpeed={45} />
      </div>

      {/* contacts */}
      <section className="mx-auto max-w-[1500px] px-5 py-20 md:px-10">
        <Reveal as="h3" className="font-display text-3xl uppercase md:text-5xl">
          {t('about.contacts')}
        </Reveal>
        <div className="mt-10 grid gap-px bg-[#1f1f1f] md:grid-cols-3">
          {[
            ['GPS', t('about.addr')],
            ['TEL', '+7 495 000-07-07'],
            ['TIME', t('about.hours')],
          ].map(([k, v], i) => (
            <Reveal key={k} delay={i * 0.12} className="group bg-[#0a0a0a] p-8 transition-colors hover:bg-[#ff0000]">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#666] transition-colors group-hover:text-white/70">
                {k}
              </div>
              <div className="mt-3 font-display text-lg md:text-xl">{v}</div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
