import { BrotherPaymentProfileResponse, SearchBrotherProfileResponse } from "../../domain/interfaces";
import AddBatchRequest from "../../domain/model/addBatch.request";

export default interface PaymentRepo {
  listByBrother(search: any, signal?: AbortSignal): Promise<BrotherPaymentProfileResponse>;
  searchBrotherProfile(search: string, signal?: AbortSignal): Promise<SearchBrotherProfileResponse>;
  batch(payload: AddBatchRequest, signal?: AbortSignal): Promise<any>;
}