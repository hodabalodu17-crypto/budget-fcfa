import React, { useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore.js'
import { fmt, today, CATEGORIES, MONTHS_FULL } from '../utils/constants.js'

export default function AddExpenseScreen({ onNavigate }) {
  const { addExpense, deleteExpense, getMonthData, currentMonth, currentYear } = useBudgetStore()
  const [label, setLabel]   = useState('')
  const [amount, setAmount] = useState('')
  const [cat, setCat]       = useState('food')
  const [date, setDate]     = useState(today())
  const [error, setError]   = useState('')

  const monthData = getMonthData(currentMonth, currentYear)
  const allExpenses = [...(monthData.expenses || [])].reverse()

  function handleAdd() {
    if (!label.trim()) { setError('Veuillez saisir un libellé.'); return }
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { setError('Veuillez saisir un montant valide.'); return }
    setError('')
    addExpense({ label: label.trim(), amount: amt, cat, date })
    setLabel('')
    setAmount('')
    onNavigate('home')
  }

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Nouvelle dépense</p>

      <div style={{ background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 14, padding: 16, marginBottom: 16 }}>

        {/* LABEL */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Libellé</label>
          <input
            value={label} onChange={e => setLabel(e.target.value)}
            placeholder="ex : Loyer, Nourriture..."
            style={inputStyle}
          />
        </div>

        {/* AMOUNT */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Montant (FCFA)</label>
          <input
            type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="ex : 20000"
            style={inputStyle}
          />
        </div>

        {/* CATEGORY */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Catégorie</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {Object.entries(CATEGORIES).map(([key, c]) => (
              <button key={key} onClick={() => setCat(key)} style={{
                padding: '6px 12px', borderRadius: 999, fontSize: 12, border: '0.5px solid',
                background: cat === key ? c.bg : 'transparent',
                borderColor: cat === key ? c.color : '#E5E7EB',
                color: cat === key ? c.text : '#6B7280',
                fontFamily: 'var(--font)',
              }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* DATE */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

        {error && <p style={{ color: '#D84040', fontSize: 12, marginBottom: 10 }}>⚠️ {error}</p>}

        <button onClick={handleAdd} style={{
          width: '100%', padding: 13, borderRadius: 10, background: '#1A6B4A',
          color: '#fff', border: 'none', fontSize: 14, fontWeight: 500
        }}>
          ✅ Valider la dépense
        </button>
      </div>

      {/* LIST */}
      <p style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
        {MONTHS_FULL[currentMonth]} — {allExpenses.length} dépense(s)
      </p>

      {allExpenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>📋</div>
          <p style={{ fontSize: 13 }}>Aucune dépense enregistrée</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {allExpenses.map(exp => {
            const c = CATEGORIES[exp.cat] || CATEGORIES.other
            return (
              <div key={exp.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 12px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 10
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.label}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>{exp.date}</p>
                </div>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500, color: '#D84040', whiteSpace: 'nowrap' }}>-{fmt(exp.amount)}</p>
                <button onClick={() => deleteExpense(exp.id)} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 16, padding: '0 4px', opacity: 0.5, cursor: 'pointer' }}>✕</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  fontSize: 11, fontWeight: 500, color: '#9CA3AF',
  textTransform: 'uppercase', letterSpacing: '0.06em',
  display: 'block', marginBottom: 4
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '0.5px solid #E5E7EB', fontSize: 14, outline: 'none',
  background: '#F9FAFB', fontFamily: 'var(--font)', color: '#111827'
}
