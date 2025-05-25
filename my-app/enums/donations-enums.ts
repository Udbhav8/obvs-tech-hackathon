// Centralized TypeScript Enum Definitions for Donation-related entities

// Enum for Donation Type
export enum DonationType {
  PERSONAL = "Personal",
  CORPORATE = "Corporate",
  GRANT = "Grant",
  BEQUEATHED = "Bequeathed",
  OTHER = "Other",
}

// Enum for Payment Type
export enum PaymentType {
  CHEQUE = "Cheque",
  CASH = "Cash",
  THIRD_PARTY = "Third Party",
  DIRECT_DEBIT = "Direct Debit",
  OTHER = "Other",
}

// Enum for Receipt Type
export enum ReceiptType {
  REQUIRED = "Required",
  SENT_VIA_CANADAHELPS = "Sent via CanadaHelps",
  NOT_NEEDED = "Not Needed",
}

// Enum for Receipt Sent Method
export enum ReceiptSentMethod {
  EMAIL = "Email",
  MAIL = "Mail",
  IN_PERSON = "In Person",
}

// Enum for Receipt Status
export enum ReceiptStatus {
  PENDING = "Pending",
  SENT = "Sent",
  VOID = "Void",
}

// Enum for Donor Type (if applicable based on the schema)
export enum DonorType {
  INDIVIDUAL = "Individual",
  ORGANIZATION = "Organization",
}

// Create enum registry for internal use
export const DONATIONS_ENUM_REGISTRY = {
  DonationType,
  PaymentType,
  ReceiptType,
  ReceiptSentMethod,
  ReceiptStatus,
  DonorType,
} as const;

// Type for enum names
export type DonationsEnumName = keyof typeof DONATIONS_ENUM_REGISTRY;
