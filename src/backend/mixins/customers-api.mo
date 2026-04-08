import List "mo:core/List";
import CustomersLib "../lib/customers";
import RevenueLib "../lib/revenue";
import CustomerTypes "../types/customers";
import RevenueTypes "../types/revenue";
import Common "../types/common";

mixin (
  customers : List.List<CustomerTypes.Customer>,
  entries : List.List<RevenueTypes.RevenueEntry>
) {
  public func addCustomer(req : CustomerTypes.AddCustomerRequest) : async CustomerTypes.Customer {
    CustomersLib.addCustomer(customers, req);
  };

  public func updateCustomer(req : CustomerTypes.UpdateCustomerRequest) : async Bool {
    CustomersLib.updateCustomer(customers, req);
  };

  public func deleteCustomer(id : Common.CustomerId) : async Bool {
    CustomersLib.deleteCustomer(customers, id);
  };

  public query func getAllCustomers() : async [CustomerTypes.Customer] {
    CustomersLib.getAllCustomers(customers);
  };

  public query func searchCustomers(nameQuery : Text) : async [CustomerTypes.Customer] {
    CustomersLib.searchByName(customers, nameQuery);
  };

  public query func getCustomer(id : Common.CustomerId) : async ?CustomerTypes.Customer {
    CustomersLib.getCustomer(customers, id);
  };

  public query func getCustomerTransactions(customerId : Common.CustomerId) : async [RevenueTypes.RevenueEntry] {
    RevenueLib.getEntriesByCustomer(entries, customerId);
  };
};
