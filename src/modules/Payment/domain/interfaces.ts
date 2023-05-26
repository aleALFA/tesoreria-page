import { BrotherStatus } from "../../Brother/domain/interfaces";

export const paymentStatusStatus = ["OK", "DEBT"];
export type PaymentStatusStatus = "OK" | "DEBT";

export const paymentItemMethods = ['CASH', 'SPEI'];
export type PaymentItemMethod = 'CASH' | 'SPEI';

export const paymentItemTypes = ['IN', 'OUT', 'GIFT'];
export type PaymentItemType = 'IN' | 'OUT' | 'GIFT';

export const paymentItemStatus = ['ACTIVE', 'REFOUND', 'CANCELED'];
export type PaymentItemStatus = 'ACTIVE' | 'REFOUND' | 'CANCELED';

export interface BrotherProfile {
  id?: string;
  name?: string;
  status?: BrotherStatus;
}
export interface PaymentStatus {
  debitAmount?: number;
  lastPaymentDate?: string;
  status?: PaymentStatusStatus;
  totalAmount?: number;
}
export interface BrotherPaymentProfile {
  brother?: BrotherProfile;
  paymentStatus?: PaymentStatus;
}
export interface BrotherPaymentProfileResponse {
  list: BrotherPaymentProfile[];
}
export interface ListPaymentItem {
  id: string;
  sequence: string;
  date: string;
  amount: number;
  quantity: number;
  description: string;
  method: PaymentItemMethod;
  type: PaymentItemType;
  reference?: string;
  isGlobalMovement: boolean;
  status: PaymentStatusStatus;
  created_in?: Date;
}
export interface ListPaymentResponse {
  list: ListPaymentItem[];
}

export interface SearchBrotherProfile {
  id: string;
  name: string;
}
export interface SearchPaymentStatus {
  debitAmount: number;
  lastPaymentDate: string;
  status: PaymentStatusStatus;
}
export interface SearchBrotherPaymentProfile {
  brother: SearchBrotherProfile;
  paymentStatus: SearchPaymentStatus;
}
export interface SearchBrotherProfileResponse {
  list: SearchBrotherPaymentProfile[];
}