import { useState } from 'react'
import { CalendarDays, Check, CircleCheck, CircleX, Clock3, Timer, X } from 'lucide-react'
import { ACCOUNTS, DemoError, canChange } from '../domain/booking'
import type { Booking, ErrorCode, Role } from '../domain/booking'
import { changeStatus, displayId } from '../demo/store'
import { dateText, money, planById, trackById } from '../data'
import { useLang } from '../i18n'

export function BookingTicket({ b, role, notify }: { b: Booking; role: Role; notify: () => void }) {
  const { t, lang } = useLang()
  const [ask, setAsk] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<ErrorCode | null>(null)
  const track = trackById(b.track),
    plan = planById(b.plan)
  const Icon = b.status === 'pending' ? Clock3 : b.status === 'confirmed' ? CircleCheck : CircleX
  async function setStatus(next: 'confirmed' | 'cancelled') {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await changeStatus(b.id, next)
      notify()
    } catch (e) {
      setError(e instanceof DemoError ? e.code : 'storage')
    } finally {
      setBusy(false)
      setAsk(false)
    }
  }
  return (
    <article className={'booking-ticket ' + b.status} aria-label={displayId(b.id)}>
      <div className="ticket-heading">
        <span className="label">{displayId(b.id)}</span>
        <span className={'status status-' + b.status}>
          <Icon size={14} />
          {t(b.status)}
        </span>
      </div>
      <div className="ticket-main">
        <img src={track.img} alt="" />
        <div>
          <h3>{track.name[lang]}</h3>
          <div className="ticket-times">
            <span>
              <CalendarDays size={15} />
              {dateText(b.date, lang)}
            </span>
            <span>
              <Timer size={15} />
              {b.slot} · UTC+3
            </span>
          </div>
        </div>
        <div className="ticket-amount">
          <small>{t('cost')}</small>
          <strong>{money(b.amount, lang)}</strong>
        </div>
      </div>
      <div className="ticket-meta">
        <span>
          {t('plan')}: <b>{plan.name[lang]}</b>
        </span>
        <span>
          {t('pilots')}: <b>{b.pilots}</b>
        </span>
        {role === 'admin' && (
          <span>
            {t('owner')}: <b>{ACCOUNTS[b.owner].email}</b>
          </span>
        )}
      </div>
      {(canChange(role, b, 'confirmed') || canChange(role, b, 'cancelled')) && (
        <div className="ticket-actions">
          {ask ? (
            <>
              <span>{t('askCancel')}</span>
              <button
                disabled={busy}
                className="btn outline compact danger"
                onClick={() => setStatus('cancelled')}
              >
                {t('cancelYes')}
              </button>
              <button className="btn outline compact" disabled={busy} onClick={() => setAsk(false)}>
                {t('cancelNo')}
              </button>
            </>
          ) : (
            <>
              {canChange(role, b, 'confirmed') && (
                <button
                  disabled={busy}
                  className="btn primary compact"
                  onClick={() => setStatus('confirmed')}
                >
                  <Check size={15} />
                  {t('confirm')}
                </button>
              )}
              {canChange(role, b, 'cancelled') && (
                <button
                  className="btn outline compact"
                  disabled={busy}
                  onClick={() => setAsk(true)}
                >
                  <X size={14} />
                  {t('cancel')}
                </button>
              )}
            </>
          )}
        </div>
      )}
      {error && (
        <p role="alert" className="error-box">
          {t(error)}
        </p>
      )}
    </article>
  )
}
