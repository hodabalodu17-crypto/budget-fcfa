import React, { useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore.js'
import { fmt, fmtShort, MONTHS_FULL, CATEGORIES } from '../utils/constants.js'

export default function HomeScreen({ onNavigate }) {
  const {
    currentMonth, currentYear,
    getMonthData, getTotalExpenses, getSolde, getTotalSavings,
    setSalary, deleteExpense, transferToSavings,
  } = useBudgetStore()

  const [showSalaryModal, setShowSalaryModal] = useState(false)
  const [salaryInput, setSalaryInput] = useState('')
  const [toast, setToast] = useState(null)

  const monthData = getMonthData(currentMonth, currentYear)
  const spent = getTotalExpenses(currentMonth, currentYear)
  const solde = getSolde(currentMonth, currentYear)
  const totalSavings = getTotalSavings()
  const pct = monthData.salary > 0 ? Math.min(100, Math.round(spent / monthData.salary * 100)) : 0

  const progressColor = pct >= 90 ? '#D84040' : pct >= 75 ? '#B87800' : '#1A6B4A'

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleSaveSalary() {
    const v = parseFloat(salaryInput)
    if (!v || v <= 0) return
    setSalary(v)
    setShowSalaryModal(false)
    setSalaryInput('')
    showToast('✅ Salaire enregistré !')
  }

  function handleTransfer() {
    const result = transferToSavings()
    if (result.error) showToast('⚠️ ' + result.error)
    else { showToast(`💰 ${fmt(result.amount)} transféré en épargne !`); onNavigate('epargne') }
  }

  const recent = [...(monthData.expenses || [])].reverse().slice(0, 5)

  return (
    <div style={{ padding: 16 }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#111827', color: '#fff', borderRadius: 10, padding: '10px 18px',
          fontSize: 13, zIndex: 200, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>{toast}</div>
      )}

      {/* HEADER CARD */}
      <div style={{
        background: 'linear-gradient(135deg, #1A6B4A 0%, #0D4A30 100%)',
        borderRadius: 20, padding: 20, color: '#fff', marginBottom: 14, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <p style={{ fontSize: 12, opacity: 0.75, marginBottom: 2 }}>
          {MONTHS_FULL[currentMonth]} {currentYear}
        </p>
        <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
          Salaire : {monthData.salary > 0 ? fmt(monthData.salary) : '—'}
        </p>
        <p style={{ fontSize: 11, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solde restant</p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 34, fontWeight: 500, margin: '4px 0 16px' }}>
          {fmt(Math.max(0, solde))}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px' }}>
            <p style={{ fontSize: 10, opacity: 0.7 }}>Dépensé</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, marginTop: 2 }}>{fmtShort(spent)}</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px' }}>
            <p style={{ fontSize: 10, opacity: 0.7 }}>Épargne totale</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, marginTop: 2 }}>{fmtShort(totalSavings)}</p>
          </div>
        </div>
      </div>

      {/* ALERTE */}
      {pct >= 80 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#FFF8E6', border: '0.5px solid #B87800', borderRadius: 10,
          padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#B87800'
        }}>
          ⚠️ Attention : vous avez dépensé {pct}% de votre salaire !
        </div>
      )}

      {/* PROGRESS */}
      <div style={{ background: '#F9FAFB', border: '0.5px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
          <span>Budget utilisé</span><span>{pct}%</span>
        </div>
        <div style={{ height: 8, background: '#E5E7EB', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pct + '%', background: progressColor, borderRadius: 999, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* RECENT EXPENSES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Dernières dépenses</p>
        <button onClick={() => onNavigate('add')} style={{ fontSize: 11, color: '#1A6B4A', border: '0.5px solid #1A6B4A', borderRadius: 8, padding: '4px 10px', background: 'transparent' }}>Voir tout</button>
      </div>

      {recent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>💸</div>
          <p style={{ fontSize: 13 }}>Aucune dépense ce mois</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {recent.map(exp => <ExpenseItem key={exp.id} exp={exp} onDelete={deleteExpense} />)}
        </div>
      )}

      {/* SALARY BTN */}
      <button onClick={() => { setSalaryInput(monthData.salary || ''); setShowSalaryModal(true) }} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 14px', background: '#E6F4EE', border: '0.5px solid transparent',
        borderRadius: 10, marginBottom: 10, cursor: 'pointer',
      }}>
        <span style={{ fontSize: 13, color: '#1A6B4A', fontWeight: 500 }}>✏️ Définir le salaire du mois</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#1A6B4A', fontWeight: 500 }}>
          {monthData.salary > 0 ? fmt(monthData.salary) : '—'}
        </span>
      </button>

      {/* TRANSFER */}
      <button onClick={handleTransfer} style={{
        width: '100%', padding: 12, borderRadius: 10,
        background: 'transparent', border: '0.5px solid #1A6B4A',
        color: '#1A6B4A', fontSize: 13, fontWeight: 500
      }}>
        💾 Transférer le solde en épargne
      </button>

      {/* SALARY MODAL */}
      {showSalaryModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 150,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 430 }}>
            <div style={{ width: 36, height: 4, background: '#E5E7EB', borderRadius: 999, margin: '0 auto 20px' }} />
            <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>💼 Salaire du mois</p>
            <label style={{ fontSize: 11, color: '#9CA3AF', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Montant (FCFA)</label>
            <input
              type="number"
              value={salaryInput}
              onChange={e => setSalaryInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveSalary()}
              placeholder="ex : 250000"
              autoFocus
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '0.5px solid #E5E7EB', fontSize: 16, marginBottom: 16, outline: 'none' }}
            />
            <button onClick={handleSaveSalary} style={{ width: '100%', padding: 13, borderRadius: 10, background: '#1A6B4A', color: '#fff', border: 'none', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Confirmer</button>
            <button onClick={() => setShowSalaryModal(false)} style={{ width: '100%', padding: 12, borderRadius: 10, background: 'transparent', color: '#1A6B4A', border: '0.5px solid #1A6B4A', fontSize: 14 }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ExpenseItem({ exp, onDelete }) {
  const cat = CATEGORIES[exp.cat] || CATEGORIES.other
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 12px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 10
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
        {cat.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.label}</p>
        <p style={{ fontSize: 11, color: '#9CA3AF' }}>{exp.date} · {cat.label}</p>
      </div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500, color: '#D84040', whiteSpace: 'nowrap' }}>-{fmt(exp.amount)}</p>
      <button onClick={() => onDelete(exp.id)} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 16, padding: '0 4px', opacity: 0.5 }}>✕</button>
    </div>
  )
}
