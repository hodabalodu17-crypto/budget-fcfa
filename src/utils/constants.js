export const MONTHS = ['Janv','Févr','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc']
export const MONTHS_FULL = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

export const CATEGORIES = {
  housing:   { label: 'Logement',   icon: '🏠', color: '#9C27B0', bg: '#F3E5F5', text: '#6A1B9A' },
  food:      { label: 'Nourriture', icon: '🍽️', color: '#FF9800', bg: '#FFF3E0', text: '#E65100' },
  transport: { label: 'Transport',  icon: '🚌', color: '#2196F3', bg: '#E3F2FD', text: '#1565C0' },
  health:    { label: 'Santé',      icon: '💊', color: '#F44336', bg: '#FCE4EC', text: '#C62828' },
  leisure:   { label: 'Loisirs',    icon: '🎉', color: '#00BCD4', bg: '#E0F7FA', text: '#006064' },
  education: { label: 'Éducation',  icon: '📚', color: '#4CAF50', bg: '#E8F5E9', text: '#1B5E20' },
  other:     { label: 'Autre',      icon: '📦', color: '#9E9E9E', bg: '#F5F5F5', text: '#424242' },
}

export function fmt(n) {
  return Math.round(n || 0).toLocaleString('fr-FR') + ' FCFA'
}

export function fmtShort(n) {
  n = Math.round(n || 0)
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return Math.round(n / 1_000) + 'K'
  return n.toLocaleString('fr-FR')
}

export function today() {
  return new Date().toISOString().split('T')[0]
}
