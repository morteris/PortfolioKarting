import { useSyncExternalStore } from 'react'
import { DemoError } from '../domain/booking'

/** Stable primitive snapshots; notify both this tab and other same-origin tabs. */
export function storageCell(kind: 'localStorage' | 'sessionStorage', key: string) {
  const event = `kart:update:${key}`
  const read = () => {
    try {
      return window[kind].getItem(key)
    } catch {
      return null
    }
  }
  const write = (value: string | null) => {
    try {
      if (value === null) window[kind].removeItem(key)
      else window[kind].setItem(key, value)
    } catch {
      throw new DemoError('storage')
    }
    window.dispatchEvent(new Event(event))
  }
  const subscribe = (notify: () => void) => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === key) notify()
    }
    window.addEventListener(event, notify)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(event, notify)
      window.removeEventListener('storage', onStorage)
    }
  }
  const useValue = () => useSyncExternalStore(subscribe, read, () => null)
  return { read, write, useValue }
}
