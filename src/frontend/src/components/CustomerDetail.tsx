import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Mail,
  Phone,
  ReceiptText,
  StickyNote,
  TrendingUp,
  X,
} from "lucide-react";
import { useCustomerTransactions } from "../hooks/useBackend";
import type { Customer } from "../types";

interface CustomerDetailProps {
  customer: Customer;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CustomerDetail({
  customer,
  onClose,
  onEdit,
}: CustomerDetailProps) {
  const { data: transactions, isLoading } = useCustomerTransactions(
    customer.id,
  );

  const totalSpent = transactions
    ? transactions.reduce((sum, t) => sum + t.amount, 0)
    : customer.totalSpent;

  const lastPurchase =
    transactions && transactions.length > 0
      ? Math.max(...transactions.map((t) => t.date))
      : customer.lastPurchaseDate;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-6 bg-card border-b border-border">
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-semibold text-foreground truncate">
            {customer.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customer Profile
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close panel"
          data-ocid="customer-detail-close"
          className="ml-2 shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-accent-foreground opacity-60" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Total Spent
                </span>
              </div>
              <p className="text-lg font-semibold text-foreground font-display">
                {formatUSD(totalSpent)}
              </p>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-4 h-4 text-accent-foreground opacity-60" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Last Purchase
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {lastPurchase ? formatDate(lastPurchase) : "—"}
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Contact
            </h3>
            {customer.email && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground break-all">
                  {customer.email}
                </span>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">
                  {customer.phone}
                </span>
              </div>
            )}
            {!customer.email && !customer.phone && (
              <p className="text-sm text-muted-foreground italic">
                No contact info on file
              </p>
            )}
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <StickyNote className="w-3.5 h-3.5" /> Notes
              </h3>
              <p className="text-sm text-foreground bg-muted/40 rounded-lg p-3 border border-border leading-relaxed">
                {customer.notes}
              </p>
            </div>
          )}

          <Separator />

          {/* Transaction history */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <ReceiptText className="w-3.5 h-3.5" /> Purchase History
              </h3>
              {transactions && (
                <Badge variant="secondary" className="text-xs">
                  {transactions.length}{" "}
                  {transactions.length === 1 ? "order" : "orders"}
                </Badge>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-2">
                {[...transactions]
                  .sort((a, b) => b.date - a.date)
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-start justify-between gap-3 bg-card border border-border rounded-lg p-3.5 hover:bg-muted/30 transition-colors"
                      data-ocid="customer-transaction-row"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {tx.itemDescription}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground shrink-0">
                        {formatUSD(tx.amount)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ReceiptText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No purchases yet</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer action */}
      <div className="p-4 border-t border-border bg-card">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onEdit(customer)}
          data-ocid="customer-detail-edit"
        >
          Edit Customer
        </Button>
      </div>
    </div>
  );
}
