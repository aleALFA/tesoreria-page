import LoginRequest from "../../domain/model/login.request";

export default interface AuthRepo {
  login(payload: LoginRequest, signal?: AbortSignal): Promise<any>;
}