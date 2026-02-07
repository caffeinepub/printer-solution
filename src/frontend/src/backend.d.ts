import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductSpec {
    printingSide: string;
    size: string;
    productType: string;
    lamination: string;
    foiling: boolean;
    spotUV: boolean;
}
export interface Quotation {
    id: bigint;
    paperGSM: string;
    clientId: bigint;
    paperType: string;
    pricePerUnit: number;
    productSpec: ProductSpec;
    approved: boolean;
    quantity: bigint;
    pages: bigint;
    bindingType: string;
    price: number;
    totalPrice: number;
    laminationType: string;
    pageNumbering: boolean;
    product: string;
}
export interface CompanyLogo {
    mimeType: string;
    bytes: Uint8Array;
}
export interface CompanySettings {
    cin: string;
    pan: string;
    logo?: CompanyLogo;
    placeOfWork: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    gstin: string;
    address: string;
    companyName: string;
    gstRate: number;
}
export interface BillSummary {
    gstAmount: number;
    totalAmount: number;
    ledgerEntry: LedgerEntry;
    subtotal: number;
}
export interface Client {
    id: bigint;
    name: string;
    address: string;
    contactDetails: string;
}
export interface LedgerEntry {
    clientId: bigint;
    description: string;
    runningBalance: number;
    amount: number;
}
export interface Product {
    id: bigint;
    defaultQuotationQuantity: bigint;
    name: string;
    description: string;
    pricePerUnit: number;
    productSpec: ProductSpec;
    details: string;
    quantity: bigint;
}
export interface UserProfile {
    username: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addClient(name: string, contactDetails: string, address: string): Promise<Client>;
    addLedgerEntry(clientId: bigint, description: string, amount: number): Promise<LedgerEntry>;
    addProduct(name: string, productType: string, size: string, printingSide: string, lamination: string, spotUV: boolean, foiling: boolean, defaultQuotationQuantity: bigint, pricePerUnit: number, quantity: bigint, description: string | null, details: string | null): Promise<Product>;
    approveQuotation(id: bigint, approved: boolean): Promise<Quotation>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBill(quotationId: bigint): Promise<BillSummary>;
    createQuotation(clientId: bigint, product: string, productType: string, size: string, printingSide: string, lamination: string, spotUV: boolean, foiling: boolean, pages: bigint, paperType: string, paperGSM: string, pageNumbering: boolean, laminationType: string, bindingType: string, quantity: bigint, price: number, pricePerUnit: number): Promise<Quotation>;
    deleteClient(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllClients(): Promise<Array<Client>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllQuotations(): Promise<Array<Quotation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(id: bigint): Promise<Client>;
    getCompanySettings(): Promise<CompanySettings | null>;
    getLedgerEntries(clientId: bigint): Promise<Array<LedgerEntry>>;
    getProduct(id: bigint): Promise<Product>;
    getQuotation(id: bigint): Promise<Quotation>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateClient(id: bigint, name: string, contactDetails: string, address: string): Promise<Client>;
    updateCompanySettings(settings: CompanySettings): Promise<void>;
    updateProduct(id: bigint, name: string, productType: string, size: string, printingSide: string, lamination: string, spotUV: boolean, foiling: boolean, defaultQuotationQuantity: bigint, pricePerUnit: number, quantity: bigint, description: string | null, details: string | null): Promise<Product>;
}
