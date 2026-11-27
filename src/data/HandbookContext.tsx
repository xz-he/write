import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  computeWordCount,
  createBlankEntry,
  type BookMeta,
  type MemoryEntry,
} from './entries'
import {
  clearHandbookStorage,
  defaultHandbook,
  loadHandbook,
  saveHandbook,
  type HandbookState,
} from './handbookStore'

type HandbookContextValue = {
  meta: BookMeta
  entries: MemoryEntry[]
  wordCount: number
  years: number[]
  updateMeta: (patch: Partial<BookMeta>) => void
  updateEntry: (id: string, patch: Partial<MemoryEntry>) => void
  addEntry: (afterId?: string) => void
  deleteEntry: (id: string) => void
  moveEntry: (id: string, direction: -1 | 1) => void
  reorderEntries: (next: MemoryEntry[]) => void
  resetToDefaults: () => void
  persist: () => void
}

const HandbookContext = createContext<HandbookContextValue | null>(null)

function persistState(state: HandbookState) {
  saveHandbook(state)
}

export function HandbookProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HandbookState>(() => loadHandbook())

  const commit = useCallback((updater: (prev: HandbookState) => HandbookState) => {
    setState((prev) => {
      const next = updater(prev)
      persistState(next)
      return next
    })
  }, [])

  const updateMeta = useCallback(
    (patch: Partial<BookMeta>) => {
      commit((prev) => ({ ...prev, meta: { ...prev.meta, ...patch } }))
    },
    [commit],
  )

  const updateEntry = useCallback(
    (id: string, patch: Partial<MemoryEntry>) => {
      commit((prev) => ({
        ...prev,
        entries: prev.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      }))
    },
    [commit],
  )

  const addEntry = useCallback(
    (afterId?: string) => {
      commit((prev) => {
        const blank = createBlankEntry(
          prev.entries[prev.entries.length - 1]?.year ?? new Date().getFullYear(),
        )
        if (!afterId) {
          return { ...prev, entries: [...prev.entries, blank] }
        }
        const idx = prev.entries.findIndex((e) => e.id === afterId)
        if (idx < 0) return { ...prev, entries: [...prev.entries, blank] }
        const entries = [...prev.entries]
        entries.splice(idx + 1, 0, blank)
        return { ...prev, entries }
      })
    },
    [commit],
  )

  const deleteEntry = useCallback(
    (id: string) => {
      commit((prev) => {
        if (prev.entries.length <= 1) return prev
        return { ...prev, entries: prev.entries.filter((e) => e.id !== id) }
      })
    },
    [commit],
  )

  const moveEntry = useCallback(
    (id: string, direction: -1 | 1) => {
      commit((prev) => {
        const idx = prev.entries.findIndex((e) => e.id === id)
        if (idx < 0) return prev
        const target = idx + direction
        if (target < 0 || target >= prev.entries.length) return prev
        const entries = [...prev.entries]
        const [item] = entries.splice(idx, 1)
        entries.splice(target, 0, item!)
        return { ...prev, entries }
      })
    },
    [commit],
  )

  const reorderEntries = useCallback(
    (next: MemoryEntry[]) => {
      commit((prev) => ({ ...prev, entries: next.map((e) => ({ ...e })) }))
    },
    [commit],
  )

  const resetToDefaults = useCallback(() => {
    clearHandbookStorage()
    const fresh = defaultHandbook()
    setState(fresh)
    persistState(fresh)
  }, [])

  const persist = useCallback(() => {
    persistState(state)
  }, [state])

  const years = useMemo(() => {
    const set = new Set(state.entries.map((e) => e.year))
    return [...set].sort((a, b) => a - b)
  }, [state.entries])

  const value = useMemo<HandbookContextValue>(
    () => ({
      meta: state.meta,
      entries: state.entries,
      wordCount: computeWordCount(state.entries, state.meta),
      years,
      updateMeta,
      updateEntry,
      addEntry,
      deleteEntry,
      moveEntry,
      reorderEntries,
      resetToDefaults,
      persist,
    }),
    [
      state.meta,
      state.entries,
      years,
      updateMeta,
      updateEntry,
      addEntry,
      deleteEntry,
      moveEntry,
      reorderEntries,
      resetToDefaults,
      persist,
    ],
  )

  return <HandbookContext.Provider value={value}>{children}</HandbookContext.Provider>
}

export function useHandbook(): HandbookContextValue {
  const ctx = useContext(HandbookContext)
  if (!ctx) throw new Error('useHandbook must be used within HandbookProvider')
  return ctx
}
