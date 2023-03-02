import { ApolloError, gql, isApolloError } from "@apollo/client";
import { useCallback } from "react";

import { BrotherPaymentProfile, BrotherPaymentProfileResponse } from "../../domain/interfaces";
import graphClient from "../../../common/infrastructure/repository/graph.repo";
import { useAccessToken } from "../../../Auth/application/context/access";
import UnauthorizedError from "../../../common/domain/error/Unauthorized";
import AddBatchRequest from "../../domain/model/addBatch.request";
import PaymentRepo from "./payment.repo";

export default function useGraphPaymentRepo(): PaymentRepo {
  const Authorization = useAccessToken();

  const listByBrother = useCallback(async (search: any, signal?: AbortSignal): Promise<BrotherPaymentProfileResponse> => {
    try {
      const { data } = await graphClient.query({
        query: LIST_BY_BROTHER,
        variables: { search },
        context: {
          // fetchOptions: { signal },
          headers: { Authorization },
        },
      });
      return {
        list: data.brothersProfile.map((value: BrotherPaymentProfile) => ({...value})),
      };
    } catch (error) {
      if (!isApolloError(error as Error)) throw error;

      const apError = error as ApolloError;
      const { message } = apError
      const isUnauthorized = message === 'Unauthorized';
      if (isUnauthorized) throw new UnauthorizedError(message);

      throw error;
    }
  }, [Authorization]);

  const searchBrotherProfile = useCallback(async (search: string, signal?: AbortSignal): Promise<any> => {
    try {
      const { data } = await graphClient.query<{
        brothersProfile: BrotherPaymentProfile[]
      }>({
        query: SEARCH_BROTHER_PROFILE,
        variables: { search },
        context: {
          headers: { Authorization },
        },
      });
      return {
        list: data.brothersProfile.map((value: BrotherPaymentProfile) => ({...value})),
      };
    } catch (error) {
      if (!isApolloError(error as Error)) throw error;

      const apError = error as ApolloError;
      const { message } = apError
      const isUnauthorized = message === 'Unauthorized';
      if (isUnauthorized) throw new UnauthorizedError(message);

      throw error;
    }
  }, [Authorization]);

  const batch = useCallback(async (payload: AddBatchRequest, signal?: AbortSignal): Promise<void> => {
    try {
      await graphClient.mutate({
        mutation: STORE_BATCH,
        variables: { payload },
        context: {
          headers: { Authorization },
        },
      });
    } catch (error) {
      if (!isApolloError(error as Error)) throw error;

      const apError = error as ApolloError;
      const { message } = apError
      const isUnauthorized = message === 'Unauthorized';
      if (isUnauthorized) throw new UnauthorizedError(message);

      throw error;
    }
  }, [Authorization]);

  return {
    batch,
    listByBrother,
    searchBrotherProfile,
  }
}

const LIST_BY_BROTHER = gql`query Query($search: String) {
  brothersProfile(search: $search) {
    brother {
      name
      id
      status
    }
    paymentStatus {
      debitAmount
      lastPaymentDate
      totalAmount
      status
    }
  }
}`;
const SEARCH_BROTHER_PROFILE = gql`query Query($search: String) {
  brothersProfile(search: $search) {
    brother {
      name
      id
    }
    paymentStatus {
      debitAmount
      lastPaymentDate
      status
    }
  }
}`;
const STORE_BATCH = gql`mutation save($payload: BatchMoneyMovement!) {
  batchMoneyMovementData(saveMoneyMovementData: $payload)
}`;