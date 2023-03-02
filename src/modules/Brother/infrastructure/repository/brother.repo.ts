import NewMemberRequest from "../../domain/model/newMember.request";
import { BrotherList } from "../../domain/interfaces";

export default interface BrotherRepo {
  list(search: any, signal?: AbortSignal): Promise<BrotherList>;
  save(payload: NewMemberRequest, signal?: AbortSignal): Promise<any>;
}