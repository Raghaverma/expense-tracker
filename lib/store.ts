import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
  currency: string
}

export interface Budget {
  category: string
  limit: number
  color: string
}

interface AppState {
  expenses: Expense[]
  currency: string
  monthlyBudget: number
  budgets: Budget[]
  addExpense: (expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  setCurrency: (currency: string) => void
  setMonthlyBudget: (budget: number) => void
  updateBudget: (category: string, limit: number) => void
  exportData: () => string
  importData: (data: string) => void
  clearAllData: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currency: "INR",
      monthlyBudget: 50000,
      expenses: [],
      budgets: [
        { category: "Food", limit: 10000, color: "emerald" },
        { category: "Transport", limit: 5000, color: "blue" },
        { category: "Entertainment", limit: 3000, color: "purple" },
        { category: "Shopping", limit: 8000, color: "pink" },
        { category: "Bills", limit: 15000, color: "orange" },
        { category: "Healthcare", limit: 5000, color: "red" },
        { category: "Education", limit: 10000, color: "indigo" },
      ],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [{ ...expense, id: Date.now().toString() }, ...state.expenses],
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      setCurrency: (currency) => set({ currency }),
      setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),
      updateBudget: (category, limit) =>
        set((state) => ({
          budgets: state.budgets.map((b) => (b.category === category ? { ...b, limit } : b)),
        })),
      exportData: () => {
        const state = get()
        const exportData = {
          expenses: state.expenses,
          currency: state.currency,
          monthlyBudget: state.monthlyBudget,
          budgets: state.budgets,
          exportDate: new Date().toISOString(),
        }
        return JSON.stringify(exportData, null, 2)
      },
      importData: (data: string) => {
        try {
          const parsed = JSON.parse(data)
          set({
            expenses: parsed.expenses || [],
            currency: parsed.currency || "INR",
            monthlyBudget: parsed.monthlyBudget || 50000,
            budgets: parsed.budgets || [],
          })
        } catch (error) {
          console.error("Failed to import data:", error)
          throw new Error("Invalid data format")
        }
      },
      clearAllData: () => {
        set({
          expenses: [],
          currency: "INR",
          monthlyBudget: 50000,
          budgets: [
            { category: "Food", limit: 10000, color: "emerald" },
            { category: "Transport", limit: 5000, color: "blue" },
            { category: "Entertainment", limit: 3000, color: "purple" },
            { category: "Shopping", limit: 8000, color: "pink" },
            { category: "Bills", limit: 15000, color: "orange" },
            { category: "Healthcare", limit: 5000, color: "red" },
            { category: "Education", limit: 10000, color: "indigo" },
          ],
        })
      },
    }),
    {
      name: "expense-tracker-storage",
    },
  ),
)
