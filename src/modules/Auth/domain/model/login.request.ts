import { Rule } from "rc-field-form/lib/interface";

export default class LoginRequest {
  secret: string;
  user: string;

  constructor(init?: LoginRequestProps) {
    this.secret = init?.secret ?? '';
    this.user = init?.user ?? '';
  }

  getRules(): LoginRequestRules {
    return {
      user: [{ required: true, message: 'Please input your user!' }],
      secret: [{ required: true, message: 'Please input your password!' }],
    };
  }
}

export interface LoginRequestProps {
  secret: string
  user: string
}
export type LoginRequestRules = {
  [Property in keyof LoginRequestProps]: Rule[]
}