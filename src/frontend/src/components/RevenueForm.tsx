import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddRevenueEntry,
  useAllCustomers,
  useUpdateRevenueEntry,
} from "@/hooks/useBackend";
import type { CreateRevenueEntryInput, RevenueEntry } from "@/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RevenueFormProps {
  entry?: RevenueEntry | null;
  onClose: () => void;
}

function toDateInput(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function fromDateInput(s: string): number {
  return new Date(s).getTime();
}

export function RevenueForm({ entry, onClose }: RevenueFormProps) {
  const { data: customers = [] } = useAllCustomers();
  const addEntry = useAddRevenueEntry();
  const updateEntry = useUpdateRevenueEntry();

  const [date, setDate] = useState(
    entry ? toDateInput(entry.date) : toDateInput(Date.now()),
  );
  const [amount, setAmount] = useState(entry ? String(entry.amount) : "");
  const [customerName, setCustomerName] = useState(entry?.customerName ?? "");
  const [customerId, setCustomerId] = useState<number>(entry?.customerId ?? 0);
  const [itemDescription, setItemDescription] = useState(
    entry?.itemDescription ?? "",
  );
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [useExistingCustomer, setUseExistingCustomer] = useState(false);

  const isEdit = !!entry;
  const isPending = addEntry.isPending || updateEntry.isPending;

  // When customer selected from dropdown, fill name field
  useEffect(() => {
    if (useExistingCustomer && customerId) {
      const c = customers.find((c) => c.id === customerId);
      if (c) setCustomerName(c.name);
    }
  }, [customerId, customers, useExistingCustomer]);

  function handleCustomerSelect(val: string) {
    const id = Number.parseInt(val, 10);
    setCustomerId(id);
    const c = customers.find((c) => c.id === id);
    if (c) setCustomerName(c.name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!itemDescription.trim()) {
      toast.error("Item description is required");
      return;
    }
    const parsedAmount = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const input: CreateRevenueEntryInput = {
      date: fromDateInput(date),
      amount: parsedAmount,
      customerId,
      customerName: customerName.trim(),
      itemDescription: itemDescription.trim(),
      notes: notes.trim(),
    };

    try {
      if (isEdit) {
        await updateEntry.mutateAsync({ id: entry.id, input });
        toast.success("Entry updated successfully");
      } else {
        await addEntry.mutateAsync(input);
        toast.success("Revenue entry added");
      }
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center"
      data-ocid="revenue-form-overlay"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg bg-card border border-border shadow-elevated rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground">
              {isEdit ? "Edit Entry" : "New Revenue Entry"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEdit
                ? "Update the revenue entry details below"
                : "Record a new sale or transaction"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close form"
            data-ocid="revenue-form-close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 px-6 py-5 overflow-y-auto"
        >
          {/* Date + Amount row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rev-date">Date</Label>
              <Input
                id="rev-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-input"
                data-ocid="revenue-form-date"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rev-amount">Amount (USD)</Label>
              <Input
                id="rev-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-input"
                data-ocid="revenue-form-amount"
                required
              />
            </div>
          </div>

          {/* Customer */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rev-customer">Customer Name</Label>
              {customers.length > 0 && (
                <button
                  type="button"
                  className="text-xs text-accent underline-offset-2 hover:underline transition-colors"
                  onClick={() => setUseExistingCustomer((v) => !v)}
                >
                  {useExistingCustomer ? "Enter manually" : "Select existing"}
                </button>
              )}
            </div>

            {useExistingCustomer && customers.length > 0 ? (
              <Select
                value={customerId ? String(customerId) : ""}
                onValueChange={handleCustomerSelect}
              >
                <SelectTrigger
                  className="bg-input"
                  data-ocid="revenue-form-customer-select"
                >
                  <SelectValue placeholder="Choose a customer…" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="rev-customer"
                type="text"
                placeholder="e.g. James Harrington"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-input"
                data-ocid="revenue-form-customer-name"
              />
            )}
          </div>

          {/* Item Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rev-item">Suit / Item Description</Label>
            <Input
              id="rev-item"
              type="text"
              placeholder="e.g. Navy Slim-Fit Two-Piece Suit"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="bg-input"
              data-ocid="revenue-form-item"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rev-notes">Notes (optional)</Label>
            <Textarea
              id="rev-notes"
              placeholder="Alterations, fitting notes, special requests…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-input resize-none min-h-[80px]"
              data-ocid="revenue-form-notes"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending}
              data-ocid="revenue-form-submit"
            >
              {isPending
                ? isEdit
                  ? "Saving…"
                  : "Adding…"
                : isEdit
                  ? "Save Changes"
                  : "Add Entry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
