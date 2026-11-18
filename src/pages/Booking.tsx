import { useMemo, useState } from 'react'
import { useLang } from '../i18n'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/Reveal'
import { TRACKS, IMAGES } from '../data'

const SLOTS = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '22:00']

export default function Booking() {
  const { t, lang } = useLang()
  const [track, setTrack] = useState(TRACKS[0].id)
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [tariff, setTariff] = useState(2)
  const [pilots, setPilots] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(false)

  // pseudo-random "occupied" slots per date for realism
  const occupied = useMemo(() => {
    const seed = (date || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return SLOTS.filter((_, i) => (seed + i * 7) % 5 === 0)
  }, [date])

  const minDate = new Date().toISOString().slice(0, 10)
  const trackObj = TRACKS.find((tr) => tr.id === track)!
  const valid = date && slot && name.trim().length > 1 && phone.trim().length > 5

  return (
    <div className="page pt-24 md:pt-28">
      <section className="mx-auto max-w-[1500px] px-5 pb-24 md:px-10">
        <Reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff0000]">
          — {t('booking.kicker')}
        </Reveal>
        <Reveal as="h2" delay={0.05} className="mt-3 font-display text-4xl uppercase md:text-7xl">
          {t('booking.title')}
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* -------- form / confirmation -------- */}
          <Reveal delay={0.1}>
            {done ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center border border-[#1f1f1f] bg-[#0a0a0a] p-8 text-center">
                <div className="stamp text-xl md:text-2xl">{t('booking.done')}</div>
                <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-px bg-[#1f1f1f] text-left">
                  {[
                    [t('booking.track'), t(trackObj.nameKey)],
                    [t('booking.date'), date],
                    [t('booking.time'), slot],
                    [t('booking.pilots'), String(pilots)],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-[#0a0a0a] p-4">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">{k}</div>
                      <div className="mt-1 font-display text-lg">{v}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#9a9a9a]">{t('booking.done.sub')}</p>
                <button onClick={() => setDone(false)} className="btn-rush mt-8">
                  {t('booking.again')}
                </button>
              </div>
            ) : (
              <form
                className="border border-[#1f1f1f] bg-[#0a0a0a] p-6 md:p-8"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (valid) setDone(true)
                }}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#9a9a9a]">
                      {t('booking.track')}
                    </span>
                    <select className="field" value={track} onChange={(e) => setTrack(e.target.value)}>
                      {TRACKS.map((tr) => (
                        <option key={tr.id} value={tr.id}>
                          {t(tr.nameKey)} — {tr.length}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#9a9a9a]">
                      {t('booking.date')}
                    </span>
                    <input
                      type="date"
                      className="field [color-scheme:dark]"
                      min={minDate}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value)
                        setSlot('')
                      }}
                    />
                  </label>
                </div>

                <div className="mt-6">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#9a9a9a]">
                    {t('booking.time')}
                  </span>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {SLOTS.map((s) => {
                      const off = date ? occupied.includes(s) : false
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setSlot(s)}
                          className={`slot ${slot === s ? 'on' : ''} ${off ? 'off' : ''}`}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#9a9a9a]">
                      {t('booking.tariff')}
                    </span>
                    <select className="field" value={tariff} onChange={(e) => setTariff(+e.target.value)}>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {t(`prices.p${n}.name` as never)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#9a9a9a]">
                      {t('booking.pilots')}: {pilots}
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={pilots}
                      onChange={(e) => setPilots(+e.target.value)}
                      className="mt-4 w-full accent-[#ff0000]"
                    />
                  </label>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#9a9a9a]">
                      {t('booking.name')}
                    </span>
                    <input
                      className="field"
                      placeholder={t('booking.ph.name')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#9a9a9a]">
                      {t('booking.phone')}
                    </span>
                    <input
                      className="field"
                      placeholder={t('booking.ph.phone')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!valid}
                  className={`btn-rush solid mt-8 w-full justify-center ${!valid ? 'pointer-events-none opacity-35' : ''}`}
                >
                  {t('booking.submit')} <span className="arrow">→</span>
                </button>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-[#666]">
                  {t('booking.demo')}
                </p>
              </form>
            )}
          </Reveal>

          {/* -------- side visual -------- */}
          <Reveal delay={0.2} className="relative min-h-[320px]">
            <div className="img-zoom sticky top-28 border border-[#1f1f1f]">
              <img src={IMAGES.kart} alt="Racing kart" className="w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 p-4 backdrop-blur-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9a9a9a]">
                  Sodi RT8 · 270 cm³
                </span>
                <span className="font-display text-xl text-[#ff0000]">80 км/ч</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <Marquee tag={t('marquee.tag')} text={lang === 'ru' ? 'До встречи на трассе' : 'See you on track'} red />
    </div>
  )
}
