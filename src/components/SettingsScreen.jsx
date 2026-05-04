import React, { useState } from 'react'
import { getPIN, setPIN, removePIN, clearSession } from '../utils/storage.js'

export default function SettingsScreen({ onNotify }) {
  const [hasPin, setHasPin] = useState(!!getPIN())
  const [showPinForm, setShowPinForm] = useState(false)
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  function handleSetPin() {
    if (hasPin && oldPin !== getPIN()) {
      onNotify('Ancien PIN incorrect', 'danger'); return
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      onNotify('Le PIN doit contenir exactement 4 chiffres', 'danger'); return
    }
    if (newPin !== confirmPin) {
      onNotify('Les PIN ne correspondent pas', 'danger'); return
    }
    setPIN(newPin)
    setHasPin(true)
    setShowPinForm(false)
    setOldPin(''); setNewPin(''); setConfirmPin('')
    onNotify('✅ PIN enregistré', 'success')
  }

  function handleRemovePin() {
    if (!window.confirm('Supprimer le PIN ? Votre app ne sera plus protégée.')) return
    removePIN()
    clearSession()
    setHasPin(false)
    onNotify('PIN supprimé', 'success')
  }

  function handleExport() {
    const data = localStorage.getItem('budget_fcfa_data') || '{}'
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget_fcfa_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    onNotify('✅ Données exportées', 'success')
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        JSON.parse(ev.target.result)
        localStorage.setItem('budget_fcfa_data', ev.target.result)
        onNotify('✅ Données importées — rechargez la page', 'success')
      } catch {
        onNotify('Fichier invalide', 'danger')
      }
    }
    reader.readAsText(file)
  }

  function handleReset() {
    if (!window.confirm('⚠️ Supprimer TOUTES les données ? Cette action est irréversible.')) return
    localStorage.removeItem('budget_fcfa_data')
    onNotify('Données supprimées', 'success')
    setTimeout(() => window.location.reload(), 1000)
  }

  return (
    <div className="screen">
      <h2 className="screen-title">⚙️ Réglages</h2>

      {/* PIN Section */}
      <div className="card">
        <p className="card-title">🔐 Sécurité — PIN</p>
        <div className="settings-row">
          <div>
            <p className="settings-label">{hasPin ? 'PIN activé' : 'PIN désactivé'}</p>
            <p className="settings-sub">{hasPin ? 'Votre app est protégée' : 'Activez un PIN pour sécuriser vos données'}</p>
          </div>
          <button
            className={`btn-toggle ${hasPin ? 'active' : ''}`}
            onClick={() => setShowPinForm(!showPinForm)}
          >
            {hasPin ? 'Modifier' : 'Activer'}
          </button>
        </div>

        {showPinForm && (
          <div className="pin-form">
            {hasPin && (
              <div className="form-group">
                <label className="form-label">Ancien PIN</label>
                <input type="password" inputMode="numeric" maxLength={4} placeholder="****" value={oldPin} onChange={e => setOldPin(e.target.value)} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Nouveau PIN (4 chiffres)</label>
              <input type="password" inputMode="numeric" maxLength={4} placeholder="****" value={newPin} onChange={e => setNewPin(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer le PIN</label>
              <input type="password" inputMode="numeric" maxLength={4} placeholder="****" value={confirmPin} onChange={e => setConfirmPin(e.target.value)} />
            </div>
            <div className="form-row">
              <button className="btn-primary" onClick={handleSetPin}>Enregistrer</button>
              <button className="btn-secondary" onClick={() => setShowPinForm(false)}>Annuler</button>
            </div>
            {hasPin && (
              <button className="btn-danger" onClick={handleRemovePin}>Supprimer le PIN</button>
            )}
          </div>
        )}
      </div>

      {/* Data management */}
      <div className="card">
        <p className="card-title">📦 Données</p>
        <div className="settings-actions">
          <button className="btn-secondary" onClick={handleExport}>
            ⬇️ Exporter mes données (JSON)
          </button>
          <label className="btn-secondary" style={{ textAlign: 'center', cursor: 'pointer' }}>
            ⬆️ Importer des données
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
          <button className="btn-danger" onClick={handleReset}>
            🗑️ Réinitialiser toutes les données
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <p className="card-title">ℹ️ À propos</p>
        <p className="settings-sub">Budget FCFA v1.0.0</p>
        <p className="settings-sub">Application de gestion budgétaire personnelle.</p>
        <p className="settings-sub" style={{ marginTop: 8 }}>Toutes vos données sont stockées localement sur votre appareil.</p>
      </div>
    </div>
  )
}
