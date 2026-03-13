import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore.js'
import { playSound, vibrate, speak } from '../utils/sounds.js'
import { TabBar } from './HomeScreen.jsx'

// ─── History ──────────────────────────────────────────────────────────────────

function timeAgo(iso) {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    const h = Math.floor(diff / 3600000)
    if (m < 1)  return 'Just now'
    if (m < 60) return `${m}m ago`
    if (h < 24) return `${h}h ago`
    return new Date(iso).toLocaleDateString()
  } catch { return '' }
}

export function HistoryScreen() {
  const { history, goBack, setView, settings } = useStore()
  const { soundEnabled, vibrationEnabled, voiceEnabled } = settings

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 6px', flexShrink: 0 }}>
        <button className="btn-icon" onClick={() => { playSound('back', soundEnabled); useStore.getState().goHome() }} aria-label="Back">
          ←
        </button>
        <div className="t-title" style={{ flex: 1 }}>My Feelings 📖</div>
      </div>

      <div className="scroll" style={{ padding: '6px 14px' }}>
        {history.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">📖</span>
            <div className="t-title">Nothing yet</div>
            <div className="t-sub">Feelings you share will appear here</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((item, i) => (
              <motion.button
                key={item.id}
                className="history-item"
                style={{
                  background: item.card.bg,
                  border: `2.5px solid ${item.card.border}`,
                  cursor: 'pointer', width: '100%', textAlign: 'left',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  playSound(item.card.id, soundEnabled)
                  vibrate([30], vibrationEnabled)
                  speak(item.card.voice, voiceEnabled)
                }}
                aria-label={`${item.card.label}, ${timeAgo(item.timestamp)}`}
              >
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{item.card.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="t-label" style={{ color: item.card.text }}>{item.card.label}</div>
                  <div className="t-sub" style={{ fontSize: '0.8rem', marginTop: 2 }}>{item.card.voice}</div>
                </div>
                <div className="t-small">{timeAgo(item.timestamp)}</div>
              </motion.button>
            ))}
          </div>
        )}
        <div className="pb-safe" />
      </div>

      <TabBar />
    </div>
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function SettingsScreen() {
  const { settings, updateSettings, goBack } = useStore()
  const { soundEnabled, vibrationEnabled, voiceEnabled, childName, parentName, activeMode } = settings

  const [cName, setCName] = useState(childName)
  const [pName, setPName] = useState(parentName)

  const save = () => {
    updateSettings({ childName: cName.trim() || '', parentName: pName.trim() || '' })
    playSound('confirm', settings.soundEnabled)
    vibrate([30, 20, 30], settings.vibrationEnabled)
    useStore.getState().goHome()
  }

  const Toggle = ({ id, checked, onChange, label, sublabel }) => (
    <div className="setting-row">
      <div>
        <div className="t-label">{label}</div>
        {sublabel && <div className="t-small" style={{ marginTop: 2 }}>{sublabel}</div>}
      </div>
      <label className="toggle" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className="toggle-track" />
      </label>
    </div>
  )

  const TextInput = ({ id, label, value, onChange, placeholder }) => (
    <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      <label htmlFor={id} className="t-label">{label}</label>
      <input
        id={id} type="text" value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '11px 14px',
          borderRadius: 14, border: '2px solid rgba(0,0,0,0.12)',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem',
          background: 'var(--bg)', color: 'var(--text-dark)', outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = '#7C3AED'}
        onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
      />
    </div>
  )

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 6px', flexShrink: 0 }}>
        <button className="btn-icon" onClick={() => { playSound('back', settings.soundEnabled); useStore.getState().goHome() }} aria-label="Back">
          ←
        </button>
        <div className="t-title">⚙️ Settings</div>
      </div>

      <div className="scroll" style={{ padding: '8px 14px' }}>
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          {/* Names */}
          <SettingGroup label="👤 Names">
            <TextInput id="child-name" label="Child's name" value={cName} onChange={setCName} placeholder="e.g. Alex" />
            <TextInput id="parent-name" label="Parent's name" value={pName} onChange={setPName} placeholder="e.g. Mom / Dad" />
          </SettingGroup>

          {/* Sensory */}
          <SettingGroup label="🎛️ Sensory & Accessibility">
            <Toggle
              id="voice"
              checked={voiceEnabled}
              onChange={v => {
                updateSettings({ voiceEnabled: v })
                if (v) setTimeout(() => speak('Voice is on!', true), 100)
              }}
              label="🔈 Read cards aloud"
              sublabel="Speaks the card label when tapped"
            />
            <Toggle
              id="sound"
              checked={soundEnabled}
              onChange={v => { updateSettings({ soundEnabled: v }); if (v) playSound('confirm', true) }}
              label="🔊 Sound effects"
              sublabel="Plays tones when tapping cards"
            />
            <Toggle
              id="vibration"
              checked={vibrationEnabled}
              onChange={v => { updateSettings({ vibrationEnabled: v }); if (v) vibrate([40], true) }}
              label="📳 Vibration"
              sublabel="Gentle buzz feedback on taps"
            />
          </SettingGroup>

          {/* About */}
          <SettingGroup label="ℹ️ About">
            <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
              <div className="t-label">FeelingBridge 🌈</div>
              <div className="t-sub">
                An autism-friendly tool to help your child express emotions and needs — so you can understand and respond with confidence.
              </div>
              <div className="t-small" style={{ marginTop: 8 }}>
                Made with love for families who communicate differently 💛
              </div>
            </div>
          </SettingGroup>

          <button
            className="btn-big"
            style={{ background: '#7C3AED', color: 'white', width: '100%' }}
            onClick={save}
          >
            ✓ Save Settings
          </button>
        </motion.div>
        <div className="pb-safe" />
      </div>

      <TabBar />
    </div>
  )
}

function SettingGroup({ label, children }) {
  return (
    <div>
      <div className="setting-section-label">{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}
