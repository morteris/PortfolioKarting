import { ArrowUpRight, Github, KeyRound, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router'
import { useLang } from '../i18n'
import { REPOSITORY } from '../data'
import { ACCOUNTS, ROLES } from '../domain/booking'
import { useRole } from '../demo/store'

export function Footer() {
  const { t } = useLang()
  const signed = useRole()
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-intro">
          <div className="label">
            <KeyRound size={14} /> ACCESS / 02
          </div>
          <h2>{t('demoAccess')}</h2>
          <p>{t('footerInfo')}</p>
        </div>
        {ROLES.map((r) => (
          <section key={r} className="credential-card" aria-label={t(r)}>
            <h3>
              {r === 'pilot' ? <UserRound size={18} /> : <ShieldCheck size={18} />} {t(r)}
            </h3>
            <dl>
              <div>
                <dt>{t('email')}</dt>
                <dd>{ACCOUNTS[r].email}</dd>
              </div>
              <div>
                <dt>{t('password')}</dt>
                <dd>{ACCOUNTS[r].password}</dd>
              </div>
            </dl>
            <Link to={signed === r ? '/profile' : `/login?role=${r}`}>
              {t(signed === r ? 'account' : r === 'admin' ? 'asAdmin' : 'asPilot')}{' '}
              <ArrowUpRight size={15} />
            </Link>
          </section>
        ))}
      </div>
      <div className="shell footer-base">
        <span>
          © {new Date().getFullYear()} {t('author')} <i>/</i> {t('footerLine')}
        </span>
        <a href={REPOSITORY} target="_blank" rel="noreferrer">
          <Github size={14} /> GitHub <ArrowUpRight size={13} />
        </a>
      </div>
    </footer>
  )
}
