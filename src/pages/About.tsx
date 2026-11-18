import { ArrowUpRight, Github } from 'lucide-react'
import { REPOSITORY } from '../data'
import { useLang } from '../i18n'
import { Eyebrow, PageHead } from '../components/Design'

export default function About() {
  const { t } = useLang()
  return (
    <section className="shell inner-page">
      <PageHead kicker={`Portfolio / ${t('authorKicker')}`} title={t('aboutHeading')} />
      <div className="about-panel">
        <div>
          <Eyebrow>Frontend / {t('author')}</Eyebrow>
          <p>{t('aboutIntro')}</p>
          <div className="tech-badges">
            <span>React</span>
            <span>TypeScript</span>
            <span>Vite</span>
          </div>
          <a className="btn outline" href={REPOSITORY} target="_blank" rel="noreferrer">
            <Github size={17} />
            {t('openProject')}
            <ArrowUpRight size={15} />
          </a>
        </div>
        <img src="images/real-indoor-action.jpg" alt={t('track')} />
      </div>
      <h2 className="section-title about-sub">{t('built')}</h2>
      <div className="steps">
        {(['1', '2', '3'] as const).map((n) => (
          <article className="step" key={n}>
            <div className="step-index">/ 0{n}</div>
            <h3>{t(`brief${n}`)}</h3>
            <p>{t(`brief${n}Text`)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
