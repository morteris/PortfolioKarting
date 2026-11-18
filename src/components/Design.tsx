import type { ReactNode } from 'react'
import { ArrowUpRight, CornerDownRight, Route } from 'lucide-react'
import { Link } from 'react-router'
import type { Track } from '../data'
import { useLang } from '../i18n'

export function Mark() {
  return (
    <svg className="brand-mark" viewBox="0 0 44 30" fill="currentColor" aria-hidden="true">
      <path d="M1 26 14 4h7L8 26zM13 26 26 4h16L29 26z" />
    </svg>
  )
}
export function Trace({ track }: { track: Track }) {
  return (
    <svg className="trace" viewBox="0 0 102 60" fill="none" aria-hidden="true">
      <path
        d={track.outline}
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="43" r="3.4" fill="var(--accent)" stroke="#18191b" strokeWidth="1.2" />
    </svg>
  )
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow">
      <i aria-hidden="true" />
      {children}
    </div>
  )
}
export function PageHead({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="page-heading">
      <Eyebrow>{kicker}</Eyebrow>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  )
}
export function TrackCard({
  track,
  index,
  detail = false,
}: {
  track: Track
  index: number
  detail?: boolean
}) {
  const { t, lang } = useLang()
  return (
    <article className="track-card">
      <div className="track-picture">
        <img src={track.img} alt={track.name[lang]} loading="lazy" />
        <span className="track-plate">
          <b>0{index + 1}</b>
          <span>{track.type[lang]}</span>
        </span>
        <Trace track={track} />
      </div>
      <div className="track-info">
        <div className="card-title">
          <h3>{track.name[lang]}</h3>
          <span className="mono card-code">{track.code}</span>
        </div>
        {detail && <p>{track.description[lang]}</p>}
        <div className="track-specs">
          <span>
            <Route size={15} /> {track.length} {t('meters')}
          </span>
          <span>
            <CornerDownRight size={15} /> {t('turns')}: {track.turns}
          </span>
        </div>
        <Link
          className="card-action"
          to={`/booking?track=${track.id}`}
          aria-label={`${t('pickTrack')}: ${track.name[lang]}`}
        >
          {t('pickTrack')}
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  )
}
