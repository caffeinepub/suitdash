import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const dayNs = BigInt(86_400_000_000_000);

const customers = [
  { id: BigInt(0), name: "James Thornton", email: "james@example.com", phone: "+1 555-0101", notes: "Prefers classic cuts", totalSpent: 3090, createdAt: now - dayNs * BigInt(30), lastPurchaseDate: now - dayNs * BigInt(5) },
  { id: BigInt(1), name: "Marcus Bell", email: "marcus@example.com", phone: "+1 555-0102", notes: "VIP client", totalSpent: 7000, createdAt: now - dayNs * BigInt(60), lastPurchaseDate: now - dayNs * BigInt(2) },
  { id: BigInt(2), name: "Oliver Hayes", email: "oliver@example.com", phone: "+1 555-0103", notes: "Wedding party order", totalSpent: 6100, createdAt: now - dayNs * BigInt(45), lastPurchaseDate: now - dayNs * BigInt(1) },
  { id: BigInt(3), name: "Daniel Whitmore", email: "daniel@example.com", phone: "+1 555-0104", notes: "Corporate account", totalSpent: 2450, createdAt: now - dayNs * BigInt(20), lastPurchaseDate: now - dayNs * BigInt(4) },
  { id: BigInt(4), name: "Samuel Rivera", email: "samuel@example.com", phone: "+1 555-0105", notes: "", totalSpent: 1380, createdAt: now - dayNs * BigInt(15), lastPurchaseDate: now - dayNs * BigInt(3) },
  { id: BigInt(5), name: "Henry Caldwell", email: "henry@example.com", phone: "+1 555-0106", notes: "Tall build, custom sizing", totalSpent: 3080, createdAt: now - dayNs * BigInt(25), lastPurchaseDate: now },
];

const entries = [
  { id: BigInt(0), date: now - dayNs * BigInt(13), amount: 1250, customerId: BigInt(0), customerName: "James Thornton", itemDescription: "Classic 2-piece wool suit", notes: "", createdAt: now - dayNs * BigInt(13) },
  { id: BigInt(1), date: now - dayNs * BigInt(12), amount: 2800, customerId: BigInt(1), customerName: "Marcus Bell", itemDescription: "Bespoke 3-piece tuxedo", notes: "Rush order", createdAt: now - dayNs * BigInt(12) },
  { id: BigInt(2), date: now - dayNs * BigInt(11), amount: 950, customerId: BigInt(2), customerName: "Oliver Hayes", itemDescription: "Slim-fit navy suit", notes: "", createdAt: now - dayNs * BigInt(11) },
  { id: BigInt(3), date: now - dayNs * BigInt(10), amount: 3400, customerId: BigInt(2), customerName: "Oliver Hayes", itemDescription: "Wedding party — 4 suits", notes: "Group discount applied", createdAt: now - dayNs * BigInt(10) },
  { id: BigInt(4), date: now - dayNs * BigInt(9), amount: 1100, customerId: BigInt(3), customerName: "Daniel Whitmore", itemDescription: "Corporate grey suit", notes: "", createdAt: now - dayNs * BigInt(9) },
  { id: BigInt(5), date: now - dayNs * BigInt(8), amount: 780, customerId: BigInt(4), customerName: "Samuel Rivera", itemDescription: "Casual blazer + trousers", notes: "", createdAt: now - dayNs * BigInt(8) },
  { id: BigInt(6), date: now - dayNs * BigInt(7), amount: 1650, customerId: BigInt(1), customerName: "Marcus Bell", itemDescription: "Summer linen suit", notes: "", createdAt: now - dayNs * BigInt(7) },
  { id: BigInt(7), date: now - dayNs * BigInt(6), amount: 2100, customerId: BigInt(5), customerName: "Henry Caldwell", itemDescription: "Custom tall-fit 2-piece", notes: "Special measurements", createdAt: now - dayNs * BigInt(6) },
  { id: BigInt(8), date: now - dayNs * BigInt(5), amount: 890, customerId: BigInt(0), customerName: "James Thornton", itemDescription: "Dress shirt + tie set", notes: "", createdAt: now - dayNs * BigInt(5) },
  { id: BigInt(9), date: now - dayNs * BigInt(4), amount: 1350, customerId: BigInt(3), customerName: "Daniel Whitmore", itemDescription: "Black evening suit", notes: "", createdAt: now - dayNs * BigInt(4) },
  { id: BigInt(10), date: now - dayNs * BigInt(3), amount: 600, customerId: BigInt(4), customerName: "Samuel Rivera", itemDescription: "Waistcoat + dress trousers", notes: "", createdAt: now - dayNs * BigInt(3) },
  { id: BigInt(11), date: now - dayNs * BigInt(2), amount: 2450, customerId: BigInt(1), customerName: "Marcus Bell", itemDescription: "Winter overcoat", notes: "VIP pricing", createdAt: now - dayNs * BigInt(2) },
  { id: BigInt(12), date: now - dayNs * BigInt(1), amount: 1750, customerId: BigInt(2), customerName: "Oliver Hayes", itemDescription: "Charcoal herringbone suit", notes: "", createdAt: now - dayNs * BigInt(1) },
  { id: BigInt(13), date: now, amount: 980, customerId: BigInt(5), customerName: "Henry Caldwell", itemDescription: "Silk pocket square set", notes: "", createdAt: now },
];

export const mockBackend: backendInterface = {
  addCustomer: async (req) => ({ id: BigInt(customers.length), ...req, totalSpent: 0, createdAt: now, lastPurchaseDate: undefined }),
  addRevenueEntry: async (req) => ({ id: BigInt(entries.length), ...req, createdAt: now }),
  deleteCustomer: async () => true,
  deleteRevenueEntry: async () => true,
  getAllCustomers: async () => customers,
  getAllRevenueEntries: async () => entries,
  getCustomer: async (id) => customers.find(c => c.id === id) ?? null,
  getCustomerTransactions: async (customerId) => entries.filter(e => e.customerId === customerId),
  getDailyComparison: async () => ({ today: 980, yesterday: 1750, todayCount: BigInt(1), yesterdayCount: BigInt(1) }),
  getMonthlyRevenue: async () => 23100,
  getPeriodMetrics: async (period) => ({ period, totalRevenue: 23100, transactionCount: BigInt(14), startDate: now - dayNs * BigInt(30), endDate: now }),
  getRevenueByDay: async (days) => {
    const result: Array<{ date: bigint; total: number; count: bigint }> = [];
    for (let i = Number(days) - 1; i >= 0; i--) {
      const dayEntries = entries.filter(e => {
        const diff = Number((now - e.date) / dayNs);
        return diff === i;
      });
      result.push({ date: now - dayNs * BigInt(i), total: dayEntries.reduce((s, e) => s + e.amount, 0), count: BigInt(dayEntries.length) });
    }
    return result;
  },
  getRevenueEntriesByCustomer: async (customerId) => entries.filter(e => e.customerId === customerId),
  getRevenueEntriesByDateRange: async (filter) => entries.filter(e => e.date >= filter.from && e.date <= filter.to),
  getRevenueSummary: async () => ({ dailyTotal: 980, totalRevenue: 23100, transactionCount: BigInt(14), averageTransactionValue: 1650 }),
  getTopCustomers: async (n) => customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, Number(n)).map(c => ({ customer: c, totalSpent: c.totalSpent })),
  searchCustomers: async (nameQuery) => customers.filter(c => c.name.toLowerCase().includes(nameQuery.toLowerCase())),
  updateCustomer: async () => true,
  updateRevenueEntry: async () => true,
};
