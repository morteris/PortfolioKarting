import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Check, CircleHelp, Clock3, Flag, Ticket, UserRound } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router'
import { PLANS, TRACKS, dateText, money, planById, trackById } from '../data'
import {
  ACCOUNTS,
  DemoError,
  SLOTS,
  checkDraft,
  dateInMoscow,
  maxPilots,
  priceOf,
  validDate,
} from '../domain/booking'
import type { Draft, ErrorCode } from '../domain/booking'
import { createBooking, useRecords, useRole } from '../demo/store'
import { useLang } from '../i18n'
import { PageHead, Trace } from '../components/Design'

function initialDraft(query: URLSearchParams): Draft {
  const plan = planById(query.get('plan')).id
  const date = query.get('date') ?? ''
  const n = Number(query.get('pilots'))
  return {
    track: trackById(query.get('track')).id,
    plan,
    date:
      validDate(date) && date >= dateInMoscow() && date <= dateInMoscow(undefined, 90)
        ? date
        : dateInMoscow(undefined, 1),
    pilots: Number.isInteger(n) && n >= 1 && n <= maxPilots(plan) ? n : 1,
    slot: SLOTS.find((s) => s === query.get('slot')) ?? '',
  }
}
export default function BookingPage() {
  const { t, lang } = useLang()
  const role = useRole()
  const { bookings, corrupt } = useRecords()
  const [query] = useSearchParams()
  const navigate = useNavigate()
  const [draft, setDraft] = useState(() => initialDraft(query))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<ErrorCode | null>(null)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [])
  const track = trackById(draft.track),
    plan = planById(draft.plan)
  const amount = priceOf(draft)
  const slots = SLOTS.map((slot) => ({
    slot,
    off: checkDraft({ ...draft, slot }, bookings, now) !== null,
  }))
  const selected = slots.find((s) => s.slot === draft.slot && !s.off)?.slot ?? ''
  const lostSlot = Boolean(draft.slot && !selected)
  const update = (patch: Partial<Draft>) => {
    setDraft({ ...draft, ...patch })
    setError(null)
  }
  async function submit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    const problem = checkDraft(draft, bookings)
    if (problem || corrupt) {
      setError(corrupt ? 'corrupt' : problem)
      return
    }
    if (!role) {
      const params = new URLSearchParams({ ...draft, pilots: String(draft.pilots) })
      navigate('/login?' + new URLSearchParams({ next: `/booking?${params}` }))
      return
    }
    setBusy(true)
    setError(null)
    try {
      const b = await createBooking(draft)
      navigate(`/profile?created=${b.id}`, { replace: true })
    } catch (e) {
      setError(e instanceof DemoError ? e.code : 'storage')
      setBusy(false)
    }
  }
  return (
    <section className="shell inner-page">
      <PageHead kicker={t('reserveKicker')} title={t('reserveHeading')}>
        {t('reserveText')}
      </PageHead>
      <div className="booking-layout">
        <form className="panel booking-form" onSubmit={submit}>
          <div className="panel-head">
            <span className="label">GRID / 01</span>
            <h2>{t('params')}</h2>
          </div>
          <div className="form-grid">
            <label className="field-label">
              {t('track')}
              <select
                className="field"
                value={draft.track}
                onChange={(e) => update({ track: trackById(e.target.value).id, slot: '' })}
              >
                {TRACKS.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.name[lang]} · {tr.length} {t('meters')}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              {t('plan')}
              <select
                className="field"
                value={draft.plan}
                onChange={(e) => {
                  const id = planById(e.target.value).id
                  update({ plan: id, pilots: Math.min(draft.pilots, maxPilots(id)), slot: '' })
                }}
              >
                {PLANS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name[lang]} · {p.minutes} {t('minutes')}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              {t('date')}
              <input
                className="field"
                type="date"
                required
                min={dateInMoscow(now)}
                max={dateInMoscow(now, 90)}
                value={draft.date}
                onChange={(e) => update({ date: e.target.value, slot: '' })}
              />
            </label>
            <label className="field-label">
              {t('pilots')}
              <select
                className="field"
                value={draft.pilots}
                onChange={(e) => update({ pilots: Number(e.target.value) })}
              >
                {Array.from({ length: maxPilots(draft.plan) }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <fieldset className="slot-field">
            <legend>
              {t('time')} <small>UTC+3</small>
            </legend>
            <div className="slot-grid">
              {slots.map(({ slot, off }) => (
                <button
                  key={slot}
                  type="button"
                  className="slot"
                  disabled={off}
                  aria-pressed={selected === slot}
                  onClick={() => update({ slot })}
                >
                  {slot}
                  {selected === slot && <Check size={12} />}
                </button>
              ))}
            </div>
            <p className="helper">
              <Clock3 size={13} />
              {t(slots.every((s) => s.off) ? 'noSlots' : 'slotHint')}
            </p>
          </fieldset>
          {role && (
            <p className="helper">
              <UserRound size={14} /> {t('loggedAs')} {ACCOUNTS[role].email}
            </p>
          )}
          {(error || corrupt || lostSlot) && (
            <p className="error-box" role="alert">
              {t(error ?? (corrupt ? 'corrupt' : (checkDraft(draft, bookings, now) ?? 'occupied')))}
            </p>
          )}
          <div className="form-bottom">
            <button
              type="submit"
              disabled={busy || !selected || corrupt}
              className="btn primary wide"
            >
              {t(busy ? 'busy' : role ? 'create' : 'guestBook')}
              <ArrowRight size={17} />
            </button>
            {!selected && <p className="helper center">{t('pickTime')}</p>}
          </div>
        </form>
        <aside className="quote panel">
          <div className="quote-photo">
            <img src={track.img} alt="" />
            <span className="visual-tag mono">
              <Ticket size={15} /> SESSION / PASS
            </span>
            <Trace key={track.id} track={track} />
          </div>
          <div className="quote-body">
            <span className="label">
              <Flag size={14} /> {t('quote')}
            </span>
            <h2>{track.name[lang]}</h2>
            <dl className="summary-list">
              {[
                [t('plan'), plan.name[lang]],
                [t('duration'), `${plan.minutes} ${t('minutes')}`],
                [t('date'), validDate(draft.date) ? dateText(draft.date, lang) : '—'],
                [t('time'), selected ? `${selected} · UTC+3` : '—'],
                [t('pilots'), draft.pilots],
              ].map(([l, v]) => (
                <div key={l}>
                  <dt>{l}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="quote-total" aria-live="polite" aria-atomic="true">
              <span>{t('estimate')}</span>
              <strong key={amount}>{money(amount, lang)}</strong>
            </div>
            <p className="helper">
              <CircleHelp size={14} />
              {t('noPayment')}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
