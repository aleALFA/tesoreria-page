export const brotherGrades = ["M", "COM", "APR"];
export type BrotherGrades = "M" | "COM" | "APR";

export const brotherStatus = ["ACTIVE", "FREE", "OFF", "CANDIDATE"];
export type BrotherStatus = "ACTIVE" | "FREE" | "OFF" | "CANDIDATE";

export interface Brother {
  born?: string;
  grade: BrotherGrades;
  id: string;
  init?: string;
  name: string;
  status: BrotherStatus;
}
export interface BrotherList {
  list: Brother[];
  total: number;
}