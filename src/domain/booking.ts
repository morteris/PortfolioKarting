import { PLANS, TRACKS, planById } from '../data'
import type { PlanId, TrackId } from '../data'

// Deliberately public demo fixtures, NOT real users or a security boundary.
export const ACCOUNTS = {
  pilot: { email: 'pilot@kart.test', password: 'Pilot2026', role: 'pilot' },
  admin: { email: 'admin@kart.test', password: 'Admin2026', role: 'admin' },
} as const
export type Role = keyof typeof ACCOUNTS
export const ROLES = ['pilot', 'admin'] as const
export const STATUSES = ['pending', 'confirmed', 'cancelled'] as const
export type Status = (typeof STATUSES)[number]
export const SLOTS = [
  '10:00',
  '11:30',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
  '19:00',
  '20:30',
  '22:00',
] as const
export type Draft = { track: TrackId; plan: PlanId; date: string; slot: string; pilots: number }
export type Booking = Draft & {
  id: string
  owner: Role
  status: Status
  amount: number
  createdAt: string
}
export type ErrorCode =
  | 'storage'
  | 'corrupt'
  | 'auth'
  | 'credentials'
  | 'invalid'
  | 'occupied'
  | 'transition'
export class DemoError extends Error {
  readonly code: ErrorCode
  constructor(code: ErrorCode) {
    super(code)
    this.code = code
  }
}
export const dateInMoscow = (now = Date.now(), offsetDays = 0) =>
  new Date(now + 3 * 3600000 + offsetDays * 86400000).toISOString().slice(0, 10)
export function validDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const d = new Date(`${date}T12:00:00Z`)
  return !Number.isNaN(d.valueOf()) && d.toISOString().startsWith(date)
}
export const startTime = (b: Pick<Draft, 'date' | 'slot'>) =>
  Date.parse(`${b.date}T${b.slot}:00+03:00`)
const endTime = (b: Pick<Draft, 'date' | 'slot' | 'plan'>) =>
  startTime(b) + planById(b.plan).minutes * 60000
export const maxPilots = (plan: PlanId) => (planById(plan).group ? 40 : 20)
export const priceOf = (b: Pick<Draft, 'plan' | 'pilots'>) =>
  planById(b.plan).price * (planById(b.plan).group ? 1 : b.pilots)
export function checkDraft(
  draft: Draft,
  bookings: readonly Booking[],
  now = Date.now(),
): ErrorCode | null {
  if (
    !TRACKS.some((t) => t.id === draft.track) ||
    !PLANS.some((p) => p.id === draft.plan) ||
    !validDate(draft.date) ||
    !SLOTS.some((s) => s === draft.slot) ||
    startTime(draft) <= now ||
    draft.date > dateInMoscow(now, 90) ||
    !Number.isInteger(draft.pilots) ||
    draft.pilots < 1 ||
    draft.pilots > maxPilots(draft.plan) ||
    endTime(draft) > Date.parse(`${draft.date}T23:00:00+03:00`)
  )
    return 'invalid'
  return bookings.some(
    (b) =>
      b.status !== 'cancelled' &&
      b.track === draft.track &&
      b.date === draft.date &&
      startTime(b) < endTime(draft) &&
      startTime(draft) < endTime(b),
  )
    ? 'occupied'
    : null
}
export const canChange = (
  actor: Role,
  booking: Booking,
  next: Exclude<Status, 'pending'>,
  now = Date.now(),
) =>
  startTime(booking) > now &&
  booking.status !== 'cancelled' &&
  (next === 'confirmed'
    ? actor === 'admin' && booking.status === 'pending'
    : next === 'cancelled' && (actor === 'admin' || actor === booking.owner))

function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== 'object') return false
  const b = value as Partial<Booking>
  return (
    typeof b.id === 'string' &&
    b.id.length > 0 &&
    ROLES.some((v) => v === b.owner) &&
    STATUSES.some((v) => v === b.status) &&
    TRACKS.some((t) => t.id === b.track) &&
    PLANS.some((p) => p.id === b.plan) &&
    typeof b.date === 'string' &&
    validDate(b.date) &&
    SLOTS.some((s) => s === b.slot) &&
    Number.isInteger(b.pilots) &&
    b.pilots! >= 1 &&
    b.pilots! <= maxPilots(b.plan!) &&
    Number.isSafeInteger(b.amount) &&
    b.amount! >= 0 &&
    typeof b.createdAt === 'string'
  )
}
export function decodeBookings(raw: string | null): Booking[] {
  if (raw === null) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every(isBooking)) return parsed
  } catch {
    /* Never overwrite a corrupted collection with an empty one. */
  }
  throw new DemoError('corrupt')
}
