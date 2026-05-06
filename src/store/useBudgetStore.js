import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CURRENT_MONTH = new Date().getMonth()
const CURRENT_YEAR = new Date().getFullYear()

function makeKey(month, year) {
  return `${year}-${month}`
}

const defaultMonthData = () => ({
  salary: 0,
  expenses: [],
  borrowed: 0,       // total emprunté depuis l'épargne ce mois
  transferred: false // true quand le solde a été transféré en épargne
})

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      currentMonth: CURRENT_MONTH,
      currentYear: CURRENT_YEAR,
      months: {},
      savings: [],
      loans: [],

      setCurrentMonth: (month, year) => set({ currentMonth: month, currentYear: year }),

      setSalary: (amount) => {
        const { currentMonth, currentYear, months } = get()
        const key = makeKey(currentMonth, currentYear)
        set({
          months: {
            ...months,
            [key]: { ...defaultMonthData(), ...months[key], salary: amount }
          }
        })
      },

      addExpense: (expense) => {
        const { currentMonth, currentYear, months } = get()
        const key = makeKey(currentMonth, currentYear)
        const current = months[key] || defaultMonthData()
        set({
          months: {
            ...months,
            [key]: { ...current, expenses: [...current.expenses, { ...expense, id: Date.now() }] }
          }
        })
      },

      deleteExpense: (expenseId) => {
        const { currentMonth, currentYear, months } = get()
        const key = makeKey(currentMonth, currentYear)
        const current = months[key] || defaultMonthData()
        set({
          months: {
            ...months,
            [key]: { ...current, expenses: current.expenses.filter(e => e.id !== expenseId) }
          }
        })
      },

      // ---- TRANSFERT vers épargne
      // → marque transferred=true, solde devient 0
      transferToSavings: () => {
        const { currentMonth, currentYear, months, savings } = get()
        const key = makeKey(currentMonth, currentYear)
        const current = months[key] || defaultMonthData()

        if (current.transferred) return { error: 'Déjà transféré ce mois' }

        const spent = current.expenses.reduce((s, e) => s + e.amount, 0)
        const solde = current.salary + (current.borrowed || 0) - spent

        if (solde <= 0) return { error: 'Solde nul ou négatif' }

        set({
          months: {
            ...months,
            [key]: { ...current, transferred: true }
          },
          savings: [...savings, {
            key, amount: solde,
            month: currentMonth, year: currentYear,
            date: new Date().toLocaleDateString('fr-FR')
          }]
        })
        return { success: true, amount: solde }
      },

      // ---- ANNULER un transfert → solde revient, transferred=false
      deleteTransfer: (transferKey) => {
        const { savings, months } = get()
        const updatedMonths = { ...months }
        if (updatedMonths[transferKey]) {
          updatedMonths[transferKey] = { ...updatedMonths[transferKey], transferred: false }
        }
        set({
          savings: savings.filter(s => s.key !== transferKey),
          months: updatedMonths
        })
      },

      // ---- EMPRUNTER depuis l'épargne
      // → déduit de l'épargne, ajoute à borrowed, remet transferred=false
      borrowFromSavings: (amount) => {
        const { currentMonth, currentYear, months, savings, loans } = get()
        const totalSavings = savings.reduce((s, e) => s + e.amount, 0)
        if (amount <= 0) return { error: 'Montant invalide' }
        if (amount > totalSavings) return { error: "Montant supérieur à l'épargne disponible" }

        const key = makeKey(currentMonth, currentYear)
        const current = months[key] || defaultMonthData()

        let remaining = amount
        const updatedSavings = [...savings].reverse().map(s => {
          if (remaining <= 0) return s
          const deduct = Math.min(s.amount, remaining)
          remaining -= deduct
          return { ...s, amount: s.amount - deduct }
        }).reverse().filter(s => s.amount > 0)

        set({
          savings: updatedSavings,
          months: {
            ...months,
            [key]: {
              ...current,
              borrowed: (current.borrowed || 0) + amount,
              transferred: false  // remet à zéro pour que le solde emprunté soit visible
            }
          },
          loans: [...(loans || []), {
            id: Date.now(), amount,
            month: currentMonth, year: currentYear,
            date: new Date().toLocaleDateString('fr-FR')
          }]
        })
        return { success: true, amount }
      },

      // ---- GETTERS
      getMonthData: (month, year) => {
        const key = makeKey(month, year)
        return get().months[key] || defaultMonthData()
      },

      getTotalExpenses: (month, year) => {
        const key = makeKey(month, year)
        const data = get().months[key] || defaultMonthData()
        return data.expenses.reduce((s, e) => s + e.amount, 0)
      },

      // LOGIQUE SOLDE :
      // - Mois transféré sans emprunt  → 0 FCFA
      // - Mois transféré avec emprunt  → borrowed - dépenses après emprunt
      // - Mois normal                  → salary + borrowed - dépenses
      getSolde: (month, year) => {
        const key = makeKey(month, year)
        const data = get().months[key] || defaultMonthData()
        const spent = data.expenses.reduce((s, e) => s + e.amount, 0)

        if (data.transferred) {
          // Après transfert : seul l'emprunt compte comme budget
          return (data.borrowed || 0) - spent
        }
        return data.salary + (data.borrowed || 0) - spent
      },

      getTotalSavings: () => get().savings.reduce((s, e) => s + e.amount, 0),

      resetAll: () => set({ months: {}, savings: [], loans: [] }),
    }),
    { name: 'budget-fcfa-store' }
  )
)
