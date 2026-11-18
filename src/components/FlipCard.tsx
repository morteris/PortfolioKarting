import { useState } from 'react'
import { Link } from 'react-router'
import { useLang } from '../i18n'

export interface TrackData {
  id: string
  nameKey: 'tracks.t1.name' | 'tracks.t2.name' | 'tracks.t3.name'
  typeKey: 'tracks.t1.type' | 'tracks.t2.type' | 'tracks.t3.type'
  descKey: 'tracks.t1.desc' | 'tracks.t2.desc' | 'tracks.t3.desc'
  img: string
  length: string
  turns: number
}

/** 3D flip card for a karting track. Front: photo + name. Back: specs + CTA. */
export function FlipCard({ track, index }: { track: TrackData; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const { t } = useLang()
  return (
    <div
      className={`flip h-[460px] md:h-[520px] ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
      data-cursor
    >
      <div className="flip-inner">
        {/* front */}
        <div className="flip-face img-zoom border border-[#1f1f1f] bg-[#0c0c0c]">
          <img
            src={track.img}
            alt={t(track.nameKey)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <div className="absolute left-0 top-0 flex w-full items-start justify-between p-5">
            <span className="bg-[#ff0000] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
              0{index + 1}
            </span>
            <span className="border border-white/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
              {t(track.typeKey)}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-5">
            <h3 className="font-display text-3xl uppercase leading-none md:text-4xl">
              {t(track.nameKey)}
            </h3>
            <div className="mt-3 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-[#9a9a9a]">
              <span>{track.length}</span>
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-[#ff0000]" />
              <span>
                {track.turns} {t('tracks.turns').toLowerCase()}
              </span>
            </div>
          </div>
        </div>
        {/* back */}
        <div className="flip-face flip-back flex flex-col justify-between border border-[#ff0000]/60 bg-[#0c0c0c] p-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ff0000]">
              {t(track.typeKey)} — {t(track.nameKey)}
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[#c9c9c9]">{t(track.descKey)}</p>
            <div className="mt-6 grid grid-cols-2 gap-px bg-[#1f1f1f]">
              <div className="bg-[#0c0c0c] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">
                  {t('tracks.length')}
                </div>
                <div className="mt-1 font-display text-xl">{track.length}</div>
              </div>
              <div className="bg-[#0c0c0c] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">
                  {t('tracks.turns')}
                </div>
                <div className="mt-1 font-display text-xl">{track.turns}</div>
              </div>
            </div>
          </div>
          <Link
            to="/booking"
            onClick={(e) => e.stopPropagation()}
            className="btn-rush mt-6 justify-center"
          >
            {t('tracks.book')} <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
