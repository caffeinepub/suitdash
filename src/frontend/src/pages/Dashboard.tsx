import { Skeleton } from "@/components/ui/skeleton";
import {
  useDailyComparison,
  useMonthlyRevenue,
  useRevenueByDay,
  useRevenueSummary,
  useTopCustomers,
} from "@/hooks/useBackend";
import type { TopCustomer } from "@/types";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Crown,
  DollarSign,
  Minus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { RevenueChart } from "../components/RevenueChart";

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

function pctChange(today: number, yesterday: number): number | undefined {
  if (yesterday === 0) return undefined;
  return ((today - yesterday) / yesterday) * 100;
}

function DailyComparisonRow({
  label,
  today,
  yesterday,
}: {
  label: string;
  today: number;
  yesterday: number;
}) {
  const diff = today - yesterday;
  const pct = yesterday !== 0 ? (diff / yesterday) * 100 : null;
  const up = diff > 0;
  const neutral = diff === 0;

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="text-xs text-muted-foreground block">Yesterday</span>
          <span className="text-sm font-medium text-foreground">
            {formatCurrency(yesterday)}
          </span>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-right min-w-[70px]">
          <span className="text-xs text-muted-foreground block">Today</span>
          <span className="text-sm font-display font-semibold text-accent">
            {formatCurrency(today)}
          </span>
        </div>
        <div className="w-8 flex justify-center">
          {neutral ? (
            <Minus className="w-4 h-4 text-muted-foreground" />
          ) : up ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-destructive" />
          )}
        </div>
        {pct !== null && (
          <span
            className={`text-xs font-semibold w-12 text-right ${up ? "text-emerald-600" : "text-destructive"}`}
          >
            {up ? "+" : ""}
            {pct.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function TopCustomerRow({ rank, item }: { rank: number; item: TopCustomer }) {
  const initials = item.customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
      data-ocid="top-customer-row"
    >
      <span className="text-xs font-semibold text-muted-foreground w-5 text-center">
        {rank}
      </span>
      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-semibold text-accent">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {item.customer.name}
        </p>
        {item.customer.email && (
          <p className="text-xs text-muted-foreground truncate">
            {item.customer.email}
          </p>
        )}
      </div>
      <span className="text-sm font-display font-semibold text-accent flex-shrink-0">
        {formatCurrency(item.totalSpent)}
      </span>
      {rank === 1 && (
        <Crown className="w-3.5 h-3.5 text-accent flex-shrink-0" />
      )}
    </div>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useRevenueSummary();
  const { data: dailyData, isLoading: dailyLoading } = useRevenueByDay();
  const { data: comparison, isLoading: compLoading } = useDailyComparison();
  const { data: topCustomers, isLoading: topLoading } = useTopCustomers();
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyRevenue();

  const monthlyTotal = monthlyData?.reduce((acc, d) => acc + d.total, 0) ?? 0;
  const monthlyTarget = 50000;
  const monthlyPct = Math.min(100, (monthlyTotal / monthlyTarget) * 100);

  const revenueTrend = comparison
    ? pctChange(comparison.today, comparison.yesterday)
    : undefined;
  const countTrend = comparison
    ? pctChange(comparison.todayCount, comparison.yesterdayCount)
    : undefined;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8" data-ocid="dashboard-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Revenue"
          value={formatCurrency(summary?.dailyTotal ?? 0)}
          trend={revenueTrend}
          subtext="vs. yesterday"
          icon={<DollarSign className="w-4 h-4" />}
          highlight
          loading={summaryLoading}
          data-ocid="metric-today-revenue"
        />
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          subtext="All time"
          icon={<TrendingUp className="w-4 h-4" />}
          loading={summaryLoading}
          data-ocid="metric-total-revenue"
        />
        <MetricCard
          title="Transactions"
          value={String(summary?.transactionCount ?? 0)}
          trend={countTrend}
          subtext="This month"
          icon={<ShoppingBag className="w-4 h-4" />}
          loading={summaryLoading}
          data-ocid="metric-transactions"
        />
        <MetricCard
          title="Avg. Sale Value"
          value={formatCurrency(summary?.averageTransactionValue ?? 0)}
          subtext="Per transaction"
          icon={<BarChart3 className="w-4 h-4" />}
          loading={summaryLoading}
          data-ocid="metric-avg-sale"
        />
      </div>

      {/* Chart + Top Customers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={dailyData ?? []} loading={dailyLoading} />
        </div>

        {/* Top Customers */}
        <div
          className="bg-card rounded-xl border border-border p-5 shadow-subtle"
          data-ocid="top-customers-panel"
        >
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-foreground">
              Top Customers
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              By total spend
            </p>
          </div>

          {topLoading ? (
            <div className="space-y-3">
              {(["s1", "s2", "s3", "s4", "s5"] as const).map((k) => (
                <div key={k} className="flex items-center gap-3 py-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : !topCustomers?.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Crown className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No customers yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add your first sale to see top customers
              </p>
            </div>
          ) : (
            <div>
              {topCustomers.slice(0, 5).map((item, i) => (
                <TopCustomerRow
                  key={item.customer.id}
                  rank={i + 1}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Comparison + Monthly Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Daily Comparison */}
        <div
          className="bg-card rounded-xl border border-border p-5 shadow-subtle"
          data-ocid="daily-comparison-panel"
        >
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-foreground">
              Daily Comparison
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Today vs. yesterday
            </p>
          </div>

          {compLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          ) : (
            <div>
              <DailyComparisonRow
                label="Revenue"
                today={comparison?.today ?? 0}
                yesterday={comparison?.yesterday ?? 0}
              />
              <DailyComparisonRow
                label="Transactions"
                today={comparison?.todayCount ?? 0}
                yesterday={comparison?.yesterdayCount ?? 0}
              />
            </div>
          )}
        </div>

        {/* Monthly Progress */}
        <div
          className="bg-card rounded-xl border border-border p-5 shadow-subtle"
          data-ocid="monthly-progress-panel"
        >
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-foreground">
              Monthly Progress
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {monthlyLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-2.5 w-full rounded-full" />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-2xl font-display font-semibold text-accent">
                    {formatCurrency(monthlyTotal)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    of {formatCurrency(monthlyTarget)} target
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {monthlyPct.toFixed(0)}%
                </span>
              </div>

              <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${monthlyPct}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-semibold text-foreground">
                    {monthlyData?.length ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Active Days
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-semibold text-foreground">
                    {monthlyData?.reduce((a, d) => a + d.count, 0) ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sales</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-semibold text-accent">
                    {formatCurrency(
                      (monthlyData?.length ?? 0) > 0
                        ? monthlyTotal / (monthlyData?.length ?? 1)
                        : 0,
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Daily Avg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
