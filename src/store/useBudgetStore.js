import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CURRENT_MONTH = new Date().getMonth()
const CURRENT_YEAR = new Date().getFullYear()

function makeKey(month, year) {
  return `${year}-${month}`
}

const defaultMonthData = () => ({ salary: 0, expenses: [] })

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      currentMonth: CURRENT_MONTH,
      currentYear: CURRENT_YEAR,
      months: {},
      savings: [],

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

      // ---- Savings transfer
      transferToSavings: () => {
        const { currentMonth, currentYear, months, savings } = get()
        const key = makeKey(currentMonth, currentYear)
        const current = months[key] || defaultMonthData()
        const spent = current.expenses.reduce((s, e) => s + e.amount, 0)
        const solde = current.salary - spent
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

      // ---- DELETE a single transfer ← NOUVEAU
      deleteTransfer: (transferKey) => {
        const { savings } = get()
        set({
          savings: savings.filter(s => s.key !== transferKey)
        })
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
        return data.salary - spent
      },

      getTotalSavings: () => {
        return get().savings.reduce((s, e) => s + e.amount, 0)
      },

      // ---- Reset ALL ← DÉJÀ EXISTANT
      resetAll: () => set({ months: {}, savings: [] }),
    }),
    {
      name: 'budget-fcfa-store',
    }
  )
)
