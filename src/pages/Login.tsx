import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Flag,
  Info,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { ACCOUNTS, DemoError, ROLES } from '../domain/booking'
import type { ErrorCode, Role } from '../domain/booking'
import { signIn, useRole } from '../demo/store'
import { useLang } from '../i18n'
import { Eyebrow } from '../components/Design'

export default function Login() {
  const { t } = useLang()
  const [query] = useSearchParams()
  const navigate = useNavigate()
  const signed = useRole()
  const selected = ROLES.find((r) => r === query.get('role'))
  const next = query.get('next') ?? ''
  // Only a local booking route is an allowed return destination.
  const returnTo = next.split('?')[0] === '/booking' ? next : '/profile'
  const [email, setEmail] = useState<string>(selected ? ACCOUNTS[selected].email : '')
  const [password, setPassword] = useState<string>(selected ? ACCOUNTS[selected].password : '')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<ErrorCode | null>(null)
  if (signed && !selected) return <Navigate to={returnTo} replace />
  function fill(r: Role) {
    setEmail(ACCOUNTS[r].email)
    setPassword(ACCOUNTS[r].password)
    setError(null)
  }
  function submit(e: FormEvent) {
    e.preventDefault()
    try {
      signIn(email, password)
      navigate(returnTo, { replace: true })
    } catch (e) {
      setError(e instanceof DemoError ? e.code : 'storage')
    }
  }
  return (
    <div className="shell inner-page login-page">
      <Link className="back-link" to="/">
        <ArrowLeft size={15} />
        {t('back')}
      </Link>
      <div className="login-layout">
        <div className="login-box">
          <Eyebrow>{t('loginKicker')}</Eyebrow>
          <h1>{t('loginHeading')}</h1>
          <p>{t('loginText')}</p>
          {returnTo !== '/profile' && (
            <div className="notice">
              <Info size={16} />
              {t('keepDraft')}
            </div>
          )}
          <form onSubmit={submit} className="login-form">
            <label className="form-label" htmlFor="email">
              {t('email')}
            </label>
            <input
              className="field"
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              placeholder="pilot@kart.test"
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
            />
            <label className="form-label" htmlFor="password">
              {t('password')}
            </label>
            <div className="pass-field">
              <input
                className="field"
                id="password"
                name="password"
                type={show ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
              />
              <button
                type="button"
                aria-label={t(show ? 'hidePass' : 'showPass')}
                aria-pressed={show}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="error-box" role="alert">
                {t(error)}
              </p>
            )}
            <button className="btn primary wide" type="submit">
              {t(returnTo === '/profile' ? 'signSubmit' : 'continueBooking')}
              <ArrowRight size={17} />
            </button>
          </form>
          <div className="quick-fill">
            <span className="label">{t('fill')}</span>
            <div>
              {ROLES.map((r) => (
                <button
                  key={r}
                  className="btn outline compact"
                  type="button"
                  onClick={() => fill(r)}
                >
                  {r === 'pilot' ? <UserRound size={15} /> : <ShieldCheck size={15} />}{' '}
                  {t(r === 'pilot' ? 'rolePilot' : 'roleAdmin')}
                </button>
              ))}
            </div>
          </div>
        </div>
        <aside className="login-visual">
          <img src="images/kart.jpg" alt="" />
          <div className="login-visual-overlay" />
          <span className="visual-tag mono">
            <Flag size={15} /> PADDOCK / ACCESS
          </span>
          <div className="login-caption">
            <span className="label">KART RUSH / DEMO</span>
            <h2>{t('localMode')}</h2>
            <p>{t('localDesc')}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
