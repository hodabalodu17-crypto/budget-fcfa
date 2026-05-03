import React from 'react'

const TABS = [
  { id: 'home',    icon: '🏠', label: 'Accueil'   },
  { id: 'add',     icon: '➕', label: 'Dépenses'  },
  { id: 'stats',   icon: '📊', label: 'Stats'     },
  { id: 'epargne', icon: '💰', label: 'Épargne'   },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      display: 'flex',
      background: '#fff',
      borderTop: '1px solid #E5E7EB',
      zIndex: 100,
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)} style={{
            flex: 1,
            padding: '10px 4px 12px',
            border: 'none',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            fontSize: 10,
            color: isActive ? '#1A6B4A' : '#9CA3AF',
            fontFamily: 'var(--font)',
            fontWeight: isActive ? 500 : 400,
            cursor: 'pointer',
            position: 'relative',
          }}>
            {isActive && (
              <span style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 28,
                height: 2,
                background: '#1A6B4A',
                borderRadius: '0 0 4px 4px',
              }} />
            )}
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
