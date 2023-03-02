import { Rule } from "rc-field-form/lib/interface";

import { brotherGrades, BrotherGrades, brotherStatus, BrotherStatus } from "../interfaces";

export default class NewMemberRequest {
  name: string;
  status: BrotherStatus;
  grade?: BrotherGrades;
  born?: Date;
  init?: Date;

  constructor(init?: NewMemberRequestProps) {
    this.name = init?.name ?? '';
    this.status = init?.status ?? 'CANDIDATE';
    this.grade = init?.grade ?? undefined;
    this.born = init?.born ?? undefined;
    this.init = init?.init ?? undefined;
  }

  load(init: NewMemberRequestProps) {
    this.name = init.name;
    this.status = init.status;
    this.grade = init.grade ?? undefined;
    this.born = init.born ?? undefined;
    this.init = init.init ?? undefined;

  }

  getRules(): NewMemberRequestRules {
    return {
      name: [{
        required: true,
        message: 'Please input the name',
        validator: async (rule, value, callback) => {
          const isNotValid = (value?.length ?? 0) <= 2;
          if (isNotValid) return callback(rule.message as string);
        },
      }],
      status: [
        { required: true, message: 'Please input the status' },
        {
          enum: brotherStatus,
          message: 'The status most be a valid one'
        }
      ],
      grade: [
        { required: false },
        {
          enum: brotherGrades,
          message: 'The grade most be a valid one'
        }
      ],
      born: [{ required: false }],
      init: [{ required: false }],
    };
  }
}

export interface NewMemberRequestProps {
  name: string;
  grade?: BrotherGrades;
  status: BrotherStatus;
  born?: Date;
  init?: Date;
}
export type NewMemberRequestRules = {
  [Property in keyof NewMemberRequestProps]: Rule[]
}