export interface Expense {
  id: string
  amount: number
  category: string
  wallet: string
  description: string
  date: Date
  currency: string
}

export interface Wallet {
  id: string
  name: string
  balance: number
  currency: string
  exchangeRate?: number
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface Currency {
  code: string
  symbol: string
  name: string
  exchangeRate: number
}
