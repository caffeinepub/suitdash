import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomerDetail } from "../components/CustomerDetail";
import { CustomerForm } from "../components/CustomerForm";
import { useAllCustomers, useDeleteCustomer } from "../hooks/useBackend";
import type { Customer } from "../types";

function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function CustomerSkeleton() {
  return (
    <div className="grid gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function Customers() {
  const { data: customers, isLoading } = useAllCustomers();
  const deleteCustomer = useDeleteCustomer();

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = (customers ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  function openAddForm() {
    setEditCustomer(null);
    setFormOpen(true);
  }

  function openEditForm(customer: Customer) {
    setEditCustomer(customer);
    setDetailOpen(false);
    setFormOpen(true);
  }

  function openDetail(customer: Customer) {
    setSelectedCustomer(customer);
    setDetailOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCustomer.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.name} deleted`);
      if (selectedCustomer?.id === deleteTarget.id) {
        setDetailOpen(false);
        setSelectedCustomer(null);
      }
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Customers
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {customers
                  ? `${customers.length} clients on record`
                  : "Loading…"}
              </p>
            </div>
            <Button
              onClick={openAddForm}
              data-ocid="customers-add-btn"
              className="gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers…"
              className="pl-9 bg-input border-border"
              data-ocid="customers-search"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <CustomerSkeleton />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="customers-empty-state"
          >
            <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mb-5">
              <Users className="w-9 h-9 text-muted-foreground opacity-50" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              {search ? "No customers found" : "No customers yet"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              {search
                ? `No results match "${search}". Try a different name.`
                : "Start building your client list. Add your first customer to track purchases and history."}
            </p>
            {!search && (
              <Button
                onClick={openAddForm}
                data-ocid="customers-empty-add-btn"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Customer
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence initial={false}>
              {filtered.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                >
                  <button
                    type="button"
                    className="group w-full flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 hover:border-primary/30 hover:shadow-elevated transition-smooth cursor-pointer text-left"
                    onClick={() => openDetail(customer)}
                    data-ocid="customers-row"
                    aria-label={`View ${customer.name}`}
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <span className="font-display text-sm font-semibold text-primary">
                        {getInitials(customer.name)}
                      </span>
                    </div>

                    {/* Name + contact */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {customer.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {customer.email && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[160px]">
                              {customer.email}
                            </span>
                          </span>
                        )}
                        {customer.phone && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                      <Badge
                        variant="secondary"
                        className="font-semibold text-xs"
                      >
                        {formatUSD(customer.totalSpent)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last: {formatDate(customer.lastPurchaseDate)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth shrink-0"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditForm(customer)}
                        aria-label={`Edit ${customer.name}`}
                        data-ocid="customers-edit-btn"
                      >
                        <UserRound className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(customer)}
                        aria-label={`Delete ${customer.name}`}
                        data-ocid="customers-delete-btn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) setFormOpen(false);
        }}
      >
        <DialogContent className="max-w-md" data-ocid="customer-form-dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editCustomer ? "Edit Customer" : "New Customer"}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={editCustomer}
            onClose={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent
          side="right"
          className="p-0 w-full sm:max-w-md flex flex-col"
          data-ocid="customer-detail-sheet"
        >
          {selectedCustomer && (
            <CustomerDetail
              customer={selectedCustomer}
              onClose={() => setDetailOpen(false)}
              onEdit={openEditForm}
            />
          )}
        </SheetContent>
      </Sheet>
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="customer-delete-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.name}</strong>{" "}
              and all their data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="customer-delete-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="customer-delete-confirm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
