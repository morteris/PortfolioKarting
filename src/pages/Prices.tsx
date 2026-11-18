import { Link } from 'react-router'
import { useLang } from '../i18n'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/Reveal'

const PLANS = [
  { n: 1, price: '1 500 ₽', unit: 'prices.unit' },
  { n: 2, price: '3 900 ₽', unit: 'prices.unit' },
  { n: 3, price: '7 200 ₽', unit: 'prices.unit' },
  { n: 4, price: '95 000 ₽', unit: 'prices.unit.hour' },
] as const

export default function Prices() {
  const { t } = useLang()
  return (
    <div className="page pt-24 md:pt-28">
      <section className="mx-auto max-w-[1500px] px-5 pb-24 md:px-10">
        <Reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff0000]">
          — {t('prices.kicker')}
        </Reveal>
        <Reveal as="h2" delay={0.05} className="mt-3 font-display text-4xl uppercase md:text-7xl">
          {t('prices.title')}
        </Reveal>

        <div className="mt-12">
          {PLANS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <div className="price-row group grid cursor-pointer grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 py-6 md:grid-cols-[80px_1.2fr_1fr_auto_auto] md:py-8">
                <span className="price-tag bg-[#141414] px-3 py-1 font-mono text-[11px] transition-colors">
                  0{p.n}
                </span>
                <div>
                  <div className="font-display text-2xl uppercase md:text-4xl">
                    {t(`prices.p${p.n}.name` as never)}
                  </div>
                  <div className="price-muted mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#9a9a9a] transition-colors">
                    {t(`prices.p${p.n}.time` as never)}
                  </div>
                </div>
                <p className="price-muted col-span-2 text-sm leading-relaxed text-[#9a9a9a] transition-colors md:col-span-1">
                  {t(`prices.p${p.n}.d` as never)}
                </p>
                <div className="text-right">
                  <span className="font-display text-2xl md:text-3xl">{p.price}</span>
                  <div className="price-muted font-mono text-[10px] uppercase tracking-[0.15em] text-[#666] transition-colors">
                    {t(p.unit as never)}
                  </div>
                </div>
                <Link
                  to="/booking"
                  className="hidden border border-current px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] md:block"
                >
                  {t('prices.book')} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10 border-l-2 border-[#ff0000] pl-5 font-mono text-xs leading-relaxed text-[#9a9a9a]">
          {t('prices.note')}
        </Reveal>
      </section>
      <Marquee tag={t('marquee.tag')} text={t('marquee2')} red />
    </div>
  )
}
