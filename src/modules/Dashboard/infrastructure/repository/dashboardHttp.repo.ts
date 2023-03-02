import { isAxiosError } from "axios";
import { useCallback } from "react";

import { useAccessToken } from "../../../Auth/application/context/access";
import UnauthorizedError from "../../../common/domain/error/Unauthorized";
import api from "../../../common/infrastructure/repository/http.repo";
import DashboardRepo from "./dashboard.repo";

export default function useHttpDashboardRepo(): DashboardRepo {
  const Authorization = useAccessToken();

  const index = useCallback(async (signal?: AbortSignal) => {
    try {
      const { data } = await api.get('/payment/status', {
        headers: {
          Authorization,
        },
        signal,
      });
      return data;
    } catch (err) {
      if (!isAxiosError(err)) throw err;

      const isUnauthorized = err.response?.status == 401;
      if (isUnauthorized) throw new UnauthorizedError(err.message);

      throw new Error(err.response?.data?.message || err.message);
    }
  }, [Authorization]);

  return {
    index,
  }
}