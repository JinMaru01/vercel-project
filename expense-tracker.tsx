"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Expense, Wallet } from "./types/expense"
import { ExpenseForm } from "./components/expense-form"
import { ExpenseDashboard } from "./components/expense-dashboard"
import { ExpenseList } from "./components/expense-list"
import { ExportSummary } from "./components/export-summary"
import { WalletManager } from "./components/wallet-manager"

// Mock initial wallet data
const initialWallets: Wallet[] = [
  {
    id: "1",
    name: "Cash (Riel)",
    balance: 6150000,
    currency: "KHR",
    exchangeRate: 4100,
  },
  {
    id: "2",
    name: "Cash (Dollar)",
    balance: 500,
    currency: "USD",
    exchangeRate: 1,
  },
  {
    id: "3",
    name: "ABA Bank (USD)",
    balance: 2500,
    currency: "USD",
    exchangeRate: 1,
  },
  {
    id: "4",
    name: "ACLEDA Bank (KHR)",
    balance: 12300000,
    currency: "KHR",
    exchangeRate: 4100,
  },
  {
    id: "5",
    name: "Credit Card (USD)",
    balance: 1800,
    currency: "USD",
    exchangeRate: 1,
  },
]

// Mock initial data
const initialExpenses: Expense[] = [
  {
    id: "1",
    amount: 45.5,
    category: "Food & Dining",
    wallet: "Cash (Dollar)",
    description: "Lunch at Italian restaurant",
    date: new Date("2024-01-15"),
    currency: "USD",
  },
  {
    id: "2",
    amount: 492000,
    category: "Transportation",
    wallet: "Cash (Riel)",
    description: "Gas for car",
    date: new Date("2024-01-14"),
    currency: "KHR",
  },
  {
    id: "3",
    amount: 89.99,
    category: "Shopping",
    wallet: "Credit Card (USD)",
    description: "New shoes",
    date: new Date("2024-01-13"),
    currency: "USD",
  },
  {
    id: "4",
    amount: 102500,
    category: "Entertainment",
    wallet: "ACLEDA Bank (KHR)",
    description: "Movie tickets",
    date: new Date("2024-01-12"),
    currency: "KHR",
  },
  {
    id: "5",
    amount: 150.0,
    category: "Bills & Utilities",
    wallet: "ABA Bank (USD)",
    description: "Electricity bill",
    date: new Date("2024-01-11"),
    currency: "USD",
  },
]

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets)

  const addExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
  }

  const updateExpense = (id: string, expenseData: Omit<Expense, "id">) => {
    setExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expenseData, id } : expense)))
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  // Refresh functionality - simulate fetching fresh data
  const handleRefreshExpenses = async () => {
    // In a real app, this would fetch fresh data from an API
    // For demo purposes, we'll just simulate a delay and potentially add a new expense
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Optionally add a simulated new expense to show the refresh worked
    const shouldAddNewExpense = Math.random() > 0.7 // 30% chance
    if (shouldAddNewExpense) {
      const newExpense: Expense = {
        id: `refresh_${Date.now()}`,
        amount: Math.floor(Math.random() * 100) + 10,
        category: "Food & Dining",
        wallet: "Cash (Dollar)",
        description: "Refreshed expense",
        date: new Date(),
        currency: "USD",
      }
      setExpenses((prev) => [newExpense, ...prev])
    }
  }

  // Wallet management functions
  const addWallet = (walletData: Omit<Wallet, "id">) => {
    const newWallet: Wallet = {
      ...walletData,
      id: Date.now().toString(),
    }
    setWallets((prev) => [...prev, newWallet])
  }

  const updateWallet = (id: string, walletData: Omit<Wallet, "id">) => {
    setWallets((prev) => prev.map((wallet) => (wallet.id === id ? { ...walletData, id } : wallet)))
  }

  const deleteWallet = (id: string) => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== id))
  }

  const adjustWalletBalance = (walletId: string, amount: number, type: "add" | "subtract", reason: string) => {
    setWallets((prev) =>
      prev.map((wallet) => {
        if (wallet.id === walletId) {
          const newBalance = type === "add" ? wallet.balance + amount : wallet.balance - amount
          return { ...wallet, balance: newBalance }
        }
        return wallet
      }),
    )

    // Optionally, you could also create a transaction record for balance adjustments
    if (reason) {
      const adjustmentExpense: Expense = {
        id: `adj_${Date.now()}`,
        amount: type === "subtract" ? amount : -amount, // Negative for income/deposits
        category: type === "add" ? "Income/Deposit" : "Fees/Withdrawal",
        wallet: wallets.find((w) => w.id === walletId)?.name || "",
        description: reason,
        date: new Date(),
        currency: wallets.find((w) => w.id === walletId)?.currency || "USD",
      }

      if (type === "subtract") {
        setExpenses((prev) => [adjustmentExpense, ...prev])
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized container with proper padding */}
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header - Stack on mobile, side-by-side on larger screens */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold">Expense Tracker</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track and manage your expenses across different categories and wallets
            </p>
          </div>
          {/* Mobile-friendly button */}
          <div className="flex justify-center sm:justify-end">
            <ExpenseForm wallets={wallets} onSubmit={addExpense} />
          </div>
        </div>

        {/* Mobile-optimized tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
          {/* Scrollable tabs on mobile */}
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 min-w-[320px]">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="expenses" className="text-xs sm:text-sm">
                Expenses
              </TabsTrigger>
              <TabsTrigger value="wallets" className="text-xs sm:text-sm">
                Wallets
              </TabsTrigger>
              <TabsTrigger value="export" className="text-xs sm:text-sm">
                Export
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <ExpenseDashboard expenses={expenses} />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4 sm:space-y-6">
            <ExpenseList
              expenses={expenses}
              wallets={wallets}
              onUpdateExpense={updateExpense}
              onDeleteExpense={deleteExpense}
              onRefresh={handleRefreshExpenses}
            />
          </TabsContent>

          <TabsContent value="wallets" className="space-y-4 sm:space-y-6">
            <WalletManager
              wallets={wallets}
              expenses={expenses}
              onAddWallet={addWallet}
              onUpdateWallet={updateWallet}
              onDeleteWallet={deleteWallet}
            />
          </TabsContent>

          <TabsContent value="export" className="space-y-4 sm:space-y-6">
            <ExportSummary expenses={expenses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
