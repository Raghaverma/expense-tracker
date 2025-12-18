"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Filter } from "lucide-react"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { useStore } from "@/lib/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const { expenses, addExpense, deleteExpense } = useStore()

  const filteredExpenses = filterCategory === "all" ? expenses : expenses.filter((e) => e.category === filterCategory)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Salary: "bg-green-500",
      Income: "bg-teal-500",
      Food: "bg-emerald-500",
      Transport: "bg-blue-500",
      Entertainment: "bg-purple-500",
      Shopping: "bg-pink-500",
      Bills: "bg-orange-500",
      Healthcare: "bg-red-500",
      Education: "bg-indigo-500",
      Investment: "bg-yellow-500",
      Miscellaneous: "bg-gray-500",
    }
    return colors[category] || colors.Miscellaneous
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

  const groupedExpenses = filteredExpenses.reduce(
    (groups, expense) => {
      const date = expense.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(expense)
      return groups
    },
    {} as Record<string, typeof expenses>,
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Transactions</h1>
            <p className="mt-1 text-sm text-muted-foreground">View and manage all your expenses</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Salary">Salary</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Bills">Bills</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Investment">Investment</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No transactions found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {filterCategory !== "all" ? "Try changing the filter" : "Add your first expense to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedExpenses)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayExpenses]) => (
                <Card key={date}>
                  <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-base sm:text-lg">
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {dayExpenses.length} {dayExpenses.length === 1 ? "transaction" : "transactions"}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: {getCurrencySymbol(dayExpenses[0].currency)}
                        {dayExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dayExpenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex flex-col gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
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
                          <div className="flex items-center justify-between gap-3 sm:gap-4">
                            <p className="font-semibold text-right">
                              {getCurrencySymbol(expense.currency)}
                              {expense.amount.toLocaleString()}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteExpense(expense.id)}
                              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

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
