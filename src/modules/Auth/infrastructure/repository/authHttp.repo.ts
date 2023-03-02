import { isAxiosError } from "axios";
import { useCallback } from "react";

import api from "../../../common/infrastructure/repository/http.repo";
import LoginRequest from "../../domain/model/login.request";
import AuthRepo from "./auth.repo";

export default function useHttpAuthRepo(): AuthRepo {
  const login = useCallback(async (payload: LoginRequest, signal?: AbortSignal) => {
    try {
      const { data } = await api.post('auth/bySecret', payload, { signal });
      return data;
    } catch (err) {
      if (!isAxiosError(err)) throw err;
      throw new Error(err.response?.data?.message || err.message);
    }
  }, []);

  return {
    login,
  }
}