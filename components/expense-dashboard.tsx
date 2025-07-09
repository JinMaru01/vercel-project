"use client"

import type React from "react"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Expense } from "../types/expense"
import { mockCategories } from "../data/mock-data"
import { DownloadButton } from "./download-button"
import { CurrencyConverter } from "./currency-converter"
import { formatCurrency, convertCurrency } from "../data/currency-data"

interface ExpenseDashboardProps {
  expenses: Expense[]
}

export function ExpenseDashboard({ expenses }: ExpenseDashboardProps) {
  const currencyTotals = useMemo(() => {
    const totals = expenses.reduce(
      (acc, expense) => {
        acc[expense.currency] = (acc[expense.currency] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )
    return totals
  }, [expenses])

  const categoryTotals = useMemo(() => {
    const totals = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const totalExpenses = Object.values(totals).reduce((sum, amount) => sum + amount, 0)

    return mockCategories
      .map((category) => ({
        ...category,
        total: totals[category.name] || 0,
        percentage: totalExpenses > 0 ? ((totals[category.name] || 0) / totalExpenses) * 100 : 0,
      }))
      .filter((category) => category.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [expenses])

  // Convert all expenses to USD for unified total
  const totalInUSD = useMemo(() => {
    return expenses.reduce((sum, expense) => {
      return sum + convertCurrency(expense.amount, expense.currency, "USD")
    }, 0)
  }, [expenses])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-optimized summary cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total (USD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(totalInUSD, "USD")}</div>
            <p className="text-xs text-muted-foreground">All currencies</p>
          </CardContent>
        </Card>

        {Object.entries(currencyTotals).map(([currency, total]) => (
          <Card key={currency}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total {currency}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{formatCurrency(total, currency)}</div>
              <p className="text-xs text-muted-foreground">
                ≈{" "}
                {formatCurrency(
                  convertCurrency(total, currency, currency === "USD" ? "KHR" : "USD"),
                  currency === "USD" ? "KHR" : "USD",
                )}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Download button - full width on mobile */}
        <div className="sm:col-span-2 lg:col-span-1 flex justify-center sm:justify-end">
          <div className="w-full sm:w-auto">
            <DownloadButton expenses={expenses} />
          </div>
        </div>
      </div>

      {/* Mobile-optimized tabs */}
      <Tabs defaultValue="categories" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="categories" className="text-xs sm:text-sm">
              Categories
            </TabsTrigger>
            <TabsTrigger value="converter" className="text-xs sm:text-sm">
              Converter
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="categories">
          {/* Mobile-optimized category grid */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTotals.map((category) => (
              <Card key={category.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{category.icon}</span>
                      <span className="truncate">{category.name}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{formatCurrency(category.total, "USD")}</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{category.percentage.toFixed(1)}% of total</span>
                    </div>
                    <Progress
                      value={category.percentage}
                      className="h-2"
                      style={
                        {
                          "--progress-background": category.color,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="converter">
          <CurrencyConverter />
        </TabsContent>
      </Tabs>
    </div>
  )
}
