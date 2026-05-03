import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useBudgetStore } from '../store/useBudgetStore.js'
import { fmt, fmtShort, MONTHS, MONTHS_FULL } from '../utils/constants.js'

export default function EpargneScreen() {
  const { savings, currentYear, getTotalSavings } = useBudgetStore()
  const total = getTotalSavings()

  // Cumulative savings per month
  const chartData = MONTHS.map((m, i) => {
    const cumul = savings
      .filter(s => s.year === currentYear && s.month <= i)
      .reduce((sum, s) => sum + s.amount, 0)
    return { name: m, épargne: cumul }
  })

  const history = [...savings]
    .filter(s => s.year === currentYear)
    .sort((a, b) => b.month - a.month)

  return (
    <div style={{ padding: 16 }}>

      {/* HERO CARD */}
      <div style={{
        background: 'linear-gradient(135deg, #0D4A30 0%, #1A6B4A 100%)',
        borderRadius: 20, padding: 24, color: '#fff', marginBottom: 16, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <p style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Épargne totale</p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 38, fontWeight: 500, marginBottom: 6 }}>{fmt(total)}</p>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          {total > 0 ? `🌱 Bravo ! Continuez sur cette lancée.` : '✨ Construisez votre avenir'}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px' }}>
            <p style={{ fontSize: 10, opacity: 0.7 }}>Transferts</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, marginTop: 2 }}>{savings.length}</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px' }}>
            <p style={{ fontSize: 10, opacity: 0.7 }}>Moy. mensuelle</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, marginTop: 2 }}>
              {savings.length > 0 ? fmtShort(total / savings.length) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* AREA CHART */}
      <div style={{ background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 12 }}>Évolution de l'épargne {currentYear}</p>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="epGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A6B4A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1A6B4A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
            <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 8, border: '0.5px solid #E5E7EB', fontSize: 12 }} />
            <Area type="monotone" dataKey="épargne" stroke="#1A6B4A" strokeWidth={2} fill="url(#epGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* HISTORY */}
      <p style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Historique des transferts</p>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏦</div>
          <p style={{ fontSize: 13 }}>Aucun transfert effectué</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Utilisez le bouton "Transférer" sur l'accueil</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {history.map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 14px', background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 10
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{MONTHS_FULL[s.month]} {s.year}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.date || '—'}</p>
              </div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, color: '#1A6B4A' }}>+{fmt(s.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
