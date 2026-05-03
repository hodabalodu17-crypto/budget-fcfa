import React, { useState } from 'react'
import HomeScreen from './components/HomeScreen.jsx'
import AddExpenseScreen from './components/AddExpenseScreen.jsx'
import StatsScreen from './components/StatsScreen.jsx'
import EpargneScreen from './components/EpargneScreen.jsx'
import BottomNav from './components/BottomNav.jsx'

const SCREENS = ['home', 'add', 'stats', 'epargne']

export default function App() {
  const [screen, setScreen] = useState('home')

  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>
        {screen === 'home'    && <HomeScreen onNavigate={setScreen} />}
        {screen === 'add'     && <AddExpenseScreen onNavigate={setScreen} />}
        {screen === 'stats'   && <StatsScreen />}
        {screen === 'epargne' && <EpargneScreen />}
      </div>

      <BottomNav active={screen} onNavigate={setScreen} />
    </div>
  )
}
