import { PaymentStatusStatus } from "./interfaces";

export const paymentStatusColors = {
  OK: 'green',
  DEBT: 'volcano',
  OTHER: 'grey',
} as {[key in PaymentStatusStatus]: string}
