"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Trash2, TrendingUp, TrendingDown, Edit, MoreVertical, WalletIcon } from "lucide-react"
import type { Wallet as WalletType, Expense } from "../types/expense"
import { WalletForm } from "./wallet-form"
import { formatCurrency, convertCurrency } from "../data/currency-data"

interface WalletManagerProps {
  wallets: WalletType[]
  expenses: Expense[]
  onAddWallet: (wallet: Omit<WalletType, "id">) => void
  onUpdateWallet: (id: string, wallet: Omit<WalletType, "id">) => void
  onDeleteWallet: (id: string) => void
}

export function WalletManager({ wallets, expenses, onAddWallet, onUpdateWallet, onDeleteWallet }: WalletManagerProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  // Calculate wallet statistics
  const getWalletStats = (wallet: WalletType) => {
    const walletExpenses = expenses.filter((expense) => expense.wallet === wallet.name)
    const totalSpent = walletExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const currentBalance = wallet.balance - totalSpent
    const transactionCount = walletExpenses.length

    return {
      totalSpent,
      currentBalance,
      transactionCount,
      initialBalance: wallet.balance,
    }
  }

  // Calculate total portfolio value in USD
  const totalPortfolioUSD = wallets.reduce((sum, wallet) => {
    const stats = getWalletStats(wallet)
    return sum + convertCurrency(stats.currentBalance, wallet.currency, "USD")
  }, 0)

  const canDeleteWallet = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (!wallet) return false
    return !expenses.some((expense) => expense.wallet === wallet.name)
  }

  // Mobile card view for wallets
  const MobileWalletCard = ({ wallet }: { wallet: WalletType }) => {
    const stats = getWalletStats(wallet)
    const isNegative = stats.currentBalance < 0

    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{wallet.name}</span>
              <Badge variant="outline">{wallet.currency}</Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <WalletForm
                    wallet={wallet}
                    onSubmit={(updatedWallet) => onUpdateWallet(wallet.id, updatedWallet)}
                    trigger={
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <Edit className="h-4 w-4" />
                        Edit
                      </div>
                    }
                  />
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDeleteWallet(wallet.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex items-center gap-2 w-full">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Wallet</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{wallet.name}"? This action cannot be undone.
                          {!canDeleteWallet(wallet.id) && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                              This wallet cannot be deleted because it has associated transactions.
                            </div>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteWallet(wallet.id)}
                          disabled={!canDeleteWallet(wallet.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Initial Balance</p>
              <p className="font-medium">{formatCurrency(stats.initialBalance, wallet.currency)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Spent</p>
              <p className="font-medium text-red-600">
                {stats.totalSpent > 0 ? `-${formatCurrency(stats.totalSpent, wallet.currency)}` : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Balance</p>
              <div className="flex items-center gap-1">
                {isNegative ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
                <span className={`font-medium ${isNegative ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(Math.abs(stats.currentBalance), wallet.currency)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Transactions</p>
              <Badge variant="secondary">{stats.transactionCount}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Portfolio Overview - Mobile optimized grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{wallets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(totalPortfolioUSD, "USD")}</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USD Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{wallets.filter((w) => w.currency === "USD").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KHR Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{wallets.filter((w) => w.currency === "KHR").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <CardTitle className="text-center sm:text-left">Manage Wallets</CardTitle>
            <div className="flex justify-center sm:justify-end">
              <WalletForm onSubmit={onAddWallet} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile view - Cards */}
          <div className="block lg:hidden">
            {wallets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No wallets found. Create your first wallet to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <MobileWalletCard key={wallet.id} wallet={wallet} />
                ))}
              </div>
            )}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden lg:block">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet Name</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Initial Balance</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead className="text-right">Current Balance</TableHead>
                    <TableHead className="text-center">Transactions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No wallets found. Create your first wallet to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    wallets.map((wallet) => {
                      const stats = getWalletStats(wallet)
                      const isNegative = stats.currentBalance < 0

                      return (
                        <TableRow key={wallet.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <WalletIcon className="h-4 w-4 text-muted-foreground" />
                              {wallet.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{wallet.currency}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(stats.initialBalance, wallet.currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            {stats.totalSpent > 0 ? (
                              <span className="text-red-600">-{formatCurrency(stats.totalSpent, wallet.currency)}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {isNegative ? (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              )}
                              <span className={isNegative ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                                {formatCurrency(Math.abs(stats.currentBalance), wallet.currency)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{stats.transactionCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <WalletForm
                                wallet={wallet}
                                onSubmit={(updatedWallet) => onUpdateWallet(wallet.id, updatedWallet)}
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={!canDeleteWallet(wallet.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Wallet</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{wallet.name}"? This action cannot be undone.
                                      {!canDeleteWallet(wallet.id) && (
                                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                                          This wallet cannot be deleted because it has associated transactions.
                                        </div>
                                      )}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => onDeleteWallet(wallet.id)}
                                      disabled={!canDeleteWallet(wallet.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
