import { useState } from 'react'
import { TRACKS } from '../data'
import { useLang } from '../i18n'
import { PageHead, TrackCard } from '../components/Design'

export default function Tracks() {
  const { t, lang } = useLang()
  const [filter, setFilter] = useState('all')
  return (
    <section className="shell inner-page">
      <PageHead kicker={`KART RUSH / ${t('catalogKicker')}`} title={t('circuitsHeading')}>
        {t('catalogText')}
      </PageHead>
      <div className="filter-bar">
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>
          {t('all')} <small>03</small>
        </button>
        {TRACKS.map((tr) => (
          <button key={tr.id} aria-pressed={filter === tr.id} onClick={() => setFilter(tr.id)}>
            {tr.type[lang]}
          </button>
        ))}
      </div>
      <div className="track-grid">
        {TRACKS.map(
          (tr, i) =>
            (filter === 'all' || tr.id === filter) && (
              <TrackCard key={tr.id} index={i} track={tr} detail />
            ),
        )}
      </div>
    </section>
  )
}
