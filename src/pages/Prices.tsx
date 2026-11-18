import { ArrowRight, Timer } from 'lucide-react'
import { Link } from 'react-router'
import { PLANS, money } from '../data'
import { useLang } from '../i18n'
import { enterOnView } from '../lib/motion'
import { PageHead } from '../components/Design'

export default function Prices() {
  const { t, lang } = useLang()
  return (
    <section className="shell inner-page">
      <PageHead kicker={`KART RUSH / ${t('plansKicker')}`} title={t('plansHeading')}>
        {t('plansText')}
      </PageHead>
      <div className="plan-list">
        {PLANS.map((p, i) => (
          <article className="plan-row" key={p.id} ref={enterOnView}>
            <span className="plan-number mono">/ 0{i + 1}</span>
            <div>
              <h2>{p.name[lang]}</h2>
              <span className="plan-time">
                <Timer size={14} />
                {p.minutes} {t('minutes')}
              </span>
            </div>
            <p>{p.description[lang]}</p>
            <div className="plan-rate">
              <strong>{money(p.price, lang)}</strong>
              <small>{t(p.group ? 'perEvent' : 'perDriver')}</small>
            </div>
            <Link to={`/booking?plan=${p.id}`} className="btn outline">
              {t('selectPlan')} <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
