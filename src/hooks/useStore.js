import { create } from 'zustand'

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

const DEFAULT_SETTINGS = {
  childName: '',
  parentName: '',
  soundEnabled: true,
  vibrationEnabled: true,
  voiceEnabled: true,
  activeMode: 'child',
}

export const useStore = create((set, get) => ({
  // ── UI state ──────────────────────────────────────
  activeMode: load('fb_settings', DEFAULT_SETTINGS).activeMode ?? 'child',
  view: 'home',          // 'home' | 'sent' | 'history' | 'settings' | 'parent'
  activePage: 0,         // which page (0-3) child is on

  // ── Data ──────────────────────────────────────────
  history: load('fb_history', []),
  settings: load('fb_settings', DEFAULT_SETTINGS),

  // ── Actions ───────────────────────────────────────
  setMode: (mode) => {
    const settings = { ...get().settings, activeMode: mode }
    save('fb_settings', settings)
    set({ activeMode: mode, settings, view: 'home' })
  },

  setView: (view) => set({ view }),
  setPage: (activePage) => set({ activePage }),

  sendCard: (card) => {
    const entry = {
      id: Date.now(),
      card,
      timestamp: new Date().toISOString(),
      read: false,
    }
    const history = [entry, ...get().history].slice(0, 200)
    save('fb_history', history)
    set({ history, view: 'sent', lastSent: entry })
  },

  markAllRead: () => {
    const history = get().history.map(h => ({ ...h, read: true }))
    save('fb_history', history)
    set({ history })
  },

  clearHistory: () => {
    save('fb_history', [])
    set({ history: [] })
  },

  updateSettings: (updates) => {
    const settings = { ...get().settings, ...updates }
    save('fb_settings', settings)
    set({ settings })
  },

  goHome: () => set({ view: 'home', activePage: 0 }),

  unreadCount: () => get().history.filter(h => !h.read).length,
}))
