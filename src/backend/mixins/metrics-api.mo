import List "mo:core/List";
import Time "mo:core/Time";
import MetricsLib "../lib/metrics";
import MetricsTypes "../types/metrics";
import CustomerTypes "../types/customers";
import RevenueTypes "../types/revenue";

mixin (
  customers : List.List<CustomerTypes.Customer>,
  entries : List.List<RevenueTypes.RevenueEntry>
) {
  public query func getTopCustomers(n : Nat) : async [MetricsTypes.TopCustomer] {
    MetricsLib.getTopCustomers(customers, n);
  };

  public query func getDailyComparison() : async MetricsTypes.DailyComparison {
    MetricsLib.getDailyComparison(entries, Time.now());
  };

  public query func getMonthlyRevenue() : async Float {
    MetricsLib.getMonthlyRevenue(entries, Time.now());
  };

  public query func getPeriodMetrics(period : Text) : async MetricsTypes.PeriodMetrics {
    MetricsLib.getPeriodMetrics(entries, Time.now(), period);
  };
};
