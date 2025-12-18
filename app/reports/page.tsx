"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { TrendingDown, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { useStore } from "@/lib/store"

export default function ReportsPage() {
  const { expenses, currency, monthlyBudget } = useStore()

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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "#10b981",
      Transport: "#3b82f6",
      Entertainment: "#8b5cf6",
      Shopping: "#ec4899",
      Bills: "#f97316",
      Other: "#6b7280",
    }
    return colors[category] || colors.Other
  }

  // Calculate category spending
  const categorySpending = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryData = Object.entries(categorySpending)
    .map(([name, value]) => ({
      name,
      value,
      color: getCategoryColor(name),
    }))
    .sort((a, b) => b.value - a.value)

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const topCategory = categoryData[0] || { name: "None", value: 0 }

  // Calculate weekly data for the last 4 weeks
  const now = new Date()
  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - (3 - i) * 7 - now.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weekExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date)
      return expenseDate >= weekStart && expenseDate <= weekEnd
    })

    const amount = weekExpenses.reduce((sum, e) => sum + e.amount, 0)

    return {
      week: `Week ${i + 1}`,
      amount: Number(amount.toFixed(2)),
    }
  })

  // Calculate monthly data for the last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthDate = new Date()
    monthDate.setMonth(now.getMonth() - (5 - i))

    const monthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date)
      return expenseDate.getMonth() === monthDate.getMonth() && expenseDate.getFullYear() === monthDate.getFullYear()
    })

    const expenseAmount = monthExpenses.reduce((sum, e) => sum + e.amount, 0)

    return {
      month: monthDate.toLocaleDateString("en-US", { month: "short" }),
      budget: monthlyBudget,
      expenses: Number(expenseAmount.toFixed(2)),
    }
  })

  const avgMonthlyExpense = monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length
  const lastMonthExpenses = monthlyData[monthlyData.length - 2]?.expenses || 0
  const thisMonthExpenses = monthlyData[monthlyData.length - 1]?.expenses || 0
  const trend = lastMonthExpenses > 0 ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Analyze your spending patterns and trends</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">
                {getCurrencySymbol(currency)}
                {totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Monthly</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl">
                {getCurrencySymbol(currency)}
                {avgMonthlyExpense.toFixed(0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold sm:text-2xl ${trend >= 0 ? "text-red-600" : "text-green-600"}`}>
                {trend >= 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Category</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold sm:text-2xl truncate">{topCategory.name}</div>
              <p className="text-xs text-muted-foreground truncate">
                {getCurrencySymbol(currency)}
                {topCategory.value.toLocaleString()} spent
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Expenses</CardTitle>
                <CardDescription>Monthly comparison for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                    <p>No data available. Add expenses to see reports.</p>
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      budget: {
                        label: "Budget",
                        color: "#10b981",
                      },
                      expenses: {
                        label: "Expenses",
                        color: "#ef4444",
                      },
                    }}
                    className="h-[350px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="budget" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Distribution of expenses across categories</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                    <p>No data available. Add expenses to see category breakdown.</p>
                  </div>
                ) : (
                  <div className="grid gap-8 md:grid-cols-2">
                    <ChartContainer config={{}} className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <div className="flex flex-col justify-center space-y-3">
                      {categoryData.map((category) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm text-muted-foreground truncate">{category.name}</span>
                          </div>
                          <span className="text-sm font-semibold ml-2">
                            {getCurrencySymbol(currency)}
                            {category.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Spending Trend</CardTitle>
                <CardDescription>Your spending pattern over the last 4 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                    <p>No data available. Add expenses to see trends.</p>
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Amount",
                        color: "#8b5cf6",
                      },
                    }}
                    className="h-[350px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
