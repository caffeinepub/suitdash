import Common "common";
import Customers "customers";

module {
  public type TopCustomer = {
    customer : Customers.Customer;
    totalSpent : Float;
  };

  public type DailyComparison = {
    today : Float;
    yesterday : Float;
    todayCount : Nat;
    yesterdayCount : Nat;
  };

  public type PeriodMetrics = {
    period : Text;
    totalRevenue : Float;
    transactionCount : Nat;
    startDate : Common.Timestamp;
    endDate : Common.Timestamp;
  };
};
