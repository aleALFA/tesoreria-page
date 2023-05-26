import { ApolloError, gql, isApolloError } from "@apollo/client";
import { useCallback } from "react";

import { BrotherPaymentProfile, BrotherPaymentProfileResponse, ListPaymentItem, ListPaymentResponse } from "../../domain/interfaces";
import graphClient from "../../../common/infrastructure/repository/graph.repo";
import { useAccessToken } from "../../../Auth/application/context/access";
import UnauthorizedError from "../../../common/domain/error/Unauthorized";
import AddBatchRequest from "../../domain/model/addBatch.request";
import PaymentRepo, { PaymentRepoBatchReturn } from "./payment.repo";

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

  const batch = useCallback(async (payload: AddBatchRequest, signal?: AbortSignal): Promise<PaymentRepoBatchReturn> => {
    try {
      const { data } = await graphClient.mutate({
        mutation: STORE_BATCH,
        variables: { payload },
        context: {
          headers: { Authorization },
        },
      });
      return {
        sequence: data.batchMoneyMovementData,
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


  const list = useCallback(async (brother_id?: string, search?: any, signal?: AbortSignal): Promise<ListPaymentResponse> => {
    try {
      const { data } = await graphClient.query({
        query: LIST,
        variables: { brother_id, search },
        context: {
          headers: { Authorization },
        },
      });
      return {
        list: data.listPayments as ListPaymentItem[],
      };
    } catch (error) {
      if (!isApolloError(error as Error)) throw error;

      const apError = error as ApolloError;
      const { message } = apError
      const isUnauthorized = message === 'Unauthorized';
      if (isUnauthorized) throw new UnauthorizedError(message);

      throw error;
    }
  },[Authorization]);


  const getReceipt = useCallback(async (sequence: string, signal?: AbortSignal): Promise<string> => {
    try {
      const { data } = await graphClient.query({
        query: RECEIPT,
        variables: { sequence },
        context: {
          headers: { Authorization },
        },
      });
      return data.movementReceipt;
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
    list,
    batch,
    getReceipt,
    listByBrother,
    searchBrotherProfile,
  }
}

const LIST = gql`query Query($search: String, $brother_id: String) {
  listPayments(search: $search, brother_id: $brother_id) {
    id
    sequence
    date
    amount
    quantity
    description
    method
    type
    reference
    isGlobalMovement
    status
    created_in
  }
}`;
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
const RECEIPT = gql`query Query($sequence: String!) {
  movementReceipt(sequence: $sequence)
}`;