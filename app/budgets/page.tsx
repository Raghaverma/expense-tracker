"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { Pencil, Check, X } from "lucide-react"

export default function BudgetsPage() {
  const { expenses, currency, budgets, updateBudget } = useStore()
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-orange-500"
    return "bg-emerald-500"
  }

  const categorySpending = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const handleEdit = (category: string, currentLimit: number) => {
    setEditingCategory(category)
    setEditValue(currentLimit.toString())
  }

  const handleSave = (category: string) => {
    const newLimit = Number.parseFloat(editValue)
    if (!isNaN(newLimit) && newLimit > 0) {
      updateBudget(category, newLimit)
    }
    setEditingCategory(null)
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setEditValue("")
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Budgets</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your spending limits by category</p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {budgets.map((budget) => {
            const spent = categorySpending[budget.category] || 0
            const percentage = (spent / budget.limit) * 100
            const remaining = budget.limit - spent

            return (
              <Card key={budget.category}>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl">{budget.category}</CardTitle>
                      <CardDescription className="mt-1">
                        {editingCategory === budget.category ? (
                          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="flex-1">
                              <Label htmlFor={`budget-${budget.category}`} className="text-xs">
                                New Limit
                              </Label>
                              <Input
                                id={`budget-${budget.category}`}
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div className="flex gap-2 sm:mt-5">
                              <Button
                                size="sm"
                                onClick={() => handleSave(budget.category)}
                                className="flex-1 sm:flex-none"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                className="flex-1 sm:flex-none bg-transparent"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>
                              {getCurrencySymbol(currency)}
                              {spent.toLocaleString()} of {getCurrencySymbol(currency)}
                              {budget.limit.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    {editingCategory !== budget.category && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(budget.category, budget.limit)}
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={percentage} className="h-3" indicatorClassName={getProgressColor(percentage)} />
                  <div className="flex flex-col gap-2 text-sm sm:flex-row sm:justify-between">
                    <span className={remaining < 0 ? "text-red-600 font-medium" : "text-muted-foreground"}>
                      {remaining < 0 ? (
                        <>
                          Over budget by {getCurrencySymbol(currency)}
                          {Math.abs(remaining).toLocaleString()}
                        </>
                      ) : (
                        <>
                          {getCurrencySymbol(currency)}
                          {remaining.toLocaleString()} remaining
                        </>
                      )}
                    </span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
