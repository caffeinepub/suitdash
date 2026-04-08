import { RevenueForm } from "@/components/RevenueForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllRevenueEntries,
  useDeleteRevenueEntry,
} from "@/hooks/useBackend";
import type { RevenueEntry } from "@/types";
import {
  AlertCircle,
  CalendarDays,
  DollarSign,
  PencilLine,
  Plus,
  Receipt,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Skeleton rows ──────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => `sk-${i}`).map((key) => (
        <div
          key={key}
          className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0"
        >
          <Skeleton className="h-4 w-24 shrink-0" />
          <Skeleton className="h-4 w-32 shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20 shrink-0" />
          <Skeleton className="h-8 w-16 shrink-0" />
        </div>
      ))}
    </>
  );
}

// ── Delete confirm ─────────────────────────────────────────────────────────

interface DeleteConfirmProps {
  entry: RevenueEntry;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

function DeleteConfirm({
  entry,
  onCancel,
  onConfirm,
  isPending,
}: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onCancel}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div
        className="relative z-10 bg-card border border-border rounded-2xl shadow-elevated p-6 w-full max-w-sm mx-4"
        data-ocid="delete-confirm-modal"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Delete Entry?
            </h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg px-4 py-3 mb-5">
          <p className="text-sm font-medium text-foreground truncate">
            {entry.customerName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {entry.itemDescription}
          </p>
          <p className="text-sm font-semibold text-foreground mt-1">
            {fmtCurrency(entry.amount)}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="delete-confirm-btn"
          >
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Row component ──────────────────────────────────────────────────────────

interface RevenueRowProps {
  entry: RevenueEntry;
  onEdit: (e: RevenueEntry) => void;
  onDelete: (e: RevenueEntry) => void;
}

function RevenueRow({ entry, onEdit, onDelete }: RevenueRowProps) {
  return (
    <div
      className="group sm:grid sm:grid-cols-[1fr_1.5fr_2fr_1fr_auto] gap-4 px-5 py-4 hover:bg-muted/20 transition-colors duration-150 flex flex-col border-b border-border last:border-0"
      data-ocid="revenue-row"
    >
      <div className="flex items-center gap-1.5">
        <CalendarDays className="w-3.5 h-3.5 text-muted-foreground shrink-0 sm:hidden" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {fmtDate(entry.date)}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {entry.customerName}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-sm text-foreground truncate">
          {entry.itemDescription}
        </p>
        {entry.notes && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {entry.notes}
          </p>
        )}
      </div>

      <div className="flex sm:justify-end items-center">
        <span className="text-sm font-semibold font-mono text-foreground tabular-nums">
          {fmtCurrency(entry.amount)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(entry)}
          aria-label="Edit entry"
          data-ocid="revenue-row-edit"
        >
          <PencilLine className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(entry)}
          aria-label="Delete entry"
          data-ocid="revenue-row-delete"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function Revenue() {
  const { data: entries = [], isLoading } = useAllRevenueEntries();
  const deleteEntry = useDeleteRevenueEntry();

  const [formOpen, setFormOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<RevenueEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RevenueEntry | null>(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(() => {
    let list = [...entries].sort((a, b) => b.date - a.date);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.customerName.toLowerCase().includes(q) ||
          e.itemDescription.toLowerCase().includes(q),
      );
    }
    if (startDate) {
      const start = new Date(startDate).getTime();
      list = list.filter((e) => e.date >= start);
    }
    if (endDate) {
      const end = new Date(endDate).getTime() + 86_400_000 - 1;
      list = list.filter((e) => e.date <= end);
    }
    return list;
  }, [entries, search, startDate, endDate]);

  const total = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered],
  );

  const hasFilters = search || startDate || endDate;

  function clearFilters() {
    setSearch("");
    setStartDate("");
    setEndDate("");
  }

  function openEdit(entry: RevenueEntry) {
    setEditEntry(entry);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditEntry(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteEntry.mutateAsync(deleteTarget.id);
      toast.success("Entry deleted");
    } catch {
      toast.error("Failed to delete entry");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">
              Revenue Log
            </h1>
            <p className="text-muted-foreground mt-1">
              Track every sale — suits, alterations, accessories
            </p>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="gap-2 shrink-0"
            data-ocid="revenue-add-btn"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </Button>
        </div>

        {/* Filter bar */}
        <div className="bg-card border border-border rounded-xl shadow-subtle p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by customer or item…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-input"
                data-ocid="revenue-search"
              />
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-input w-36"
                aria-label="Start date filter"
                data-ocid="revenue-filter-start"
              />
              <span className="text-muted-foreground text-sm">–</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-input w-36"
                aria-label="End date filter"
                data-ocid="revenue-filter-end"
              />
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
                data-ocid="revenue-filter-clear"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </Button>
            )}
          </div>
          {hasFilters && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing {filtered.length} of {entries.length} entries
            </p>
          )}
        </div>

        {/* Table card */}
        <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
          {/* Column headers */}
          <div className="hidden sm:grid grid-cols-[1fr_1.5fr_2fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customer
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Item / Description
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
              Amount
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20 text-center">
              Actions
            </span>
          </div>

          {/* Rows */}
          <div>
            {isLoading ? (
              <SkeletonRows />
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 px-6 text-center"
                data-ocid="revenue-empty-state"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Receipt className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-1">
                  {hasFilters ? "No matches found" : "No entries yet"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {hasFilters
                    ? "Try adjusting your search or date range filters."
                    : "Record your first sale to get started tracking revenue."}
                </p>
                {!hasFilters && (
                  <Button
                    className="mt-5 gap-2"
                    onClick={() => setFormOpen(true)}
                    data-ocid="revenue-empty-add-btn"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Entry
                  </Button>
                )}
              </div>
            ) : (
              filtered.map((entry) => (
                <RevenueRow
                  key={entry.id}
                  entry={entry}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </div>

          {/* Total footer */}
          {!isLoading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="font-mono text-xs">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "entry" : "entries"}
                </Badge>
                {hasFilters && <span className="text-xs">(filtered)</span>}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total:</span>
                <span
                  className="text-xl font-display font-semibold text-foreground"
                  data-ocid="revenue-total"
                >
                  {fmtCurrency(total)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {formOpen && <RevenueForm entry={editEntry} onClose={closeForm} />}

      {deleteTarget && (
        <DeleteConfirm
          entry={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          isPending={deleteEntry.isPending}
        />
      )}
    </>
  );
}
