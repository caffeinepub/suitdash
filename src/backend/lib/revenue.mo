import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Types "../types/revenue";
import Common "../types/common";

module {
  // 1 nanosecond per nanosecond; 1 day in nanoseconds
  let dayNs : Int = 86_400_000_000_000;

  func startOfDay(ts : Common.Timestamp) : Common.Timestamp {
    ts - (ts % dayNs);
  };

  public func addEntry(
    entries : List.List<Types.RevenueEntry>,
    req : Types.AddEntryRequest,
  ) : Types.RevenueEntry {
    let id = entries.size();
    let now = Time.now();
    let entry : Types.RevenueEntry = {
      id;
      date = req.date;
      amount = req.amount;
      customerId = req.customerId;
      customerName = req.customerName;
      itemDescription = req.itemDescription;
      notes = req.notes;
      createdAt = now;
    };
    entries.add(entry);
    entry;
  };

  public func updateEntry(
    entries : List.List<Types.RevenueEntry>,
    req : Types.UpdateEntryRequest,
  ) : Bool {
    var found = false;
    entries.mapInPlace(func(e) {
      if (e.id == req.id) {
        found := true;
        {
          e with
          date = req.date;
          amount = req.amount;
          customerId = req.customerId;
          customerName = req.customerName;
          itemDescription = req.itemDescription;
          notes = req.notes;
        };
      } else {
        e;
      };
    });
    found;
  };

  public func deleteEntry(
    entries : List.List<Types.RevenueEntry>,
    id : Common.EntryId,
  ) : Bool {
    let before = entries.size();
    let filtered = entries.filter(func(e) { e.id != id });
    entries.clear();
    entries.append(filtered);
    entries.size() < before;
  };

  public func getAllEntries(
    entries : List.List<Types.RevenueEntry>,
  ) : [Types.RevenueEntry] {
    entries.toArray();
  };

  public func getEntriesByDateRange(
    entries : List.List<Types.RevenueEntry>,
    filter : Types.DateRangeFilter,
  ) : [Types.RevenueEntry] {
    entries.filter(func(e) { e.date >= filter.from and e.date <= filter.to }).toArray();
  };

  public func getEntriesByCustomer(
    entries : List.List<Types.RevenueEntry>,
    customerId : Common.CustomerId,
  ) : [Types.RevenueEntry] {
    entries.filter(func(e) { e.customerId == customerId }).toArray();
  };

  public func getSummary(
    entries : List.List<Types.RevenueEntry>,
    now : Common.Timestamp,
  ) : Types.RevenueSummary {
    let todayStart = startOfDay(now);
    var totalRevenue : Float = 0.0;
    var dailyTotal : Float = 0.0;
    var count = entries.size();
    entries.forEach(func(e) {
      totalRevenue += e.amount;
      if (e.date >= todayStart) {
        dailyTotal += e.amount;
      };
    });
    let avg = if (count == 0) 0.0 else totalRevenue / count.toFloat();
    {
      totalRevenue;
      dailyTotal;
      transactionCount = count;
      averageTransactionValue = avg;
    };
  };

  public func getRevenueByDay(
    entries : List.List<Types.RevenueEntry>,
    now : Common.Timestamp,
    days : Nat,
  ) : [Types.DailyRevenue] {
    // Build a result array for each of the last `days` days
    let result = Array.tabulate(days, func(i) {
      let daysBack = (days - 1 - i) : Int;
      let dayStart = startOfDay(now) - (daysBack * dayNs);
      let dayEnd = dayStart + dayNs;
      var total : Float = 0.0;
      var cnt : Nat = 0;
      entries.forEach(func(e) {
        if (e.date >= dayStart and e.date < dayEnd) {
          total += e.amount;
          cnt += 1;
        };
      });
      { date = dayStart; total; count = cnt };
    });
    result;
  };
};
