import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './hooks/useStore.js'
import { HomeScreen } from './components/HomeScreen.jsx'
import { SentScreen } from './components/SentScreen.jsx'
import { ParentDashboard } from './components/ParentDashboard.jsx'
import { HistoryScreen, SettingsScreen } from './components/Screens.jsx'
import './App.css'

const fade = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.97 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
}

export default function App() {
  const { activeMode, view } = useStore()

  // Parent mode overrides everything
  if (activeMode === 'parent') {
    return (
      <div className="app">
        <AnimatePresence mode="wait">
          <motion.div key="parent" {...fade} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <ParentDashboard />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  const screens = {
    home:     <HomeScreen />,
    sent:     <SentScreen />,
    history:  <HistoryScreen />,
    settings: <SettingsScreen />,
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          {...fade}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          {screens[view] ?? <HomeScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
