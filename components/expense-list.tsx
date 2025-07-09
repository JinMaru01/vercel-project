"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, Edit, MoreVertical, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Expense, Wallet } from "../types/expense"
import { mockCategories } from "../data/mock-data"
import { ExpenseForm } from "./expense-form"
import { DownloadButton } from "./download-button"
import { formatCurrency } from "../data/currency-data"
import { usePullToRefresh } from "../hooks/use-pull-to-refresh"
import { PullToRefreshIndicator } from "./pull-to-refresh-indicator"
import { cn } from "@/lib/utils"

interface ExpenseListProps {
  expenses: Expense[]
  wallets: Wallet[]
  onUpdateExpense: (id: string, expense: Omit<Expense, "id">) => void
  onDeleteExpense: (id: string) => void
  onRefresh?: () => Promise<void> | void
}

export function ExpenseList({ expenses, wallets, onUpdateExpense, onDeleteExpense, onRefresh }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [walletFilter, setWalletFilter] = useState("all")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Pull-to-refresh functionality
  const handleRefresh = async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (onRefresh) {
      await onRefresh()
    }

    setLastRefresh(new Date())
  }

  const { containerRef, isPulling, isRefreshing, pullDistance, canRefresh } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5,
    enabled: true,
  })

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
    const matchesWallet = walletFilter === "all" || expense.wallet === walletFilter

    return matchesSearch && matchesCategory && matchesWallet
  })

  const getCategoryIcon = (categoryName: string) => {
    const category = mockCategories.find((cat) => cat.name === categoryName)
    return category?.icon || "💰"
  }

  const getCategoryColor = (categoryName: string) => {
    const category = mockCategories.find((cat) => cat.name === categoryName)
    return category?.color || "#6b7280"
  }

  // Mobile card view for expenses
  const MobileExpenseCard = ({ expense }: { expense: Expense }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              style={{
                backgroundColor: `${getCategoryColor(expense.category)}20`,
                color: getCategoryColor(expense.category),
                border: `1px solid ${getCategoryColor(expense.category)}40`,
              }}
            >
              {getCategoryIcon(expense.category)} {expense.category}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <ExpenseForm
                  expense={expense}
                  wallets={wallets}
                  onSubmit={(updatedExpense) => onUpdateExpense(expense.id, updatedExpense)}
                  trigger={
                    <div className="flex items-center gap-2 w-full cursor-pointer">
                      <Edit className="h-4 w-4" />
                      Edit
                    </div>
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteExpense(expense.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{expense.date.toLocaleDateString()}</span>
            <span className="font-bold text-lg">{formatCurrency(expense.amount, expense.currency)}</span>
          </div>

          <div className="text-sm">
            <p className="font-medium truncate">{expense.description || "No description"}</p>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-xs">
              {expense.wallet} ({expense.currency})
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <CardTitle className="text-center sm:text-left">Recent Expenses</CardTitle>
            {/* Manual refresh button for desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <span className="text-xs text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <DownloadButton
              expenses={expenses}
              filteredExpenses={filteredExpenses}
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              walletFilter={walletFilter}
              showFilteredOption={true}
            />
          </div>
        </div>

        {/* Mobile-optimized filters */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={walletFilter} onValueChange={setWalletFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Wallet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wallets</SelectItem>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.name}>
                    {wallet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Last refresh indicator for mobile */}
        <div className="block sm:hidden text-center">
          <span className="text-xs text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile view - Cards with pull-to-refresh */}
        <div className="block sm:hidden">
          <div
            ref={containerRef}
            className={cn(
              "relative overflow-y-auto max-h-[60vh]",
              "touch-pan-y", // Enable vertical panning
            )}
            style={{
              WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
            }}
          >
            {/* Pull-to-refresh indicator */}
            {(isPulling || isRefreshing) && (
              <div className="absolute top-0 left-0 right-0 z-10">
                <PullToRefreshIndicator
                  pullDistance={pullDistance}
                  threshold={80}
                  isRefreshing={isRefreshing}
                  canRefresh={canRefresh}
                />
              </div>
            )}

            {/* Content with proper spacing for pull indicator */}
            <div
              className={cn(
                "transition-transform duration-200 ease-out",
                isPulling && "transform-gpu", // Use GPU acceleration during pull
              )}
              style={{
                transform: isPulling ? `translateY(${Math.min(pullDistance, 100)}px)` : "translateY(0)",
              }}
            >
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No expenses found</p>
                  <p className="text-xs mt-2">Pull down to refresh</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExpenses.map((expense) => (
                    <MobileExpenseCard key={expense.id} expense={expense} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop view - Table */}
        <div className="hidden sm:block">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${getCategoryColor(expense.category)}20`,
                            color: getCategoryColor(expense.category),
                            border: `1px solid ${getCategoryColor(expense.category)}40`,
                          }}
                        >
                          {getCategoryIcon(expense.category)} {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {expense.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {expense.wallet} ({expense.currency})
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(expense.amount, expense.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <ExpenseForm
                            expense={expense}
                            wallets={wallets}
                            onSubmit={(updatedExpense) => onUpdateExpense(expense.id, updatedExpense)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteExpense(expense.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
