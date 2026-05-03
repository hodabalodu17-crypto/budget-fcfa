import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useBudgetStore } from '../store/useBudgetStore.js'
import { fmt, fmtShort, MONTHS, MONTHS_FULL, CATEGORIES } from '../utils/constants.js'

export default function StatsScreen() {
  const { months, savings, currentMonth, currentYear, getTotalExpenses, getTotalSavings, getMonthData } = useBudgetStore()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  const totalSpent = Object.entries(months).reduce((s, [, d]) => s + (d.expenses||[]).reduce((a,e)=>a+e.amount,0), 0)
  const totalSalary = Object.values(months).reduce((s, d) => s + (d.salary||0), 0)
  const totalSaved = getTotalSavings()
  const rate = totalSalary > 0 ? Math.round(totalSaved / totalSalary * 100) : 0

  // Bar chart data (monthly expenses)
  const barData = MONTHS.map((m, i) => ({
    name: m,
    dépenses: getTotalExpenses(i, currentYear),
    active: i === selectedMonth,
  }))

  // Pie chart data (categories for selected month)
  const selData = getMonthData(selectedMonth, currentYear)
  const cats = {}
  ;(selData.expenses || []).forEach(e => { cats[e.cat] = (cats[e.cat]||0) + e.amount })
  const pieData = Object.entries(cats).map(([key, val]) => ({
    name: CATEGORIES[key]?.label || key,
    value: val,
    color: CATEGORIES[key]?.color || '#9E9E9E',
  }))

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Résumé annuel {currentYear}</p>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total dépensé', val: fmtShort(totalSpent), color: '#D84040' },
          { label: 'Total épargné', val: fmtShort(totalSaved), color: '#1A6B4A' },
          { label: 'Mois actuel',   val: MONTHS[currentMonth], color: '#111827' },
          { label: 'Taux épargne',  val: rate + '%',           color: '#1A6B4A' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F9FAFB', border: '0.5px solid #E5E7EB', borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 500, color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* BAR CHART */}
      <div style={{ background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 12 }}>Dépenses mensuelles</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
            <Tooltip formatter={(v) => fmt(v)} labelStyle={{ fontSize: 12 }} contentStyle={{ borderRadius: 8, border: '0.5px solid #E5E7EB', fontSize: 12 }} />
            <Bar dataKey="dépenses" radius={[4,4,0,0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={i === selectedMonth ? '#1A6B4A' : '#9FE1CB'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div style={{ background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 12 }}>Répartition par catégorie — {MONTHS_FULL[selectedMonth]}</p>
        {pieData.length === 0 ? (
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', padding: '12px 0' }}>Aucune dépense ce mois</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <PieChart width={110} height={110}>
              <Pie data={pieData} cx={50} cy={50} outerRadius={48} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ color: '#374151' }}>{d.name}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', color: '#6B7280' }}>{fmtShort(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MONTH SELECTOR */}
      <p style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Par mois</p>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12, paddingBottom: 4, scrollbarWidth: 'none' }}>
        {MONTHS.map((m, i) => (
          <button key={i} onClick={() => setSelectedMonth(i)} style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 12, whiteSpace: 'nowrap',
            border: '0.5px solid',
            background: selectedMonth === i ? '#1A6B4A' : 'transparent',
            borderColor: selectedMonth === i ? '#1A6B4A' : '#E5E7EB',
            color: selectedMonth === i ? '#fff' : '#6B7280',
            fontFamily: 'var(--font)', cursor: 'pointer'
          }}>{m}</button>
        ))}
      </div>

      {/* MONTH DETAIL */}
      <MonthDetail month={selectedMonth} year={currentYear} />
    </div>
  )
}

function MonthDetail({ month, year }) {
  const { getMonthData, getTotalExpenses } = useBudgetStore()
  const data = getMonthData(month, year)
  const spent = getTotalExpenses(month, year)
  const exps = [...(data.expenses || [])].reverse()

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        {[
          { label: 'Salaire', val: fmt(data.salary) },
          { label: 'Dépensé', val: fmt(spent), color: '#D84040' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#F9FAFB', border: '0.5px solid #E5E7EB', borderRadius: 10, padding: '10px 12px' }}>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{s.label}</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, color: s.color || '#111827' }}>{s.val}</p>
          </div>
        ))}
      </div>
      {exps.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, padding: '16px 0' }}>Aucune dépense</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {exps.map(exp => {
            const c = CATEGORIES[exp.cat] || CATEGORIES.other
            return (
              <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.label}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>{exp.date}</p>
                </div>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#D84040', whiteSpace: 'nowrap' }}>-{fmt(exp.amount)}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
