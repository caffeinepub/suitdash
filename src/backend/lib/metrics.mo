import List "mo:core/List";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Order "mo:core/Order";
import MetricsTypes "../types/metrics";
import CustomerTypes "../types/customers";
import RevenueTypes "../types/revenue";
import Common "../types/common";

module {
  let dayNs : Int = 86_400_000_000_000;
  let weekNs : Int = 604_800_000_000_000;

  func startOfDay(ts : Common.Timestamp) : Common.Timestamp {
    ts - (ts % dayNs);
  };

  func compareCustomerBySpent(a : CustomerTypes.Customer, b : CustomerTypes.Customer) : Order.Order {
    Float.compare(b.totalSpent, a.totalSpent) // descending
  };

  public func getTopCustomers(
    customers : List.List<CustomerTypes.Customer>,
    n : Nat,
  ) : [MetricsTypes.TopCustomer] {
    let arr = customers.toArray();
    let sorted = arr.sort(compareCustomerBySpent);
    let take = if (n < sorted.size()) n else sorted.size();
    Array.tabulate<MetricsTypes.TopCustomer>(take, func(i) {
      { customer = sorted[i]; totalSpent = sorted[i].totalSpent };
    });
  };

  public func getDailyComparison(
    entries : List.List<RevenueTypes.RevenueEntry>,
    now : Common.Timestamp,
  ) : MetricsTypes.DailyComparison {
    let todayStart = startOfDay(now);
    let yesterdayStart = todayStart - dayNs;
    var today : Float = 0.0;
    var yesterday : Float = 0.0;
    var todayCount : Nat = 0;
    var yesterdayCount : Nat = 0;
    entries.forEach(func(e) {
      if (e.date >= todayStart) {
        today += e.amount;
        todayCount += 1;
      } else if (e.date >= yesterdayStart) {
        yesterday += e.amount;
        yesterdayCount += 1;
      };
    });
    { today; yesterday; todayCount; yesterdayCount };
  };

  public func getMonthlyRevenue(
    entries : List.List<RevenueTypes.RevenueEntry>,
    now : Common.Timestamp,
  ) : Float {
    let monthStart = startOfDay(now) - (29 * dayNs);
    var total : Float = 0.0;
    entries.forEach(func(e) {
      if (e.date >= monthStart) { total += e.amount };
    });
    total;
  };

  public func getPeriodMetrics(
    entries : List.List<RevenueTypes.RevenueEntry>,
    now : Common.Timestamp,
    period : Text,
  ) : MetricsTypes.PeriodMetrics {
    let todayStart = startOfDay(now);
    let (startDate, endDate) = if (period == "daily") {
      (todayStart, todayStart + dayNs);
    } else if (period == "weekly") {
      (todayStart - weekNs, todayStart + dayNs);
    } else {
      // monthly — last 30 days
      (todayStart - (29 * dayNs), todayStart + dayNs);
    };
    var total : Float = 0.0;
    var count : Nat = 0;
    entries.forEach(func(e) {
      if (e.date >= startDate and e.date < endDate) {
        total += e.amount;
        count += 1;
      };
    });
    { period; totalRevenue = total; transactionCount = count; startDate; endDate };
  };
};
