import List "mo:core/List";
import Time "mo:core/Time";
import RevenueTypes "types/revenue";
import CustomerTypes "types/customers";
import CustomersLib "lib/customers";
import RevenueLib "lib/revenue";
import RevenueApi "mixins/revenue-api";
import CustomersApi "mixins/customers-api";
import MetricsApi "mixins/metrics-api";

actor {
  let entries = List.empty<RevenueTypes.RevenueEntry>();
  let customers = List.empty<CustomerTypes.Customer>();

  // Seed sample data on first load when both lists are empty
  if (customers.size() == 0 and entries.size() == 0) {
    let now = Time.now();
    let dayNs : Int = 86_400_000_000_000;

    // Add sample customers
    ignore CustomersLib.addCustomer(customers, { name = "James Thornton"; email = "james@example.com"; phone = "+1 555-0101"; notes = "Prefers classic cuts" });
    ignore CustomersLib.addCustomer(customers, { name = "Marcus Bell"; email = "marcus@example.com"; phone = "+1 555-0102"; notes = "VIP client" });
    ignore CustomersLib.addCustomer(customers, { name = "Oliver Hayes"; email = "oliver@example.com"; phone = "+1 555-0103"; notes = "Wedding party order" });
    ignore CustomersLib.addCustomer(customers, { name = "Daniel Whitmore"; email = "daniel@example.com"; phone = "+1 555-0104"; notes = "Corporate account" });
    ignore CustomersLib.addCustomer(customers, { name = "Samuel Rivera"; email = "samuel@example.com"; phone = "+1 555-0105"; notes = "" });
    ignore CustomersLib.addCustomer(customers, { name = "Henry Caldwell"; email = "henry@example.com"; phone = "+1 555-0106"; notes = "Tall build, custom sizing" });

    // Add sample revenue entries spread over the last 14 days
    ignore RevenueLib.addEntry(entries, { date = now - (13 * dayNs); amount = 1_250.00; customerId = 0; customerName = "James Thornton"; itemDescription = "Classic 2-piece wool suit"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now - (12 * dayNs); amount = 2_800.00; customerId = 1; customerName = "Marcus Bell"; itemDescription = "Bespoke 3-piece tuxedo"; notes = "Rush order" });
    ignore RevenueLib.addEntry(entries, { date = now - (11 * dayNs); amount = 950.00; customerId = 2; customerName = "Oliver Hayes"; itemDescription = "Slim-fit navy suit"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now - (10 * dayNs); amount = 3_400.00; customerId = 2; customerName = "Oliver Hayes"; itemDescription = "Wedding party — 4 suits"; notes = "Group discount applied" });
    ignore RevenueLib.addEntry(entries, { date = now - (9 * dayNs); amount = 1_100.00; customerId = 3; customerName = "Daniel Whitmore"; itemDescription = "Corporate grey suit"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now - (8 * dayNs); amount = 780.00; customerId = 4; customerName = "Samuel Rivera"; itemDescription = "Casual blazer + trousers"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now - (7 * dayNs); amount = 1_650.00; customerId = 1; customerName = "Marcus Bell"; itemDescription = "Summer linen suit"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now - (6 * dayNs); amount = 2_100.00; customerId = 5; customerName = "Henry Caldwell"; itemDescription = "Custom tall-fit 2-piece"; notes = "Special measurements" });
    ignore RevenueLib.addEntry(entries, { date = now - (5 * dayNs); amount = 890.00; customerId = 0; customerName = "James Thornton"; itemDescription = "Dress shirt + tie set"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now - (4 * dayNs); amount = 1_350.00; customerId = 3; customerName = "Daniel Whitmore"; itemDescription = "Black evening suit"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now - (3 * dayNs); amount = 600.00; customerId = 4; customerName = "Samuel Rivera"; itemDescription = "Waistcoat + dress trousers"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now - (2 * dayNs); amount = 2_450.00; customerId = 1; customerName = "Marcus Bell"; itemDescription = "Winter overcoat"; notes = "VIP pricing" });
    ignore RevenueLib.addEntry(entries, { date = now - (1 * dayNs); amount = 1_750.00; customerId = 2; customerName = "Oliver Hayes"; itemDescription = "Charcoal herringbone suit"; notes = "" });
    ignore RevenueLib.addEntry(entries, { date = now; amount = 980.00; customerId = 5; customerName = "Henry Caldwell"; itemDescription = "Silk pocket square set"; notes = "" });

    // Recompute customer totals after seeding
    CustomersLib.recomputeTotals(customers, entries);
  };

  include RevenueApi(entries, customers);
  include CustomersApi(customers, entries);
  include MetricsApi(customers, entries);
};
