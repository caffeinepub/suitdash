import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AddCustomerRequest {
    name: string;
    email: string;
    notes: string;
    phone: string;
}
export type Timestamp = bigint;
export interface UpdateCustomerRequest {
    id: CustomerId;
    name: string;
    email: string;
    notes: string;
    phone: string;
}
export interface RevenueEntry {
    id: EntryId;
    customerName: string;
    itemDescription: string;
    date: Timestamp;
    createdAt: Timestamp;
    notes: string;
    customerId: CustomerId;
    amount: number;
}
export interface Customer {
    id: CustomerId;
    name: string;
    createdAt: Timestamp;
    email: string;
    lastPurchaseDate?: Timestamp;
    totalSpent: number;
    notes: string;
    phone: string;
}
export interface RevenueSummary {
    dailyTotal: number;
    averageTransactionValue: number;
    totalRevenue: number;
    transactionCount: bigint;
}
export interface DailyRevenue {
    total: number;
    date: Timestamp;
    count: bigint;
}
export interface PeriodMetrics {
    endDate: Timestamp;
    period: string;
    totalRevenue: number;
    startDate: Timestamp;
    transactionCount: bigint;
}
export interface TopCustomer {
    customer: Customer;
    totalSpent: number;
}
export interface UpdateEntryRequest {
    id: EntryId;
    customerName: string;
    itemDescription: string;
    date: Timestamp;
    notes: string;
    customerId: CustomerId;
    amount: number;
}
export type EntryId = bigint;
export interface DateRangeFilter {
    to: Timestamp;
    from: Timestamp;
}
export type CustomerId = bigint;
export interface AddEntryRequest {
    customerName: string;
    itemDescription: string;
    date: Timestamp;
    notes: string;
    customerId: CustomerId;
    amount: number;
}
export interface DailyComparison {
    today: number;
    yesterdayCount: bigint;
    yesterday: number;
    todayCount: bigint;
}
export interface backendInterface {
    addCustomer(req: AddCustomerRequest): Promise<Customer>;
    addRevenueEntry(req: AddEntryRequest): Promise<RevenueEntry>;
    deleteCustomer(id: CustomerId): Promise<boolean>;
    deleteRevenueEntry(id: EntryId): Promise<boolean>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllRevenueEntries(): Promise<Array<RevenueEntry>>;
    getCustomer(id: CustomerId): Promise<Customer | null>;
    getCustomerTransactions(customerId: CustomerId): Promise<Array<RevenueEntry>>;
    getDailyComparison(): Promise<DailyComparison>;
    getMonthlyRevenue(): Promise<number>;
    getPeriodMetrics(period: string): Promise<PeriodMetrics>;
    getRevenueByDay(days: bigint): Promise<Array<DailyRevenue>>;
    getRevenueEntriesByCustomer(customerId: CustomerId): Promise<Array<RevenueEntry>>;
    getRevenueEntriesByDateRange(filter: DateRangeFilter): Promise<Array<RevenueEntry>>;
    getRevenueSummary(): Promise<RevenueSummary>;
    getTopCustomers(n: bigint): Promise<Array<TopCustomer>>;
    searchCustomers(nameQuery: string): Promise<Array<Customer>>;
    updateCustomer(req: UpdateCustomerRequest): Promise<boolean>;
    updateRevenueEntry(req: UpdateEntryRequest): Promise<boolean>;
}
