import React, { useState } from 'react'
import { getPIN, setPIN } from '../utils/storage.js'

export default function PinScreen({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [step, setStep] = useState(getPIN() ? 'enter' : 'create') // 'create' | 'confirm' | 'enter'
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  function handleDigit(d) {
    setError('')
    if (step === 'create') {
      const next = pin + d
      setPin(next)
      if (next.length === 4) setStep('confirm')
    } else if (step === 'confirm') {
      const next = confirm + d
      setConfirm(next)
      if (next.length === 4) {
        if (next === pin) {
          setPIN(pin)
          onUnlock()
        } else {
          setError('Les PIN ne correspondent pas')
          triggerShake()
          setPin('')
          setConfirm('')
          setStep('create')
        }
      }
    } else {
      const next = pin + d
      setPin(next)
      if (next.length === 4) {
        if (next === getPIN()) {
          onUnlock()
        } else {
          setError('PIN incorrect')
          triggerShake()
          setPin('')
        }
      }
    }
  }

  function handleDelete() {
    if (step === 'confirm') setConfirm(c => c.slice(0, -1))
    else setPin(p => p.slice(0, -1))
  }

  const current = step === 'confirm' ? confirm : pin
  const titles = {
    create: 'Créer votre PIN',
    confirm: 'Confirmer le PIN',
    enter: 'Entrez votre PIN',
  }
  const subtitles = {
    create: 'Choisissez un code à 4 chiffres',
    confirm: 'Répétez le code pour confirmer',
    enter: 'Bienvenue sur Budget FCFA',
  }

  return (
    <div className="pin-screen">
      <div className="pin-logo">💰</div>
      <h1 className="pin-title">{titles[step]}</h1>
      <p className="pin-subtitle">{subtitles[step]}</p>

      <div className={`pin-dots ${shake ? 'shake' : ''}`}>
        {[0,1,2,3].map(i => (
          <div key={i} className={`pin-dot ${i < current.length ? 'filled' : ''}`} />
        ))}
      </div>

      {error && <p className="pin-error">{error}</p>}

      <div className="pin-pad">
        {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d, i) => (
          <button
            key={i}
            className={`pin-key ${d === '' ? 'invisible' : ''}`}
            onClick={() => d === '⌫' ? handleDelete() : d !== '' && handleDigit(String(d))}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}
