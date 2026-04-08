import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: number; // percentage change, positive = up
  icon?: React.ReactNode;
  highlight?: boolean; // gold accent treatment
  loading?: boolean;
  "data-ocid"?: string;
}

export function MetricCard({
  title,
  value,
  subtext,
  trend,
  icon,
  highlight = false,
  loading = false,
  "data-ocid": ocid,
}: MetricCardProps) {
  const trendPositive = trend !== undefined && trend >= 0;
  const trendNeutral = trend === undefined;

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border shadow-subtle">
        <Skeleton className="h-4 w-28 mb-4" />
        <Skeleton className="h-9 w-36 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  return (
    <div
      data-ocid={ocid}
      className={cn(
        "bg-card rounded-xl p-5 border shadow-subtle transition-smooth hover:shadow-elevated group",
        highlight ? "border-accent/40" : "border-border",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          {title}
        </p>
        {icon && (
          <span
            className={cn(
              "p-2 rounded-lg text-sm",
              highlight
                ? "bg-accent/10 text-accent"
                : "bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <p
        className={cn(
          "text-3xl font-display font-semibold leading-none mb-2 tracking-tight",
          highlight ? "text-accent" : "text-foreground",
        )}
      >
        {value}
      </p>

      <div className="flex items-center gap-2 min-h-[1.25rem]">
        {!trendNeutral && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold",
              trendPositive ? "text-emerald-600" : "text-destructive",
            )}
          >
            {trendPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trendPositive ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
        )}
        {subtext && (
          <span className="text-xs text-muted-foreground">{subtext}</span>
        )}
      </div>
    </div>
  );
}
