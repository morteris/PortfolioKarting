import { Link } from 'react-router'
import { useLang } from '../i18n'

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-[#1f1f1f] bg-[#050505]">
      <div className="checker red" />
      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-14 md:grid-cols-3 md:px-10">
        <div>
          <div className="font-display text-3xl">
            KART<span className="text-[#ff0000]">RUSH</span>
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#9a9a9a]">
            {t('footer.tag')}
          </p>
        </div>
        <div className="flex flex-col gap-2 font-mono text-xs text-[#9a9a9a]">
          <span>{t('about.addr')}</span>
          <span>{t('about.hours')}</span>
          <a href="tel:+74950000707" className="transition-colors hover:text-white">
            +7 495 000-07-07
          </a>
        </div>
        <div className="flex flex-col gap-2 font-mono text-xs text-[#9a9a9a] md:items-end">
          <Link to="/booking" className="transition-colors hover:text-[#ff0000]">
            {t('nav.booking')}
          </Link>
          <Link to="/tracks" className="transition-colors hover:text-[#ff0000]">
            {t('nav.tracks')}
          </Link>
          <Link to="/prices" className="transition-colors hover:text-[#ff0000]">
            {t('nav.prices')}
          </Link>
        </div>
      </div>
      <div className="border-t border-[#141414] px-5 py-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] md:px-10">
        © 2026 KART RUSH — {t('footer.rights')}
      </div>
    </footer>
  )
}
