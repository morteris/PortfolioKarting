import { test, expect } from '@playwright/test'
import {
  canChange,
  checkDraft,
  dateInMoscow,
  decodeBookings,
  priceOf,
  validDate,
} from '../src/domain/booking'
import type { Draft, Booking } from '../src/domain/booking'

const now = Date.parse('2026-11-18T09:00:00+03:00')
const draft: Draft = { track: 'neon', plan: 'race', pilots: 2, date: '2026-11-19', slot: '13:00' }
const saved: Booking = {
  ...draft,
  id: 'sample',
  owner: 'pilot',
  status: 'pending',
  amount: 7800,
  createdAt: new Date(now).toISOString(),
}

test('per-driver rates scale; whole-track hire is a flat rate', () => {
  expect(priceOf(draft)).toBe(7800)
  expect(priceOf({ plan: 'team', pilots: 40 })).toBe(95000)
})
test('Moscow midnight and calendar dates are independent of browser timezone', () => {
  expect(dateInMoscow(Date.parse('2026-12-31T21:05:00Z'))).toBe('2027-01-01')
  expect(validDate('2027-02-29')).toBe(false)
  expect(validDate('2028-02-29')).toBe(true)
})
test('rejects past slots, dates over 90 days out, unknown times and invalid driver counts', () => {
  for (const bad of [
    { date: '2026-11-17' },
    { date: '2027-11-19' },
    { pilots: 0 },
    { pilots: 1.5 },
    { pilots: 21 },
    { slot: '03:00' },
  ])
    expect(checkDraft({ ...draft, ...bad }, [], now)).toBe('invalid')
  expect(checkDraft(draft, [], now)).toBeNull()
  expect(checkDraft({ ...draft, plan: 'team', pilots: 40 }, [], now)).toBeNull()
})
test('checks interval overlap on the same circuit, not just identical start times', () => {
  expect(checkDraft({ ...draft, plan: 'team', slot: '11:30' }, [saved], now)).toBe('occupied')
  expect(checkDraft({ ...draft, slot: '11:30' }, [saved], now)).toBeNull()
  expect(checkDraft({ ...draft, track: 'ring' }, [saved], now)).toBeNull()
  expect(checkDraft(draft, [{ ...saved, status: 'confirmed' }], now)).toBe('occupied')
  expect(checkDraft(draft, [{ ...saved, status: 'cancelled' }], now)).toBeNull()
})
test('session must finish before circuit closing time', () => {
  expect(checkDraft({ ...draft, plan: 'team', slot: '22:00' }, [], now)).toBe('invalid')
  expect(checkDraft({ ...draft, plan: 'gp', slot: '22:00' }, [], now)).toBeNull()
})
test('only admin can confirm; owner or admin may cancel; cancelled and past are terminal', () => {
  expect(canChange('pilot', saved, 'confirmed', now)).toBe(false)
  expect(canChange('admin', saved, 'confirmed', now)).toBe(true)
  expect(canChange('pilot', { ...saved, owner: 'admin' }, 'cancelled', now)).toBe(false)
  expect(canChange('pilot', saved, 'cancelled', now)).toBe(true)
  expect(canChange('admin', { ...saved, status: 'cancelled' }, 'confirmed', now)).toBe(false)
  expect(canChange('admin', { ...saved, status: 'confirmed' }, 'confirmed', now)).toBe(false)
  expect(canChange('admin', saved, 'confirmed', now + 3 * 86400000)).toBe(false)
})
test('stored records are validated without replacing corrupt data', () => {
  expect(decodeBookings(null)).toEqual([])
  expect(decodeBookings(JSON.stringify([saved]))).toEqual([saved])
  expect(() => decodeBookings('{oops')).toThrow('corrupt')
  expect(() => decodeBookings('[{"date":"abc"}]')).toThrow('corrupt')
})
