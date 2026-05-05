import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CURRENT_MONTH = new Date().getMonth()
const CURRENT_YEAR = new Date().getFullYear()

function makeKey(month, year) {
  return `${year}-${month}`
}

const defaultMonthData = () => ({ salary: 0, expenses: [], borrowed: 0 })

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      currentMonth: CURRENT_MONTH,
      currentYear: CURRENT_YEAR,
      months: {},
      savings: [],
      loans: [], // historique des emprunts

      // ---- Navigation
      setCurrentMonth: (month, year) => set({ currentMonth: month, currentYear: year }),

      // ---- Salary
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

      // ---- Expenses
      addExpense: (expense) => {
        const { currentMonth, currentYear, months } = get()
        const key = makeKey(currentMonth, currentYear)
        const current = months[key] || defaultMonthData()
        const newExpense = { ...expense, id: Date.now() }
        set({
          months: {
            ...months,
            [key]: { ...current, expenses: [...current.expenses, newExpense] }
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

      // ---- Emprunter depuis l'épargne ← NOUVEAU
      borrowFromSavings: (amount) => {
        const { currentMonth, currentYear, months, savings, loans } = get()
        const totalSavings = savings.reduce((s, e) => s + e.amount, 0)
        if (amount <= 0) return { error: 'Montant invalide' }
        if (amount > totalSavings) return { error: 'Montant supérieur à l\'épargne disponible' }

        const key = makeKey(currentMonth, currentYear)
        const current = months[key] || defaultMonthData()

        // Déduire de l'épargne — on réduit le dernier transfert
        let remaining = amount
        const updatedSavings = [...savings].reverse().map(s => {
          if (remaining <= 0) return s
          const deduct = Math.min(s.amount, remaining)
          remaining -= deduct
          return { ...s, amount: s.amount - deduct }
        }).reverse().filter(s => s.amount > 0)

        // Ajouter l'emprunt au solde du mois
        set({
          savings: updatedSavings,
          months: {
            ...months,
            [key]: { ...current, borrowed: (current.borrowed || 0) + amount }
          },
          loans: [...(loans || []), {
            id: Date.now(),
            amount,
            month: currentMonth,
            year: currentYear,
            date: new Date().toLocaleDateString('fr-FR')
          }]
        })
        return { success: true, amount }
      },

      // ---- Savings transfer
      transferToSavings: () => {
        const { currentMonth, currentYear, months, savings } = get()
        const key = makeKey(currentMonth, currentYear)
        const current = months[key] || defaultMonthData()
        const spent = current.expenses.reduce((s, e) => s + e.amount, 0)
        const solde = current.salary + (current.borrowed || 0) - spent
        if (solde <= 0) return { error: 'Solde nul ou négatif' }
        if (savings.find(s => s.key === key)) return { error: 'Déjà transféré ce mois' }
        set({
          savings: [...savings, {
            key,
            amount: solde,
            month: currentMonth,
            year: currentYear,
            date: new Date().toLocaleDateString('fr-FR')
          }]
        })
        return { success: true, amount: solde }
      },

      // ---- Supprimer un transfert
      deleteTransfer: (transferKey) => {
        const { savings } = get()
        set({ savings: savings.filter(s => s.key !== transferKey) })
      },

      // ---- Getters
      getMonthData: (month, year) => {
        const key = makeKey(month, year)
        return get().months[key] || defaultMonthData()
      },

      getTotalExpenses: (month, year) => {
        const key = makeKey(month, year)
        const data = get().months[key] || defaultMonthData()
        return data.expenses.reduce((s, e) => s + e.amount, 0)
      },

      getSolde: (month, year) => {
        const key = makeKey(month, year)
        const data = get().months[key] || defaultMonthData()
        const spent = data.expenses.reduce((s, e) => s + e.amount, 0)
        return data.salary + (data.borrowed || 0) - spent
      },

      getTotalSavings: () => {
        return get().savings.reduce((s, e) => s + e.amount, 0)
      },

      // ---- Reset
      resetAll: () => set({ months: {}, savings: [], loans: [] }),
    }),
    { name: 'budget-fcfa-store' }
  )
)
