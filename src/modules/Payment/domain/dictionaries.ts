import { PaymentItemType, PaymentStatusStatus } from "./interfaces";

export const paymentStatusColors = {
  OK: 'green',
  DEBT: 'volcano',
  OTHER: 'grey',
} as {[key in PaymentStatusStatus]: string}

export const paymentTypeColors = {
  IN: 'green',
  OUT: 'volcano',
  GIFT: 'grey',
} as {[key in PaymentItemType]: string}
