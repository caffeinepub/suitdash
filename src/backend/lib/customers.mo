import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/customers";
import RevenueTypes "../types/revenue";
import Common "../types/common";

module {
  public func addCustomer(
    customers : List.List<Types.Customer>,
    req : Types.AddCustomerRequest,
  ) : Types.Customer {
    let id = customers.size();
    let now = Time.now();
    let customer : Types.Customer = {
      id;
      name = req.name;
      email = req.email;
      phone = req.phone;
      notes = req.notes;
      totalSpent = 0.0;
      lastPurchaseDate = null;
      createdAt = now;
    };
    customers.add(customer);
    customer;
  };

  public func updateCustomer(
    customers : List.List<Types.Customer>,
    req : Types.UpdateCustomerRequest,
  ) : Bool {
    var found = false;
    customers.mapInPlace(func(c) {
      if (c.id == req.id) {
        found := true;
        {
          c with
          name = req.name;
          email = req.email;
          phone = req.phone;
          notes = req.notes;
        };
      } else {
        c;
      };
    });
    found;
  };

  public func deleteCustomer(
    customers : List.List<Types.Customer>,
    id : Common.CustomerId,
  ) : Bool {
    let before = customers.size();
    let filtered = customers.filter(func(c) { c.id != id });
    customers.clear();
    customers.append(filtered);
    customers.size() < before;
  };

  public func getAllCustomers(
    customers : List.List<Types.Customer>,
  ) : [Types.Customer] {
    customers.toArray();
  };

  public func searchByName(
    customers : List.List<Types.Customer>,
    nameQuery : Text,
  ) : [Types.Customer] {
    let lower = nameQuery.toLower();
    customers.filter(func(c) {
      c.name.toLower().contains(#text lower);
    }).toArray();
  };

  public func getCustomer(
    customers : List.List<Types.Customer>,
    id : Common.CustomerId,
  ) : ?Types.Customer {
    customers.find(func(c) { c.id == id });
  };

  public func recomputeTotals(
    customers : List.List<Types.Customer>,
    entries : List.List<RevenueTypes.RevenueEntry>,
  ) {
    customers.mapInPlace(func(c) {
      var total : Float = 0.0;
      var lastDate : ?Common.Timestamp = null;
      entries.forEach(func(e) {
        if (e.customerId == c.id) {
          total += e.amount;
          switch (lastDate) {
            case null { lastDate := ?e.date };
            case (?d) {
              if (e.date > d) { lastDate := ?e.date };
            };
          };
        };
      });
      { c with totalSpent = total; lastPurchaseDate = lastDate };
    });
  };
};
