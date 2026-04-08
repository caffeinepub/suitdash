import List "mo:core/List";
import Time "mo:core/Time";
import RevenueLib "../lib/revenue";
import CustomersLib "../lib/customers";
import RevenueTypes "../types/revenue";
import CustomerTypes "../types/customers";
import Common "../types/common";

mixin (
  entries : List.List<RevenueTypes.RevenueEntry>,
  customers : List.List<CustomerTypes.Customer>
) {
  public func addRevenueEntry(req : RevenueTypes.AddEntryRequest) : async RevenueTypes.RevenueEntry {
    let entry = RevenueLib.addEntry(entries, req);
    CustomersLib.recomputeTotals(customers, entries);
    entry;
  };

  public func updateRevenueEntry(req : RevenueTypes.UpdateEntryRequest) : async Bool {
    let ok = RevenueLib.updateEntry(entries, req);
    if (ok) { CustomersLib.recomputeTotals(customers, entries) };
    ok;
  };

  public func deleteRevenueEntry(id : Common.EntryId) : async Bool {
    let ok = RevenueLib.deleteEntry(entries, id);
    if (ok) { CustomersLib.recomputeTotals(customers, entries) };
    ok;
  };

  public query func getAllRevenueEntries() : async [RevenueTypes.RevenueEntry] {
    RevenueLib.getAllEntries(entries);
  };

  public query func getRevenueEntriesByDateRange(filter : RevenueTypes.DateRangeFilter) : async [RevenueTypes.RevenueEntry] {
    RevenueLib.getEntriesByDateRange(entries, filter);
  };

  public query func getRevenueEntriesByCustomer(customerId : Common.CustomerId) : async [RevenueTypes.RevenueEntry] {
    RevenueLib.getEntriesByCustomer(entries, customerId);
  };

  public query func getRevenueSummary() : async RevenueTypes.RevenueSummary {
    RevenueLib.getSummary(entries, Time.now());
  };

  public query func getRevenueByDay(days : Nat) : async [RevenueTypes.DailyRevenue] {
    RevenueLib.getRevenueByDay(entries, Time.now(), days);
  };
};
