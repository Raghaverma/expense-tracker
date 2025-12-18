"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useState, useRef } from "react"
import { Check, Download, Upload, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { currency, monthlyBudget, setCurrency, setMonthlyBudget, exportData, importData, clearAllData } = useStore()
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString())
  const [saved, setSaved] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currencies = [
    { value: "INR", label: "Indian Rupee (INR)", symbol: "₹" },
    { value: "USD", label: "US Dollar (USD)", symbol: "$" },
    { value: "CAD", label: "Canadian Dollar (CAD)", symbol: "C$" },
    { value: "GBP", label: "British Pound (GBP)", symbol: "£" },
    { value: "EUR", label: "Euro (EUR)", symbol: "€" },
    { value: "JPY", label: "Japanese Yen (JPY)", symbol: "¥" },
  ]

  const handleSave = () => {
    const newBudget = Number.parseFloat(budgetInput)
    if (!isNaN(newBudget) && newBudget > 0) {
      setMonthlyBudget(newBudget)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleExportData = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `expense-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        importData(content)
        alert("Data imported successfully!")
      } catch (error) {
        alert("Failed to import data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    clearAllData()
    setShowClearDialog(false)
    alert("All data cleared successfully!")
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Currency</CardTitle>
              <CardDescription>Select your preferred currency for all transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.symbol} {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">This will be the default currency for new expenses</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Settings</CardTitle>
              <CardDescription>Set your monthly spending limit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Current: {currencies.find((c) => c.value === currency)?.symbol}
                    {monthlyBudget.toLocaleString()}
                  </p>
                </div>
                <Button onClick={handleSave} className="w-full gap-2 sm:w-auto">
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export, import, or clear your expense data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleExportData} variant="outline" className="flex-1 gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1 gap-2">
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                  <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </div>
                <div className="border-t pt-4">
                  <Button
                    onClick={() => setShowClearDialog(true)}
                    variant="destructive"
                    className="w-full gap-2 sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All Data
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Warning: This will permanently delete all your expenses and reset settings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your expenses, budgets, and reset all
              settings to default values.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData} className="bg-red-600 hover:bg-red-700">
              Yes, clear all data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
