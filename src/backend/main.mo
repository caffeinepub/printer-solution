import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration using `with` clause

actor {
  // Include authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module CustomTypes {
    public type UserRole = {
      #admin;
      #user;
    };

    public type UserProfile = {
      name : Text;
      username : Text;
    };

    public type CompanyLogo = {
      bytes : [Nat8];
      mimeType : Text;
    };

    public type CompanySettings = {
      companyName : Text;
      address : Text;
      gstin : Text;
      gstRate : Float; // In percentage, e.g., 18.0 for 18%
      logo : ?CompanyLogo;
    };

    public type Client = {
      id : Nat;
      name : Text;
      contactDetails : Text;
      address : Text;
    };

    public type LedgerEntry = {
      clientId : Nat;
      description : Text;
      amount : Float;
      runningBalance : Float;
    };

    // Product Specification Struct
    public type ProductSpec = {
      productType : Text;
      size : Text;
      printingSide : Text;
      lamination : Text;
      spotUV : Bool;
      foiling : Bool;
    };

    // Extended Quotation type with detailed product fields
    public type Quotation = {
      id : Nat;
      clientId : Nat;
      product : Text;
      productSpec : ProductSpec;
      pages : Nat;
      paperType : Text;
      paperGSM : Text;
      pageNumbering : Bool;
      laminationType : Text;
      bindingType : Text;
      quantity : Nat;
      price : Float;
      pricePerUnit : Float;
      totalPrice : Float;
      approved : Bool;
    };

    // Extended Product type with structured fields
    public type Product = {
      id : Nat;
      name : Text;
      productSpec : ProductSpec;
      defaultQuotationQuantity : Nat;
      description : Text;
      details : Text;
      pricePerUnit : Float;
      quantity : Nat;
    };
  };

  var nextId = 0;
  let clients = Map.empty<Nat, CustomTypes.Client>();
  let ledgerEntries = Map.empty<Nat, [CustomTypes.LedgerEntry]>();
  let quotations = Map.empty<Nat, CustomTypes.Quotation>();
  let products = Map.empty<Nat, CustomTypes.Product>();
  let userProfiles = Map.empty<Principal, CustomTypes.UserProfile>();

  // GST Company Settings state
  var companySettings : ?CustomTypes.CompanySettings = null;

  func generateId() : Nat {
    let id = nextId;
    nextId += 1;
    id;
  };

  // Company Settings Management
  public query ({ caller }) func getCompanySettings() : async ?CustomTypes.CompanySettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view company settings");
    };
    companySettings;
  };

  public shared ({ caller }) func updateCompanySettings(settings : CustomTypes.CompanySettings) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update company settings");
    };
    companySettings := ?settings;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?CustomTypes.UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?CustomTypes.UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : CustomTypes.UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Client Management
  public shared ({ caller }) func addClient(name : Text, contactDetails : Text, address : Text) : async CustomTypes.Client {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add clients");
    };
    let id = generateId();
    let client : CustomTypes.Client = {
      id;
      name;
      contactDetails;
      address;
    };
    clients.add(id, client);
    client;
  };

  public query ({ caller }) func getClient(id : Nat) : async CustomTypes.Client {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view clients");
    };
    switch (clients.get(id)) {
      case (null) { Runtime.trap("Client not found") };
      case (?client) { client };
    };
  };

  public query ({ caller }) func getAllClients() : async [CustomTypes.Client] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view clients");
    };
    clients.values().toArray();
  };

  public shared ({ caller }) func updateClient(id : Nat, name : Text, contactDetails : Text, address : Text) : async CustomTypes.Client {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update clients");
    };
    let client : CustomTypes.Client = {
      id;
      name;
      contactDetails;
      address;
    };
    clients.add(id, client);
    client;
  };

  public shared ({ caller }) func deleteClient(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete clients");
    };
    clients.remove(id);
  };

  // Ledger Management
  public shared ({ caller }) func addLedgerEntry(clientId : Nat, description : Text, amount : Float) : async CustomTypes.LedgerEntry {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add ledger entries");
    };

    let existingEntries = switch (ledgerEntries.get(clientId)) {
      case (null) { [] };
      case (?entries) { entries };
    };

    let currentBalance = switch (existingEntries.reverse().values().next()) {
      case (null) { 0.0 };
      case (?lastEntry) { lastEntry.runningBalance };
    };

    let runningBalance = currentBalance + amount;

    let entry : CustomTypes.LedgerEntry = {
      clientId;
      description;
      amount;
      runningBalance;
    };

    let updatedEntries = existingEntries.concat([entry]);
    ledgerEntries.add(clientId, updatedEntries);
    entry;
  };

  public query ({ caller }) func getLedgerEntries(clientId : Nat) : async [CustomTypes.LedgerEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view ledger entries");
    };
    switch (ledgerEntries.get(clientId)) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };

  // Quotation Management with detailed product fields.
  public shared ({ caller }) func createQuotation(
    clientId : Nat,
    product : Text,
    productType : Text,
    size : Text,
    printingSide : Text,
    lamination : Text,
    spotUV : Bool,
    foiling : Bool,
    pages : Nat,
    paperType : Text,
    paperGSM : Text,
    pageNumbering : Bool,
    laminationType : Text,
    bindingType : Text,
    quantity : Nat,
    price : Float,
    pricePerUnit : Float
  ) : async CustomTypes.Quotation {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create quotations");
    };

    let id = generateId();
    let totalPrice = (quantity.toFloat()) * price;

    let productSpec : CustomTypes.ProductSpec = {
      productType;
      size;
      printingSide;
      lamination;
      spotUV;
      foiling;
    };

    let quotation : CustomTypes.Quotation = {
      id;
      clientId;
      product;
      productSpec;
      pages;
      paperType;
      paperGSM;
      pageNumbering;
      laminationType;
      bindingType;
      quantity;
      price;
      pricePerUnit;
      totalPrice;
      approved = false;
    };
    quotations.add(id, quotation);
    quotation;
  };

  public query ({ caller }) func getQuotation(id : Nat) : async CustomTypes.Quotation {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view quotations");
    };
    switch (quotations.get(id)) {
      case (null) { Runtime.trap("Quotation not found") };
      case (?quotation) { quotation };
    };
  };

  public query ({ caller }) func getAllQuotations() : async [CustomTypes.Quotation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view quotations");
    };
    quotations.values().toArray();
  };

  public shared ({ caller }) func approveQuotation(id : Nat, approved : Bool) : async CustomTypes.Quotation {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve quotations");
    };

    switch (quotations.get(id)) {
      case (null) { Runtime.trap("Quotation not found") };
      case (?existing) {
        let updatedQuotation = {
          existing with
          approved
        };
        quotations.add(id, updatedQuotation);
        updatedQuotation;
      };
    };
  };

  // Product Management with structured fields
  public shared ({ caller }) func addProduct(
    name : Text,
    productType : Text,
    size : Text,
    printingSide : Text,
    lamination : Text,
    spotUV : Bool,
    foiling : Bool,
    defaultQuotationQuantity : Nat,
    pricePerUnit : Float,
    quantity : Nat,
    description : ?Text,
    details : ?Text,
  ) : async CustomTypes.Product {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add products");
    };
    let id = generateId();

    let productSpec : CustomTypes.ProductSpec = {
      productType;
      size;
      printingSide;
      lamination;
      spotUV;
      foiling;
    };

    let product : CustomTypes.Product = {
      id;
      name;
      productSpec;
      defaultQuotationQuantity;
      pricePerUnit;
      quantity;
      description = optionToText(description);
      details = optionToText(details);
    };
    products.add(id, product);
    product;
  };

  public query ({ caller }) func getProduct(id : Nat) : async CustomTypes.Product {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [CustomTypes.Product] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    products.values().toArray();
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    productType : Text,
    size : Text,
    printingSide : Text,
    lamination : Text,
    spotUV : Bool,
    foiling : Bool,
    defaultQuotationQuantity : Nat,
    pricePerUnit : Float,
    quantity : Nat,
    description : ?Text,
    details : ?Text,
  ) : async CustomTypes.Product {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update products");
    };

    let productSpec : CustomTypes.ProductSpec = {
      productType;
      size;
      printingSide;
      lamination;
      spotUV;
      foiling;
    };

    let product : CustomTypes.Product = {
      id;
      name;
      productSpec;
      defaultQuotationQuantity;
      pricePerUnit;
      quantity;
      description = optionToText(description);
      details = optionToText(details);
    };
    products.add(id, product);
    product;
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  func optionToText(opt : ?Text) : Text {
    switch (opt) {
      case (null) { "" };
      case (?v) { v };
    };
  };

  // Billing Management with GST inclusion
  public type BillSummary = {
    subtotal : Float;
    gstAmount : Float;
    totalAmount : Float;
    ledgerEntry : CustomTypes.LedgerEntry;
  };

  public shared ({ caller }) func createBill(quotationId : Nat) : async BillSummary {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create bills");
    };

    switch (quotations.get(quotationId)) {
      case (null) { Runtime.trap("Quotation not found") };
      case (?quotation) {
        if (not quotation.approved) {
          Runtime.trap("Quotation not approved for billing");
        };

        let gstRate = switch (companySettings) {
          case (null) { 0.0 };
          case (?settings) { settings.gstRate };
        };

        let subtotal = quotation.totalPrice;
        let gstAmount = subtotal * (gstRate / 100.0);
        let totalAmount = subtotal + gstAmount;

        let ledgerEntry = await addLedgerEntry(
          quotation.clientId,
          "Invoice for " # quotation.product,
          totalAmount
        );

        {
          subtotal;
          gstAmount;
          totalAmount;
          ledgerEntry;
        };
      };
    };
  };

  module Sorting {
    public func compareClientsByName(client1 : CustomTypes.Client, client2 : CustomTypes.Client) : Order.Order {
      Text.compare(client1.name, client2.name);
    };
  };
};
