import { useSyncExternalStore } from 'react'
import type { Lang } from '../data'

// Side-by-side translations keep each route and every form state available in both languages.
const messages = {
  author: ['Питернев И.', 'I. Piternev'],
  home: ['Портфолио', 'Portfolio'],
  tracks: ['Трассы', 'Circuits'],
  prices: ['Тарифы', 'Pricing'],
  about: ['О проекте', 'About the project'],
  booking: ['Бронирование', 'Booking'],
  account: ['Кабинет', 'Account'],
  login: ['Войти', 'Sign in'],
  logout: ['Выйти', 'Sign out'],
  menu: ['Меню', 'Menu'],
  close: ['Закрыть', 'Close'],
  skip: ['К содержимому', 'Skip to content'],
  repo: ['Исходный код', 'Source code'],
  back: ['На главную', 'Back to portfolio'],
  portfolio: ['Портфолио разработчика', 'Developer portfolio'],
  project01: ['Проект / 01', 'Project / 01'],
  heroLead: ['Платформа бронирования картинга', 'A karting booking platform'],
  heroBody: [
    'Я Питернев И., фронтенд-разработчик. Здесь можно выбрать трассу, записаться на заезд и проследить путь заявки до подтверждения.',
    'I’m I. Piternev, a frontend developer. Pick a circuit, book a session and follow your request all the way to confirmation.',
  ],
  book: ['Выбрать заезд', 'Book a session'],
  demo: ['Демо', 'Demo'],
  camera: ['Камера трассы', 'Track camera'],
  technology: ['Стек проекта', 'Project stack'],
  format: ['Формат', 'Format'],
  webapp: ['Веб-приложение', 'Web application'],
  roles: ['Роли в демо', 'Demo roles'],
  bothRoles: ['Пилот / Админ', 'Driver / Admin'],
  catalogKicker: ['Демо-каталог', 'Demo catalogue'],
  circuitsHeading: ['Каталог трасс', 'Circuit catalogue'],
  allTracks: ['Все трассы', 'All circuits'],
  catalogText: [
    'Три картодрома с разным характером. Выберите трассу для демозаезда.',
    'Three circuits with distinct personalities. Pick one for your demo session.',
  ],
  meters: ['м', 'm'],
  turns: ['Повороты', 'Turns'],
  length: ['Длина', 'Length'],
  pickTrack: ['Выбрать трассу', 'Book this circuit'],
  all: ['Все', 'All'],
  flowKicker: ['Маршрут заявки', 'Booking flow'],
  flowHeading: ['Как проверить проект', 'Try the whole workflow'],
  step1: ['Войти как пилот', 'Sign in as a driver'],
  step1Text: [
    'Используйте тестовый аккаунт из блока ниже. Регистрация не нужна.',
    'Use the test driver account below. No registration required.',
  ],
  step2: ['Забронировать заезд', 'Book a session'],
  step2Text: [
    'Выберите трассу, тариф и свободное время. Заявка сразу появится в кабинете.',
    'Choose a circuit, a plan and an available time. The request appears in your account.',
  ],
  step3: ['Подтвердить заявку', 'Confirm the request'],
  step3Text: [
    'Войдите как администратор и измените статус. Пилот увидит обновление в своей брони.',
    'Sign in as an administrator and change the status. The driver will see the update in their booking.',
  ],
  demoAccess: ['Демо-доступ', 'Demo access'],
  footerInfo: [
    'Два аккаунта для проверки проекта. Брони сохраняются только в этом браузере, без оплаты и реальной записи на трассу.',
    'Two accounts to try the project. Bookings stay in this browser. No payments or real sessions.',
  ],
  pilot: ['Тестовый пилот', 'Test driver'],
  admin: ['Администратор', 'Administrator'],
  password: ['Пароль', 'Password'],
  email: ['Email', 'Email'],
  asPilot: ['Войти как пилот', 'Sign in as driver'],
  asAdmin: ['Войти как админ', 'Sign in as admin'],
  footerLine: ['Портфолио разработчика', 'Developer portfolio'],
  plansKicker: ['Стоимость заезда', 'Session rates'],
  plansHeading: ['Тарифы заездов', 'Session plans'],
  plansText: [
    'Цены из демо-каталога. В форме бронирования сумма пересчитается для выбранного числа пилотов.',
    'Demo catalogue prices. Your quote updates with the selected number of drivers.',
  ],
  perDriver: ['за пилота', 'per driver'],
  perEvent: ['за мероприятие', 'per event'],
  minutes: ['мин', 'min'],
  selectPlan: ['Выбрать тариф', 'Choose plan'],
  authorKicker: ['Автор и реализация', 'Author and implementation'],
  aboutHeading: ['О проекте KART RUSH', 'About KART RUSH'],
  aboutIntro: [
    'KART RUSH — работа в моём портфолио фронтенд-разработчика. За гоночным интерфейсом — два связанных кабинета и одна заявка, которую можно провести от создания до подтверждения.',
    'KART RUSH is a project in my frontend portfolio. Behind the racing interface are two connected accounts and one booking that you can take from request to confirmation.',
  ],
  built: ['Что реализовано', 'What’s inside'],
  brief1: ['Каталог и расписание', 'Circuits and availability'],
  brief1Text: [
    'Выбор трассы и тарифа переносится в форму. При расчёте свободного времени учитываются длительность заезда и уже занятые слоты.',
    'Circuit and plan selections carry into the form. Availability accounts for the session duration and existing bookings.',
  ],
  brief2: ['Кабинеты двух ролей', 'Two account roles'],
  brief2Text: [
    'Пилот видит свои заезды. Администратор видит все заявки этого браузера, подтверждает или отменяет их.',
    'Drivers see their own sessions. The administrator sees every request in this browser and can confirm or cancel it.',
  ],
  brief3: ['Доступный интерфейс', 'Accessible interface'],
  brief3Text: [
    'Русский и английский языки, управление с клавиатуры и поддержка системной настройки уменьшения движения.',
    'Russian and English, keyboard navigation and support for reduced motion preferences.',
  ],
  openProject: ['Открыть репозиторий', 'Open repository'],
  loginKicker: ['Доступ к проекту', 'Project access'],
  loginHeading: ['Вход в кабинет', 'Account sign-in'],
  loginText: [
    'Используйте демонстрационный аккаунт. Личные данные не нужны.',
    'Use a demo account. No personal information required.',
  ],
  fill: ['Подставить демоданные', 'Fill demo credentials'],
  rolePilot: ['Пилот', 'Driver'],
  roleAdmin: ['Админ', 'Admin'],
  showPass: ['Показать пароль', 'Show password'],
  hidePass: ['Скрыть пароль', 'Hide password'],
  signSubmit: ['Войти в кабинет', 'Sign in to account'],
  continueBooking: ['Вернуться к бронированию', 'Continue booking'],
  keepDraft: [
    'Выбранные параметры заезда сохранятся после входа.',
    'Your selected session details will be kept after sign-in.',
  ],
  localMode: ['Локальный деморежим', 'Local demo mode'],
  localDesc: [
    'Можно по очереди войти под обеими ролями в одном браузере. Реальной брони и списаний не будет.',
    'Try both roles in the same browser. No actual reservations or charges are made.',
  ],
  reserveKicker: ['Пит-лейн / Запись', 'Pit lane / Reservations'],
  reserveHeading: ['Бронирование заезда', 'Book a session'],
  reserveText: [
    'Соберите свой заезд. Время старта указано по Москве (UTC+3).',
    'Build your session. Start times are in Moscow time (UTC+3).',
  ],
  params: ['Параметры заезда', 'Session setup'],
  track: ['Трасса', 'Circuit'],
  plan: ['Тариф', 'Plan'],
  date: ['Дата заезда', 'Session date'],
  time: ['Время старта', 'Start time'],
  pilots: ['Число пилотов', 'Drivers'],
  slotHint: [
    'Недоступное время отмечено зачёркиванием.',
    'Unavailable start times are crossed out.',
  ],
  noSlots: [
    'На эту дату свободного времени нет. Выберите другой день или тариф.',
    'No times available for this date. Choose a different day or plan.',
  ],
  create: ['Оформить демобронь', 'Create demo booking'],
  guestBook: ['Войти и продолжить', 'Sign in to continue'],
  pickTime: ['Выберите время старта', 'Select a start time'],
  quote: ['Ваш заезд', 'Your session'],
  estimate: ['Расчётная сумма', 'Estimated total'],
  noPayment: ['Демо · без оплаты', 'Demo · no payment'],
  duration: ['Длительность', 'Duration'],
  loggedAs: ['Вы вошли как', 'Signed in as'],
  busy: ['Сохраняем…', 'Saving…'],
  profileKicker: ['Профиль пилота', 'Driver profile'],
  adminKicker: ['Панель администратора', 'Administrator panel'],
  myBookings: ['Мои брони', 'My bookings'],
  allBookings: ['Управление заявками', 'Booking management'],
  history: ['Список заездов', 'Session list'],
  incoming: ['Заявки пилотов', 'Booking requests'],
  pending: ['На рассмотрении', 'Pending'],
  confirmed: ['Подтверждена', 'Confirmed'],
  cancelled: ['Отменена', 'Cancelled'],
  countAll: ['Всего заявок', 'Total requests'],
  countPending: ['Ожидают решения', 'Awaiting review'],
  countConfirmed: ['Подтверждены', 'Confirmed'],
  empty: ['Броней пока нет', 'No bookings yet'],
  emptyPilot: [
    'Выберите трассу и время — здесь появится ваш первый заезд.',
    'Pick a circuit and a time. Your first session will appear here.',
  ],
  emptyAdmin: [
    'Создайте демобронь под аккаунтом пилота в этом браузере — она появится здесь.',
    'Create a demo booking from the driver account in this browser. It will appear here.',
  ],
  emptyFilter: ['Заявок с таким статусом нет', 'No bookings with this status'],
  resetFilter: ['Показать все', 'Show all'],
  newBooking: ['Новая бронь', 'New booking'],
  created: ['Бронь создана и отправлена на рассмотрение.', 'Booking created and awaiting review.'],
  updated: ['Статус заявки обновлён.', 'The booking status has been updated.'],
  confirm: ['Подтвердить', 'Confirm'],
  cancel: ['Отменить бронь', 'Cancel booking'],
  askCancel: ['Отменить бронь и освободить слот?', 'Cancel this booking and release the slot?'],
  cancelYes: ['Да, отменить', 'Yes, cancel'],
  cancelNo: ['Оставить', 'Keep booking'],
  owner: ['Аккаунт', 'Account'],
  cost: ['Стоимость', 'Total'],
  filters: ['Фильтр по статусу', 'Filter by status'],
  newSession: ['Начать с бронирования', 'Start with a booking'],
  storage: [
    'Хранилище браузера недоступно. Разрешите сохранение данных или откройте демо в отдельной вкладке.',
    'Browser storage is unavailable. Allow site storage or open the demo in a separate tab.',
  ],
  corrupt: [
    'Не удалось прочитать локальные заявки. Данные не перезаписаны. Для чистого демо откройте приватное окно.',
    'Local bookings could not be read and have not been overwritten. Open a private window for a fresh demo.',
  ],
  auth: ['Сначала войдите в демоаккаунт.', 'Please sign in to a demo account first.'],
  credentials: [
    'Email или пароль не совпадают. Попробуйте один из демоаккаунтов ниже.',
    'Email or password is incorrect. Try one of the demo accounts below.',
  ],
  invalid: [
    'Проверьте дату, время и число пилотов. Запись доступна на 90 дней вперёд с 10:00 до 23:00 МСК.',
    'Check the date, start time and driver count. Sessions run 10:00–23:00 Moscow time, up to 90 days ahead.',
  ],
  occupied: [
    'Этот интервал уже занят. Выберите другое время.',
    'That time interval is already reserved. Pick another start time.',
  ],
  transition: [
    'Статус нельзя изменить. Проверьте текущее состояние заявки и время старта.',
    'This change is not available. Check the current booking status and start time.',
  ],
  notFound: ['Страница не найдена', 'Page not found'],
} as const
export type Message = keyof typeof messages
const listeners = new Set<() => void>()
let fallback: Lang = 'ru'
function readLang(): Lang {
  try {
    const stored = localStorage.getItem('kartrush:lang:v1')
    return stored === 'en' || stored === 'ru' ? stored : fallback
  } catch {
    return fallback
  }
}
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}
export function useLang() {
  const lang = useSyncExternalStore(subscribe, readLang, () => 'ru' as Lang)
  const toggle = () => {
    fallback = lang === 'ru' ? 'en' : 'ru'
    try {
      localStorage.setItem('kartrush:lang:v1', fallback)
    } catch {
      /* Still works for this tab. */
    }
    listeners.forEach((fn) => fn())
  }
  return { lang, t: (k: Message) => messages[k][lang === 'ru' ? 0 : 1], toggle }
}
