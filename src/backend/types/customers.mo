import Common "common";

module {
  public type Customer = {
    id : Common.CustomerId;
    name : Text;
    email : Text;
    phone : Text;
    notes : Text;
    totalSpent : Float;
    lastPurchaseDate : ?Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type AddCustomerRequest = {
    name : Text;
    email : Text;
    phone : Text;
    notes : Text;
  };

  public type UpdateCustomerRequest = {
    id : Common.CustomerId;
    name : Text;
    email : Text;
    phone : Text;
    notes : Text;
  };
};
