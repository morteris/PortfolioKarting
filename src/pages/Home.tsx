import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  CircleDot,
  Code2,
  Crosshair,
  Flag,
  GitBranch,
  Layers3,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router'
import { IMAGES, REPOSITORY, TRACKS } from '../data'
import { Eyebrow, Trace, TrackCard } from '../components/Design'
import { useLang } from '../i18n'

export default function Home() {
  const { t, lang } = useLang()
  return (
    <>
      <section className="hero" aria-labelledby="project-title">
        <div className="hero-photograph">
          <img src={IMAGES.hero} fetchPriority="high" alt="" />
        </div>
        <div className="hero-shade" />
        <div className="shell hero-inner">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="index-tag">{t('project01')}</span>
              <span className="kicker-divider" />
              <span>{t('portfolio')}</span>
            </div>
            <h1 className="hero-title" id="project-title" lang="en">
              KART <em>RUSH</em>
            </h1>
            <h2 className="hero-lead">{t('heroLead')}</h2>
            <p className="hero-description">{t('heroBody')}</p>
            <div className="hero-actions">
              <Link to="/booking" className="btn primary">
                {t('book')} <ArrowRight size={18} />
              </Link>
              <a className="btn ghost" href={REPOSITORY} target="_blank" rel="noreferrer">
                <Code2 size={18} />
                {t('repo')} <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <div className="cam-mark" aria-hidden="true">
            <Crosshair size={14} /> CAM 01 <span>/</span> TRACKSIDE
          </div>
          <div className="circuit-tag" aria-hidden="true">
            <Trace track={TRACKS[0]} />
            <div>
              <span className="mono">CIRCUIT / 01</span>
              <strong>{TRACKS[0].name[lang]}</strong>
            </div>
          </div>
        </div>
        <div className="hero-rule" aria-hidden="true" />
      </section>
      <div className="project-strip">
        <div className="shell project-facts">
          <div className="project-fact">
            <Braces />
            <div>
              <span>{t('technology')}</span>
              <strong>
                React <i> / </i> TypeScript <i> / </i> Vite
              </strong>
            </div>
          </div>
          <div className="project-fact">
            <Layers3 />
            <div>
              <span>{t('format')}</span>
              <strong>{t('webapp')}</strong>
            </div>
          </div>
          <div className="project-fact">
            <UsersRound />
            <div>
              <span>{t('roles')}</span>
              <strong>{t('bothRoles')}</strong>
            </div>
          </div>
          <div className="project-fact demo-fact">
            <span className="online-dot" />
            <div>
              <span>Runtime</span>
              <strong>Local demo</strong>
            </div>
          </div>
        </div>
      </div>
      <section className="shell home-section">
        <div className="section-row">
          <div>
            <Eyebrow>01 / {t('catalogKicker')}</Eyebrow>
            <h2>
              {t('circuitsHeading')}
              <sup>03</sup>
            </h2>
          </div>
          <Link className="text-link" to="/tracks">
            {t('allTracks')}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="track-grid">
          {TRACKS.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i} />
          ))}
        </div>
      </section>
      <section className="flow-section">
        <div className="shell">
          <Eyebrow>02 / {t('flowKicker')}</Eyebrow>
          <h2 className="section-title">{t('flowHeading')}</h2>
          <div className="steps">
            {(
              [
                { title: 'step1', body: 'step1Text', Icon: CircleDot },
                { title: 'step2', body: 'step2Text', Icon: Flag },
                { title: 'step3', body: 'step3Text', Icon: GitBranch },
              ] as const
            ).map(({ title, body, Icon }, i) => (
              <div key={title} className="step">
                <div className="step-index">
                  <span>0{i + 1}</span>
                  <Icon size={18} />
                </div>
                <h3>{t(title)}</h3>
                <p>{t(body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
