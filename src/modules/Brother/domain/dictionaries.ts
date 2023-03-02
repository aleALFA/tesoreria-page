import { BrotherStatus } from "./interfaces";

export const statusColors = {
  ACTIVE: 'green',
  FREE : 'green',
  CANDIDATE: 'geekblue',
  OFF: 'volcano',
} as {[key in BrotherStatus]: string}
