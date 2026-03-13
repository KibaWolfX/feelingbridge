import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore.js'
import { playSound, vibrate } from '../utils/sounds.js'
import { TabBar } from './HomeScreen.jsx'

function timeAgo(iso) {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (m < 1)  return 'Just now'
    if (m < 60) return `${m}m ago`
    if (h < 24) return `${h}h ago`
    if (d < 7)  return `${d}d ago`
    return new Date(iso).toLocaleDateString()
  } catch { return '' }
}

export function ParentDashboard() {
  const { history, markAllRead, clearHistory, setMode, settings } = useStore()
  const { soundEnabled, vibrationEnabled, childName } = settings
  const unread = history.filter(h => !h.read)
  const latest = history[0]

  const todayCount = history.filter(h =>
    new Date(h.timestamp).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="screen" style={{ background: '#F8F6FF' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
        padding: '20px 18px 18px',
        paddingTop: 'calc(20px)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 700 }}>
              Parent View 👨‍👩‍👦
            </div>
            <div style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,5vw,2rem)', lineHeight: 1.2 }}>
              {childName || 'Your child'}'s Feelings
            </div>
          </div>
          <button
            className="btn-icon"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
            onClick={() => { playSound('back', soundEnabled); setMode('child') }}
            aria-label="Back to child view"
          >
            👶
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          {[
            { emoji: '🔔', val: unread.length, lbl: 'Unread',  hi: unread.length > 0 },
            { emoji: '📅', val: todayCount,    lbl: 'Today',   hi: false },
            { emoji: '📊', val: history.length, lbl: 'Total',  hi: false },
          ].map(s => (
            <div key={s.lbl} style={{
              flex: 1, textAlign: 'center',
              background: s.hi ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.13)',
              border: s.hi ? '1px solid rgba(239,68,68,0.45)' : '1px solid rgba(255,255,255,0.18)',
              borderRadius: 14, padding: '10px 6px',
            }}>
              <div style={{ fontSize: '1.1rem' }}>{s.emoji}</div>
              <div style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.68rem', fontWeight: 700 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest alert */}
      {latest && !latest.read && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '14px 14px 0',
            padding: '14px',
            background: latest.card.bg,
            border: `3px solid ${latest.card.border}`,
            borderRadius: 20,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: '2.4rem', flexShrink: 0 }}>{latest.card.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="t-small" style={{ marginBottom: 2 }}>
                🔔 New from {childName || 'your child'}
              </div>
              <div className="t-label" style={{ color: latest.card.text }}>
                {latest.card.voice}
              </div>
            </div>
            <button
              className="btn-icon"
              style={{ background: latest.card.border, color: 'white', border: 'none', flexShrink: 0 }}
              onClick={() => { playSound('confirm', soundEnabled); markAllRead() }}
              aria-label="Mark as read"
            >
              ✓
            </button>
          </div>

          {/* Parent tip */}
          <div
            className="tip-card"
            style={{
              background: 'rgba(255,255,255,0.6)',
              borderColor: latest.card.border,
              marginTop: 10,
            }}
          >
            <div className="t-small" style={{ marginBottom: 3, color: latest.card.text }}>💡 Tip for you</div>
            <div className="t-sub" style={{ color: '#2B1A00' }}>{latest.card.tip}</div>
          </div>
        </motion.div>
      )}

      {/* Actions row */}
      {(unread.length > 0 || history.length > 0) && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px 0', flexShrink: 0 }}>
          {unread.length > 0 && (
            <button
              className="btn-ghost"
              style={{ flex: 1 }}
              onClick={() => { playSound('confirm', soundEnabled); vibrate([20], vibrationEnabled); markAllRead() }}
            >
              ✓ Mark all read
            </button>
          )}
          {history.length > 0 && (
            <button
              className="btn-ghost"
              onClick={() => {
                if (confirm(`Clear all of ${childName || 'your child'}'s feeling history?`)) {
                  clearHistory()
                }
              }}
            >
              🗑️
            </button>
          )}
        </div>
      )}

      {/* History list */}
      <div className="scroll" style={{ padding: '10px 14px', flex: 1 }}>
        <div className="t-small" style={{ marginBottom: 8, paddingLeft: 2 }}>ALL MESSAGES</div>

        {history.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">📭</span>
            <div className="t-title">No messages yet</div>
            <div className="t-sub">When {childName || 'your child'} shares a feeling, it appears here</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                className="history-item"
                style={{ borderLeft: !item.read ? `4px solid ${item.card.border}` : '4px solid transparent' }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div
                  className="history-dot"
                  style={{ background: item.card.bg, border: `2px solid ${item.card.border}` }}
                >
                  {item.card.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span className="t-label" style={{ color: item.card.text }}>{item.card.label}</span>
                    {!item.read && (
                      <span style={{
                        background: '#EF4444', color: 'white', borderRadius: 100,
                        padding: '1px 7px', fontSize: '0.65rem', fontWeight: 900
                      }}>NEW</span>
                    )}
                  </div>
                  <div className="t-sub" style={{ marginTop: 2, fontSize: '0.8rem' }}>
                    {item.card.voice}
                  </div>
                </div>
                <div className="t-small" style={{ flexShrink: 0 }}>{timeAgo(item.timestamp)}</div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="pb-safe" />
      </div>

      <TabBar />
    </div>
  )
}
