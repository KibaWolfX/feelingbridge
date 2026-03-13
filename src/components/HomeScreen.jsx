import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../hooks/useStore.js'
import { PAGES } from '../data/emotions.js'
import { playSound, vibrate, speak } from '../utils/sounds.js'

export function HomeScreen() {
  const { activePage, setPage, sendCard, setView, settings, history } = useStore()
  const { soundEnabled, vibrationEnabled, voiceEnabled, childName } = settings
  const unread = history.filter(h => !h.read).length

  const page = PAGES[activePage]

  const handleCard = (card) => {
    // Play the emotion-specific sound
    playSound(card.id, soundEnabled)
    vibrate([40, 20, 60], vibrationEnabled)
    // Speak the card voice label aloud
    speak(card.voice, voiceEnabled)
    // Send to parent
    sendCard(card)
  }

  const goLeft  = () => { if (activePage > 0) { playSound('back', soundEnabled); setPage(activePage - 1) } }
  const goRight = () => { if (activePage < PAGES.length - 1) { playSound('tap', soundEnabled); setPage(activePage + 1) } }

  return (
    <div className="screen" style={{ background: page.bgColor, transition: 'background 0.4s' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px 6px', flexShrink: 0,
      }}>
        <div>
          <div className="t-small">Hello {childName ? `${childName}!` : '!'}</div>
          <div className="t-title">{page.pageEmoji} {page.pageTitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* History / parent alert */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-icon"
              onClick={() => { playSound('back', soundEnabled); setView('history') }}
              aria-label="View history"
            >
              📖
            </button>
          </div>
          <button
            className="btn-icon"
            onClick={() => { playSound('back', soundEnabled); setView('settings') }}
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Page dots + nav */}
      <div className="page-nav">
        <button className="page-nav-btn" onClick={goLeft} disabled={activePage === 0} aria-label="Previous page">
          ‹
        </button>

        <div className="page-title-area">
          <div className="page-dots" role="tablist" aria-label="Emotion categories">
            {PAGES.map((p, i) => (
              <button
                key={p.id}
                className={`page-dot ${i === activePage ? 'active' : ''}`}
                onClick={() => { playSound('tap', soundEnabled); setPage(i) }}
                role="tab"
                aria-selected={i === activePage}
                aria-label={p.pageTitle}
                style={{ background: i === activePage ? '#333' : undefined }}
              />
            ))}
          </div>
          <div className="t-small" style={{ textAlign: 'center' }}>
            {activePage + 1} of {PAGES.length}
          </div>
        </div>

        <button className="page-nav-btn" onClick={goRight} disabled={activePage === PAGES.length - 1} aria-label="Next page">
          ›
        </button>
      </div>

      {/* Emotion card grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          className="card-grid scroll"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          style={{ flex: 1 }}
        >
          {page.cards.map((card, i) => (
            <motion.button
              key={card.id}
              className="emotion-card"
              style={{ backgroundColor: card.bg, borderColor: card.border }}
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26, delay: i * 0.045 }}
              onClick={() => handleCard(card)}
              aria-label={`${card.label}: ${card.voice}`}
            >
              <span className="emoji" role="img" aria-hidden="true">{card.emoji}</span>
              <span className="card-label" style={{ color: card.text }}>{card.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Tab bar */}
      <TabBar />
    </div>
  )
}

export function TabBar() {
  const { view, setView, activeMode, setMode, settings, history } = useStore()
  const { soundEnabled, vibrationEnabled } = settings
  const unread = history.filter(h => !h.read).length

  const tabs = [
    { id: 'home',   icon: '🏠',  label: 'Home',    action: () => useStore.getState().goHome() },
    { id: 'history',icon: '📖',  label: 'History', action: () => setView('history') },
    { id: 'parent', icon: '👨‍👩‍👦', label: 'Parent',  action: () => setMode('parent'), badge: unread },
    { id: 'settings',icon: '⚙️', label: 'Settings',action: () => setView('settings') },
  ]

  return (
    <nav className="tab-bar" role="navigation" aria-label="Main navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${view === tab.id || (tab.id === 'parent' && activeMode === 'parent') ? 'active' : ''}`}
          onClick={() => {
            playSound('back', soundEnabled)
            vibrate([18], vibrationEnabled)
            tab.action()
          }}
          aria-label={tab.label}
          style={{ position: 'relative' }}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-text">{tab.label}</span>
          {tab.badge > 0 && <span className="badge">{tab.badge}</span>}
        </button>
      ))}
    </nav>
  )
}
