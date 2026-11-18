import { useLang } from '../i18n'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/Reveal'
import { FlipCard } from '../components/FlipCard'
import { TRACKS } from '../data'

export default function Tracks() {
  const { t } = useLang()
  return (
    <div className="page pt-24 md:pt-28">
      <section className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff0000]">
          — {t('tracks.kicker')}
        </Reveal>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <Reveal as="h2" delay={0.05} className="font-display text-4xl uppercase md:text-7xl">
            {t('tracks.title')}
          </Reveal>
          <Reveal delay={0.15} className="pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#9a9a9a]">
            ( {t('tracks.hint')} )
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 pb-20 md:grid-cols-3">
          {TRACKS.map((tr, i) => (
            <Reveal key={tr.id} delay={i * 0.15}>
              <FlipCard track={tr} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
      <Marquee tag={t('marquee.tag')} text={t('marquee1')} red />
    </div>
  )
}
