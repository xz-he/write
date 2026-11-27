import {
  DEFAULT_ENTRIES,
  DEFAULT_META,
  type BookMeta,
  type MemoryEntry,
} from './entries'

export const STORAGE_KEY = 'chengzhang-shouce-v2'
export const ADMIN_SESSION_KEY = 'chengzhang-shouce-admin'
/** v1 admin password — change in AdminPanel if needed */
export const ADMIN_PASSWORD = 'anbao2026'

export type HandbookState = {
  meta: BookMeta
  entries: MemoryEntry[]
  version: number
}

export function defaultHandbook(): HandbookState {
  return {
    meta: { ...DEFAULT_META },
    entries: DEFAULT_ENTRIES.map((e) => ({ ...e })),
    version: 2,
  }
}

export function loadHandbook(): HandbookState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultHandbook()
    const parsed = JSON.parse(raw) as Partial<HandbookState>
    if (!parsed || !Array.isArray(parsed.entries) || !parsed.meta) {
      return defaultHandbook()
    }
    return {
      version: 2,
      meta: { ...DEFAULT_META, ...parsed.meta },
      entries: parsed.entries.map((e) => ({ ...e })),
    }
  } catch {
    return defaultHandbook()
  }
}

export function saveHandbook(state: HandbookState): void {
  const payload: HandbookState = {
    version: 2,
    meta: { ...state.meta },
    entries: state.entries.map((e) => ({ ...e })),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearHandbookStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isAdminSession(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function setAdminSession(on: boolean): void {
  try {
    if (on) sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
    else sessionStorage.removeItem(ADMIN_SESSION_KEY)
  } catch {
    /* ignore */
  }
}
