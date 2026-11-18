import { useMemo } from 'react'
import {
  ACCOUNTS,
  ROLES,
  DemoError,
  canChange,
  checkDraft,
  decodeBookings,
  priceOf,
} from '../domain/booking'
import type { Draft, Booking, Role, Status } from '../domain/booking'
import { storageCell } from '../lib/storage'

const session = storageCell('sessionStorage', 'kartrush:session:v1')
const records = storageCell('localStorage', 'kartrush:bookings:v1')
const roleOf = (value: string | null) => ROLES.find((r) => r === value) ?? null
export const useRole = () => roleOf(session.useValue())
export function signIn(email: string, password: string) {
  const role = ROLES.find(
    (r) => ACCOUNTS[r].email === email.trim().toLowerCase() && ACCOUNTS[r].password === password,
  )
  if (!role) throw new DemoError('credentials')
  session.write(role)
  return role
}
export const signOut = () => session.write(null)
export function useRecords() {
  const raw = records.useValue()
  return useMemo(() => {
    try {
      return { bookings: decodeBookings(raw), corrupt: false }
    } catch {
      return { bookings: [] as Booking[], corrupt: true }
    }
  }, [raw])
}
// Re-read under the same origin's Web Lock before checking availability or changing status.
// On browsers without Web Locks, the synchronous path still re-checks the latest snapshot.
async function transaction<T>(change: (list: Booking[], who: Role) => T): Promise<T> {
  const commit = () => {
    const who = roleOf(session.read())
    if (!who) throw new DemoError('auth')
    const list = decodeBookings(records.read())
    const result = change(list, who)
    records.write(JSON.stringify(list))
    return result
  }
  return navigator.locks ? navigator.locks.request('kartrush:bookings:v1', commit) : commit()
}
export const createBooking = (draft: Draft) =>
  transaction((list, who) => {
    const problem = checkDraft(draft, list)
    if (problem) throw new DemoError(problem)
    const id = Array.from(crypto.getRandomValues(new Uint8Array(12)), (n) =>
      n.toString(16).padStart(2, '0'),
    ).join('')
    const booking: Booking = {
      ...draft,
      id,
      owner: who,
      status: 'pending',
      amount: priceOf(draft),
      createdAt: new Date().toISOString(),
    }
    list.unshift(booking)
    return booking
  })
export const changeStatus = (id: string, next: Exclude<Status, 'pending'>) =>
  transaction((list, who) => {
    const booking = list.find((b) => b.id === id)
    if (!booking || !canChange(who, booking, next)) throw new DemoError('transition')
    booking.status = next
  })
export const displayId = (id: string) => `KR-${id.slice(0, 6).toUpperCase()}`
