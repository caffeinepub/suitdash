export interface RevenueEntry {
  id: number;
  date: number;
  amount: number;
  customerId: number;
  customerName: string;
  itemDescription: string;
  notes: string;
  createdAt: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
  totalSpent: number;
  lastPurchaseDate?: number;
  createdAt: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  dailyTotal: number;
  transactionCount: number;
  averageTransactionValue: number;
}

export interface DailyRevenue {
  date: number;
  total: number;
  count: number;
}

export interface DailyComparison {
  today: number;
  yesterday: number;
  todayCount: number;
  yesterdayCount: number;
}

export interface TopCustomer {
  customer: Customer;
  totalSpent: number;
}

export interface CreateRevenueEntryInput {
  date: number;
  amount: number;
  customerId: number;
  customerName: string;
  itemDescription: string;
  notes: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export type NavItem = {
  label: string;
  path: string;
  icon: string;
};
