import { BrotherPaymentProfileResponse, ListPaymentResponse, SearchBrotherProfileResponse } from "../../domain/interfaces";
import AddBatchRequest from "../../domain/model/addBatch.request";

export default interface PaymentRepo {
  list(brother_id?: string, search?: any, signal?: AbortSignal): Promise<ListPaymentResponse>;
  listByBrother(search: any, signal?: AbortSignal): Promise<BrotherPaymentProfileResponse>;
  searchBrotherProfile(search: string, signal?: AbortSignal): Promise<SearchBrotherProfileResponse>;
  batch(payload: AddBatchRequest, signal?: AbortSignal): Promise<PaymentRepoBatchReturn>;
  getReceipt(sequence: string, signal?: AbortSignal): Promise<string>;
}

export interface PaymentRepoBatchReturn {
  sequence: string;
}