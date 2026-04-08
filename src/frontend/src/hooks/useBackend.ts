import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CreateCustomerInput,
  CreateRevenueEntryInput,
  Customer,
  DailyComparison,
  DailyRevenue,
  RevenueEntry,
  RevenueSummary,
  TopCustomer,
} from "../types";

type BackendActor = {
  getRevenueSummary: () => Promise<RevenueSummary>;
  getAllRevenueEntries: () => Promise<RevenueEntry[]>;
  getRevenueByDay: () => Promise<DailyRevenue[]>;
  getDailyComparison: () => Promise<DailyComparison>;
  getMonthlyRevenue: () => Promise<DailyRevenue[]>;
  getRevenueEntriesByDateRange: (
    s: number,
    e: number,
  ) => Promise<RevenueEntry[]>;
  getRevenueEntriesByCustomer: (id: number) => Promise<RevenueEntry[]>;
  getAllCustomers: () => Promise<Customer[]>;
  getCustomer: (id: number) => Promise<Customer | null>;
  getTopCustomers: () => Promise<TopCustomer[]>;
  getCustomerTransactions: (id: number) => Promise<RevenueEntry[]>;
  searchCustomers: (q: string) => Promise<Customer[]>;
  addRevenueEntry: (i: CreateRevenueEntryInput) => Promise<RevenueEntry>;
  updateRevenueEntry: (
    id: number,
    i: Partial<CreateRevenueEntryInput>,
  ) => Promise<RevenueEntry>;
  deleteRevenueEntry: (id: number) => Promise<void>;
  addCustomer: (i: CreateCustomerInput) => Promise<Customer>;
  updateCustomer: (
    id: number,
    i: Partial<CreateCustomerInput>,
  ) => Promise<Customer>;
  deleteCustomer: (id: number) => Promise<void>;
  getPeriodMetrics: () => Promise<unknown>;
};

function useBackendActor() {
  return useActor(createActor);
}

// ─── Revenue Queries ────────────────────────────────────────────────────────

export function useRevenueSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RevenueSummary>({
    queryKey: ["revenueSummary"],
    queryFn: async () => {
      if (!actor)
        return {
          totalRevenue: 0,
          dailyTotal: 0,
          transactionCount: 0,
          averageTransactionValue: 0,
        };
      return (actor as unknown as BackendActor).getRevenueSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllRevenueEntries() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RevenueEntry[]>({
    queryKey: ["revenueEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).getAllRevenueEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRevenueByDay() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DailyRevenue[]>({
    queryKey: ["revenueByDay"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).getRevenueByDay();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDailyComparison() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DailyComparison>({
    queryKey: ["dailyComparison"],
    queryFn: async () => {
      if (!actor)
        return { today: 0, yesterday: 0, todayCount: 0, yesterdayCount: 0 };
      return (actor as unknown as BackendActor).getDailyComparison();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMonthlyRevenue() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DailyRevenue[]>({
    queryKey: ["monthlyRevenue"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).getMonthlyRevenue();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRevenueEntriesByDateRange(
  startDate: number,
  endDate: number,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RevenueEntry[]>({
    queryKey: ["revenueEntries", "range", startDate, endDate],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).getRevenueEntriesByDateRange(
        startDate,
        endDate,
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRevenueEntriesByCustomer(customerId: number) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RevenueEntry[]>({
    queryKey: ["revenueEntries", "customer", customerId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).getRevenueEntriesByCustomer(
        customerId,
      );
    },
    enabled: !!actor && !isFetching && customerId > 0,
  });
}

// ─── Customer Queries ────────────────────────────────────────────────────────

export function useAllCustomers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).getAllCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomer(id: number) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Customer | null>({
    queryKey: ["customer", id],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as unknown as BackendActor).getCustomer(id);
    },
    enabled: !!actor && !isFetching && id > 0,
  });
}

export function useTopCustomers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<TopCustomer[]>({
    queryKey: ["topCustomers"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).getTopCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomerTransactions(customerId: number) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RevenueEntry[]>({
    queryKey: ["customerTransactions", customerId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).getCustomerTransactions(
        customerId,
      );
    },
    enabled: !!actor && !isFetching && customerId > 0,
  });
}

export function useSearchCustomers(query: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Customer[]>({
    queryKey: ["customers", "search", query],
    queryFn: async () => {
      if (!actor || !query) return [];
      return (actor as unknown as BackendActor).searchCustomers(query);
    },
    enabled: !!actor && !isFetching && query.length > 0,
  });
}

// ─── Revenue Mutations ───────────────────────────────────────────────────────

export function useAddRevenueEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateRevenueEntryInput) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as BackendActor).addRevenueEntry(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["revenueEntries"] });
      qc.invalidateQueries({ queryKey: ["revenueSummary"] });
      qc.invalidateQueries({ queryKey: ["revenueByDay"] });
      qc.invalidateQueries({ queryKey: ["monthlyRevenue"] });
      qc.invalidateQueries({ queryKey: ["dailyComparison"] });
    },
  });
}

export function useUpdateRevenueEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: number; input: Partial<CreateRevenueEntryInput> }) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as BackendActor).updateRevenueEntry(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["revenueEntries"] });
      qc.invalidateQueries({ queryKey: ["revenueSummary"] });
    },
  });
}

export function useDeleteRevenueEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as BackendActor).deleteRevenueEntry(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["revenueEntries"] });
      qc.invalidateQueries({ queryKey: ["revenueSummary"] });
      qc.invalidateQueries({ queryKey: ["revenueByDay"] });
      qc.invalidateQueries({ queryKey: ["monthlyRevenue"] });
      qc.invalidateQueries({ queryKey: ["dailyComparison"] });
      qc.invalidateQueries({ queryKey: ["topCustomers"] });
    },
  });
}

// ─── Customer Mutations ──────────────────────────────────────────────────────

export function useAddCustomer() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCustomerInput) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as BackendActor).addCustomer(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useUpdateCustomer() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: number; input: Partial<CreateCustomerInput> }) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as BackendActor).updateCustomer(id, input);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customer", id] });
    },
  });
}

export function useDeleteCustomer() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as BackendActor).deleteCustomer(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useGetPeriodMetrics() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["periodMetrics"],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as unknown as BackendActor).getPeriodMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}
