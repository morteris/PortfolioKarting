/** The original KART RUSH catalogue. Relative asset URLs also work on GitHub Pages. */
export type Lang = 'ru' | 'en'
type Label = Record<Lang, string>
const label = (ru: string, en: string): Label => ({ ru, en })
export const REPOSITORY = 'https://github.com/morteris/PortfolioKarting'
export const IMAGES = { hero: 'images/hero.jpg', kart: 'images/kart.jpg' }
export const TRACKS = [
  {
    id: 'neon',
    code: 'NA–01',
    name: label('Неон Арена', 'Neon Arena'),
    type: label('Крытая', 'Indoor'),
    description: label(
      'Техничная крытая трасса с тесной шпилькой и профилированным виражом. Красный неон отмечает каждую смену траектории.',
      'A technical indoor circuit with a tight hairpin and a banked turn. Red neon lights mark each change of direction.',
    ),
    length: 520,
    turns: 11,
    img: 'images/track-indoor.jpg',
    outline:
      'M16 43Q7 38 12 30L24 14Q27 10 34 12L46 18Q51 21 55 17L63 10Q67 6 72 10L88 23Q94 28 88 34L80 42Q77 46 72 44L60 39Q56 38 52 42L46 48Q41 52 36 48L29 42Q26 39 22 42Q19 45 16 43Z',
  },
  {
    id: 'ring',
    code: 'AR–02',
    name: label('Асфальт Ринг', 'Asphalt Ring'),
    type: label('Открытая', 'Outdoor'),
    description: label(
      'Открытая трасса длиной больше километра. За прямой на 180 метров следует связка поворотов с разными радиусами.',
      'An outdoor circuit over a kilometre long. A 180-metre straight leads into a sequence of turns with changing radii.',
    ),
    length: 1100,
    turns: 14,
    img: 'images/track-outdoor.jpg',
    outline:
      'M16 43Q6 40 13 28L23 13Q26 9 33 11L82 20Q93 22 87 30L77 42Q72 48 66 43L58 35Q55 32 51 36L43 43Q38 47 33 42L29 38Q26 35 22 40Q19 44 16 43Z',
  },
  {
    id: 'drift',
    code: 'DP–03',
    name: label('Дрифт Паддок', 'Drift Paddock'),
    type: label('Дрифт', 'Drift'),
    description: label(
      'Полигон со специальным покрытием для управляемого заноса. Короткие перекладки чередуются с длинными дугами.',
      'A low-grip playground for controlled slides. Quick changes of direction alternate with long sweeping arcs.',
    ),
    length: 640,
    turns: 9,
    img: 'images/track-drift.jpg',
    outline:
      'M16 43Q9 39 14 29L22 16Q26 10 33 14L42 20Q47 24 53 18L61 11Q66 7 72 11L87 24Q93 30 85 36L73 46Q67 50 61 44L55 38Q51 34 46 40L40 46Q35 51 30 45L25 40Q22 37 20 42Q18 45 16 43Z',
  },
] as const
export type Track = (typeof TRACKS)[number]
export type TrackId = Track['id']
export const PLANS = [
  {
    id: 'sprint',
    name: label('Спринт', 'Sprint'),
    minutes: 10,
    price: 1500,
    group: false,
    description: label(
      'Короткая сессия для знакомства с трассой.',
      'A short session to learn the racing line.',
    ),
  },
  {
    id: 'race',
    name: label('Гонка', 'Race'),
    minutes: 30,
    price: 3900,
    group: false,
    description: label(
      'Полчаса на трассе, чтобы найти ритм и улучшить свой круг.',
      'Half an hour on track to find your rhythm and improve your lap.',
    ),
  },
  {
    id: 'gp',
    name: label('Гран-при', 'Grand Prix'),
    minutes: 60,
    price: 7200,
    group: false,
    description: label(
      'Квалификация и гонка в рамках часовой сессии.',
      'Qualifying and a race in one hour-long session.',
    ),
  },
  {
    id: 'team',
    name: label('Корпоратив', 'Team event'),
    minutes: 120,
    price: 95000,
    group: true,
    description: label(
      'Вся трасса на два часа для команды до 40 пилотов.',
      'The entire circuit for two hours, for groups of up to 40 drivers.',
    ),
  },
] as const
export type PlanId = (typeof PLANS)[number]['id']
export const trackById = (id?: string | null) => TRACKS.find((t) => t.id === id) ?? TRACKS[0]
export const planById = (id?: string | null) => PLANS.find((p) => p.id === id) ?? PLANS[1]
export const money = (value: number, lang: Lang) =>
  new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
export const dateText = (value: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T12:00:00Z`))
