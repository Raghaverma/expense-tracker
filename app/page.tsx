"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Wallet, ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { useState } from "react"
import { useStore } from "@/lib/store"

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { expenses, currency, monthlyBudget, addExpense } = useStore()

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = monthlyBudget - totalSpent
  const percentSpent = (totalSpent / monthlyBudget) * 100

  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const thisMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.date)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-emerald-500",
      Transport: "bg-blue-500",
      Entertainment: "bg-purple-500",
      Shopping: "bg-pink-500",
      Bills: "bg-orange-500",
      Other: "bg-gray-500",
    }
    return colors[category] || colors.Other
  }

  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      CAD: "C$",
      JPY: "¥",
    }
    return symbols[curr] || curr
  }

  const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate()
  const avgDailySpending = totalSpent / new Date().getDate()

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Overview of your expenses and budget</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">
                {getCurrencySymbol(currency)}
                {monthlyBudget.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600 sm:text-2xl">
                {getCurrencySymbol(currency)}
                {totalSpent.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{percentSpent.toFixed(1)}% of budget</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-600 sm:text-2xl">
                {getCurrencySymbol(currency)}
                {remaining.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{(100 - percentSpent).toFixed(1)}% remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">{thisMonthExpenses.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription className="mt-1">
                  You've spent {percentSpent.toFixed(1)}% of your monthly budget
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Avg. Daily Spending</div>
                <div className="text-lg font-semibold">
                  {getCurrencySymbol(currency)}
                  {avgDailySpending.toFixed(0)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={percentSpent} className="h-3" />
            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
              <span>
                {getCurrencySymbol(currency)}
                {totalSpent.toLocaleString()} spent
              </span>
              <span>
                {getCurrencySymbol(currency)}
                {remaining.toLocaleString()} remaining
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No transactions yet</p>
                <p className="text-sm">Add your first expense to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${getCategoryColor(expense.category)}`}
                      >
                        <span className="text-sm font-semibold text-white">{expense.category[0]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">{expense.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:text-right sm:block">
                      <p className="font-semibold">
                        {getCurrencySymbol(expense.currency)}
                        {expense.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AddExpenseDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddExpense={(expense) => {
            addExpense(expense)
            setIsDialogOpen(false)
          }}
        />
      </div>
    </div>
  )
}
