// ── Audio ──────────────────────────────────────────────────────────────────
let _ctx = null
const ctx = () => {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

const tone = (freq, dur, type = 'sine', gain = 0.28, delay = 0) => {
  try {
    const c = ctx()
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.connect(g); g.connect(c.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime + delay)
    g.gain.setValueAtTime(0, c.currentTime + delay)
    g.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.04)
    g.gain.linearRampToValueAtTime(0, c.currentTime + delay + dur)
    osc.start(c.currentTime + delay)
    osc.stop(c.currentTime + delay + dur + 0.05)
  } catch {}
}

export const SOUNDS = {
  tap:      () => { tone(700, 0.12, 'sine', 0.22) },
  happy:    () => { tone(523, 0.18); tone(659, 0.18, 'sine', 0.22, 0.14); tone(784, 0.28, 'sine', 0.22, 0.28) },
  sad:      () => { tone(494, 0.3, 'sine', 0.18); tone(392, 0.45, 'sine', 0.15, 0.28) },
  angry:    () => { tone(220, 0.12, 'square', 0.18); tone(180, 0.18, 'square', 0.15, 0.1) },
  scared:   () => { tone(740, 0.09, 'sine', 0.18); tone(800, 0.18, 'sine', 0.14, 0.09) },
  calm:     () => { tone(396, 0.5, 'sine', 0.16); tone(528, 0.5, 'sine', 0.12, 0.35) },
  silly:    () => { [523,587,659,698,784].forEach((f,i) => tone(f, 0.1, 'triangle', 0.2, i*0.08)) },
  hungry:   () => { tone(440, 0.18, 'triangle', 0.22); tone(494, 0.22, 'triangle', 0.2, 0.18) },
  thirsty:  () => { tone(600, 0.12, 'sine', 0.2); tone(700, 0.18, 'sine', 0.18, 0.14) },
  tired:    () => { tone(330, 0.7, 'sine', 0.14) },
  hurt:     () => { tone(300, 0.18, 'sawtooth', 0.18); tone(280, 0.38, 'sine', 0.16, 0.16) },
  hug:      () => { tone(523, 0.35, 'sine', 0.2); tone(659, 0.35, 'sine', 0.18, 0.2); tone(784, 0.45, 'sine', 0.18, 0.4) },
  help:     () => { [880,880,880].forEach((_,i) => tone(880, 0.15, 'square', 0.2, i*0.22)) },
  loud:     () => { tone(200, 0.25, 'square', 0.15) },
  stop:     () => { tone(880, 0.15, 'square', 0.25); tone(660, 0.28, 'square', 0.2, 0.15) },
  play:     () => { [523,659,784,1047].forEach((f,i) => tone(f, 0.12, 'triangle', 0.22, i*0.09)) },
  music:    () => { [523,587,659,698,784,880].forEach((f,i) => tone(f, 0.15, 'sine', 0.2, i*0.1)) },
  confirm:  () => { tone(523, 0.14, 'sine', 0.28); tone(784, 0.22, 'sine', 0.26, 0.1) },
  sent:     () => { [523,659,784,1047].forEach((f,i) => tone(f, 0.18, 'sine', 0.26, i*0.12)) },
  back:     () => { tone(440, 0.12, 'sine', 0.18) },
  alert:    () => { tone(880, 0.1, 'sine', 0.35); tone(1100, 0.18, 'sine', 0.3, 0.1); tone(880, 0.28, 'sine', 0.28, 0.24) },
}

export const playSound = (name, enabled = true) => {
  if (!enabled) return
  try { (SOUNDS[name] || SOUNDS.tap)() } catch {}
}

export const vibrate = (pattern = [40], enabled = true) => {
  if (!enabled || !navigator.vibrate) return
  try { navigator.vibrate(pattern) } catch {}
}

// ── Speech ─────────────────────────────────────────────────────────────────
let voices = []
const loadVoices = () => {
  voices = window.speechSynthesis?.getVoices() ?? []
}
if (typeof window !== 'undefined') {
  loadVoices()
  window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
}

const pickVoice = () => {
  // Prefer a friendly female English voice
  const pref = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Victoria', 'Fiona']
  for (const name of pref) {
    const v = voices.find(v => v.name.includes(name))
    if (v) return v
  }
  return voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang.startsWith('en'))
    || voices[0]
    || null
}

export const speak = (text, enabled = true) => {
  if (!enabled || !window.speechSynthesis) return
  try {
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.88
    utt.pitch = 1.1
    utt.volume = 1
    const voice = pickVoice()
    if (voice) utt.voice = voice
    window.speechSynthesis.speak(utt)
  } catch {}
}
