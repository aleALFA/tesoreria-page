import { isAxiosError } from "axios";
import { useCallback } from "react";

import { useAccessToken } from "../../../Auth/application/context/access";
import UnauthorizedError from "../../../common/domain/error/Unauthorized";
import api from "../../../common/infrastructure/repository/http.repo";
import NewMemberRequest from "../../domain/model/newMember.request";

import BrotherRepo from "./brother.repo";

export default function useHttpBrotherRepo(): BrotherRepo {
  const Authorization = useAccessToken();

  const list = useCallback(async (search: any, signal?: AbortSignal) => {
    try {
      const { data } = await api.get('/brother', {
        headers: {
          Authorization,
        },
        params: {
          search,
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

  const save = useCallback(async (payload: NewMemberRequest, signal?: AbortSignal) => {
    try {
      const { data } = await api.post('/brother', payload, {
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
    list,
    save,
  }
}