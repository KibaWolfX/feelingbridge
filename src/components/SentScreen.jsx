import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../hooks/useStore.js'
import { playSound, vibrate, speak } from '../utils/sounds.js'
import { TabBar } from './HomeScreen.jsx'

const CONFETTI = ['⭐','🌟','✨','💫','🎉','🎊','💛','🧡']

export function SentScreen() {
  const { lastSent, goHome, settings, setMode } = useStore()
  const { soundEnabled, vibrationEnabled, voiceEnabled, parentName } = settings

  useEffect(() => {
    playSound('sent', soundEnabled)
    vibrate([50, 30, 50, 30, 80], vibrationEnabled)
    const timer = setTimeout(() => {
      speak(`Great job telling me! ${parentName || 'Your parent'} will see this now.`, voiceEnabled)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (!lastSent) { goHome(); return null }

  const { card } = lastSent

  return (
    <div className="screen" style={{ background: card.bg, transition: 'background 0.4s' }}>
      <div className="sent-screen">
        {/* Floating confetti */}
        {CONFETTI.map((c, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            style={{ position: 'absolute', fontSize: '1.8rem', pointerEvents: 'none', zIndex: 10 }}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.4, 1.2, 0],
              y: -(120 + i * 25),
              x: (i % 2 === 0 ? 1 : -1) * (30 + (i * 22)),
            }}
            transition={{ delay: i * 0.07, duration: 1.4, ease: 'easeOut' }}
          >
            {c}
          </motion.div>
        ))}

        {/* Big emotion circle */}
        <motion.div
          className="sent-bubble anim-bounce-in"
          style={{ backgroundColor: card.bg, border: `4px solid ${card.border}` }}
          role="img" aria-label={card.label}
        >
          {card.emoji}
        </motion.div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}
        >
          <div className="t-display" style={{ color: card.text }}>{card.label}</div>
          <div className="t-label" style={{ color: '#2B1A00' }}>
            Message sent! 📨
          </div>
          <div className="t-sub">
            {parentName || 'Your parent'} can see this now
          </div>
        </motion.div>

        {/* Reassurance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 280, damping: 24 }}
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: `2.5px solid ${card.border}`,
            borderRadius: 20,
            padding: '14px 20px',
            maxWidth: 300, textAlign: 'center',
          }}
        >
          <div className="t-label" style={{ color: card.text }}>
            {getReassurance(card.id)}
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}
        >
          <button
            className="btn-big"
            style={{ background: card.border, color: 'white', width: '100%' }}
            onClick={() => {
              playSound('back', useStore.getState().settings.soundEnabled)
              goHome()
            }}
          >
            🏠 Back to Home
          </button>
          <button
            className="btn-ghost"
            style={{ width: '100%' }}
            onClick={() => {
              playSound('tap', useStore.getState().settings.soundEnabled)
              setMode('parent')
            }}
          >
            👨‍👩‍👦 Show Parent
          </button>
        </motion.div>
      </div>

      <TabBar />
    </div>
  )
}

function getReassurance(id) {
  const m = {
    happy:    '💛 Yay! Being happy feels SO good!',
    sad:      '💙 It\'s okay to feel sad. You\'re not alone.',
    angry:    '❤️ Feeling mad is okay. Take a deep breath.',
    scared:   '💜 You are safe. I\'m right here with you.',
    calm:     '💚 Feeling peaceful is wonderful!',
    silly:    '🧡 Silly is the BEST feeling!',
    hungry:   '🍎 Let\'s find you something yummy!',
    thirsty:  '💧 Coming right up!',
    tired:    '😴 Your body needs rest. Let\'s get cozy.',
    hurt:     '🩹 We\'ll find where it hurts and help you.',
    hug:      '🤗 A big warm hug is on its way!',
    help:     '🙌 Great asking for help! Help is coming.',
    loud:     '🤫 Let\'s make it quieter for you.',
    crowded:  '🏠 Let\'s find a cozy quiet spot.',
    stop:     '✋ We\'re stopping. Everything is okay.',
    alone:    '🌙 We\'ll give you some space. I\'m nearby.',
    light:    '🌑 Let\'s dim the lights for you.',
    scratch:  '🫶 No touches. You\'re in control.',
    play:     '🧸 Play time! Let\'s go!',
    outside:  '🌳 Fresh air! Let\'s head outside!',
    music:    '🎵 Music coming right up!',
    video:    '📺 Let\'s find your favorite show.',
    book:     '📚 Story time! Let\'s pick one together.',
    snuggle:  '🛋️ Cuddle time is the best time.',
  }
  return m[id] || '💛 Your feelings always matter!'
}
