import Common "common";

module {
  public type RevenueEntry = {
    id : Common.EntryId;
    date : Common.Timestamp;
    amount : Float;
    customerId : Common.CustomerId;
    customerName : Text;
    itemDescription : Text;
    notes : Text;
    createdAt : Common.Timestamp;
  };

  public type AddEntryRequest = {
    date : Common.Timestamp;
    amount : Float;
    customerId : Common.CustomerId;
    customerName : Text;
    itemDescription : Text;
    notes : Text;
  };

  public type UpdateEntryRequest = {
    id : Common.EntryId;
    date : Common.Timestamp;
    amount : Float;
    customerId : Common.CustomerId;
    customerName : Text;
    itemDescription : Text;
    notes : Text;
  };

  public type RevenueSummary = {
    totalRevenue : Float;
    dailyTotal : Float;
    transactionCount : Nat;
    averageTransactionValue : Float;
  };

  public type DailyRevenue = {
    date : Common.Timestamp;
    total : Float;
    count : Nat;
  };

  public type DateRangeFilter = {
    from : Common.Timestamp;
    to : Common.Timestamp;
  };
};
