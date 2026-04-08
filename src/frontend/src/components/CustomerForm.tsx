import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAddCustomer, useUpdateCustomer } from "../hooks/useBackend";
import type { CreateCustomerInput, Customer } from "../types";

interface CustomerFormProps {
  customer?: Customer | null;
  onClose: () => void;
}

export function CustomerForm({ customer, onClose }: CustomerFormProps) {
  const isEdit = !!customer;
  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();

  const [form, setForm] = useState<CreateCustomerInput>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes,
      });
    }
  }, [customer]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Customer name is required");
      return;
    }
    try {
      if (isEdit && customer) {
        await updateCustomer.mutateAsync({ id: customer.id, input: form });
        toast.success("Customer updated");
      } else {
        await addCustomer.mutateAsync(form);
        toast.success("Customer added");
      }
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const isPending = addCustomer.isPending || updateCustomer.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-1.5">
        <Label htmlFor="name" className="text-foreground font-medium">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="James Whitmore"
          data-ocid="customer-form-name"
          className="bg-input border-border"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="email" className="text-foreground font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="james@example.com"
          data-ocid="customer-form-email"
          className="bg-input border-border"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="phone" className="text-foreground font-medium">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          data-ocid="customer-form-phone"
          className="bg-input border-border"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="notes" className="text-foreground font-medium">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Prefers slim-fit, navy and charcoal tones..."
          rows={3}
          data-ocid="customer-form-notes"
          className="bg-input border-border resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end pt-2 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
          data-ocid="customer-form-cancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="customer-form-submit"
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Customer"}
        </Button>
      </div>
    </form>
  );
}
