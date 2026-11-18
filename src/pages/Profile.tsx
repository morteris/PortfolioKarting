import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Flag,
  LogOut,
  Plus,
  ShieldCheck,
  Ticket,
  UserRound,
} from 'lucide-react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { ACCOUNTS, STATUSES } from '../domain/booking'
import type { Status } from '../domain/booking'
import { signOut, useRecords, useRole } from '../demo/store'
import { useLang } from '../i18n'
import { Eyebrow } from '../components/Design'
import { BookingTicket } from '../components/BookingTicket'

export default function Profile({ adminOnly = false }: { adminOnly?: boolean }) {
  const { t } = useLang()
  const role = useRole()
  const { bookings, corrupt } = useRecords()
  const [query] = useSearchParams()
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [message, setMessage] = useState<'updated' | 'storage' | null>(null)
  if (!role) return <Navigate to={adminOnly ? '/login?role=admin' : '/login'} replace />
  const admin = role === 'admin'
  if (adminOnly && !admin) return <Navigate to="/profile" replace />
  const list = bookings.filter((b) => admin || b.owner === role)
  const filtered = list.filter((b) => filter === 'all' || b.status === filter)
  const created = list.some((b) => b.id === query.get('created'))
  function exit() {
    try {
      signOut()
    } catch {
      setMessage('storage')
    }
  }
  return (
    <section className="shell inner-page profile-page">
      <div className="profile-heading">
        <div>
          <Eyebrow>{t(admin ? 'adminKicker' : 'profileKicker')}</Eyebrow>
          <h1>{t(admin ? 'allBookings' : 'myBookings')}</h1>
          <div className="identity-chip">
            {admin ? <ShieldCheck size={17} /> : <UserRound size={17} />}
            <b>{t(role)}</b>
            <span>/</span>
            {ACCOUNTS[role].email}
          </div>
        </div>
        <div className="profile-tools">
          <Link className="btn primary compact" to="/booking">
            <Plus size={16} />
            {t('newBooking')}
          </Link>
          <button className="btn outline compact" onClick={exit}>
            <LogOut size={15} />
            {t('logout')}
          </button>
        </div>
      </div>
      {(message || created) && (
        <div className={message === 'storage' ? 'error-box' : 'notice success'} role="status">
          <CheckCircle2 size={17} />
          {t(message ?? 'created')}
        </div>
      )}
      {corrupt && (
        <p className="error-box" role="alert">
          {t('corrupt')}
        </p>
      )}
      <div className="dashboard-stats">
        {(
          [
            [t('countAll'), list.length],
            [t('countPending'), list.filter((b) => b.status === 'pending').length],
            [t('countConfirmed'), list.filter((b) => b.status === 'confirmed').length],
          ] as const
        ).map(([k, n]) => (
          <div key={k}>
            <span>{k}</span>
            <strong>{String(n).padStart(2, '0')}</strong>
          </div>
        ))}
      </div>
      <h2 className="list-title">{t(admin ? 'incoming' : 'history')}</h2>
      <div className="filter-bar" role="group" aria-label={t('filters')}>
        {(['all', ...STATUSES] as const).map((f) => (
          <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {t(f)}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="ticket-list">
          {filtered.map((b) => (
            <BookingTicket b={b} role={role} key={b.id} notify={() => setMessage('updated')} />
          ))}
        </div>
      ) : (
        !corrupt && (
          <div className="empty-state">
            <div className="empty-icon">{admin ? <Flag size={25} /> : <Ticket size={25} />}</div>
            <h3>{t(list.length ? 'emptyFilter' : 'empty')}</h3>
            {list.length ? (
              <button className="text-link" onClick={() => setFilter('all')}>
                {t('resetFilter')}
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <p>{t(admin ? 'emptyAdmin' : 'emptyPilot')}</p>
                <Link className="btn outline compact" to={admin ? '/login?role=pilot' : '/booking'}>
                  {t(admin ? 'asPilot' : 'book')}
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        )
      )}
    </section>
  )
}
