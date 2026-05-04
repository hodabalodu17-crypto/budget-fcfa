import React from 'react'

export default function Notification({ message, type = 'success' }) {
  const colors = {
    success: { bg: '#e1f5ee', color: '#085041', border: '#1d9e75' },
    warning: { bg: '#faeeda', color: '#633806', border: '#ba7517' },
    danger:  { bg: '#fcebeb', color: '#501313', border: '#e24b4a' },
    info:    { bg: '#e6f1fb', color: '#042c53', border: '#185fa5' },
  }
  const style = colors[type] || colors.info

  return (
    <div
      className="notification"
      style={{ background: style.bg, color: style.color, borderLeft: `4px solid ${style.border}` }}
    >
      {message}
    </div>
  )
}
