import { Skeleton } from "@/components/ui/skeleton";
import type { DailyRevenue } from "@/types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartProps {
  data: DailyRevenue[];
  loading?: boolean;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toLocaleString()}`;
}

interface TooltipPayloadEntry {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-elevated">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-display font-semibold text-accent">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

export function RevenueChart({ data, loading = false }: RevenueChartProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-5 shadow-subtle">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-3 w-28 mb-5" />
        <Skeleton className="h-52 w-full rounded-lg" />
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: formatDate(d.date),
    revenue: d.total,
    count: d.count,
  }));

  const isEmpty = data.length === 0 || data.every((d) => d.total === 0);

  // Derive colors from CSS design tokens at render time so they respect dark mode
  const primaryColor = `oklch(${getCssVar("--primary")})`;
  const mutedColor = `oklch(${getCssVar("--muted-foreground")})`;
  const borderColor = `oklch(${getCssVar("--border")})`;

  return (
    <div
      className="bg-card rounded-xl border border-border p-5 shadow-subtle"
      data-ocid="revenue-chart"
    >
      <div className="mb-5">
        <h3 className="font-display text-base font-semibold text-foreground">
          Revenue Trend
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">Last 7 days</p>
      </div>

      {isEmpty ? (
        <div className="h-52 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">No revenue data yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sales will appear here once recorded
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={208}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={borderColor}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: mutedColor }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 11, fill: mutedColor }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={primaryColor}
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={{ r: 3, fill: primaryColor, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: primaryColor, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
