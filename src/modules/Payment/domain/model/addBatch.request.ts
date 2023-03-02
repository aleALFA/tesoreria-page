import { Rule } from "rc-field-form/lib/interface";

import { PaymentItemMethod, paymentItemMethods, PaymentItemType, paymentItemTypes } from "../interfaces";
import { minMoneyValue } from "../../../../config/constants";

export default class AddBatchRequest {
  brother_id: string;
  items: AddBatchItem[];

  constructor(init?: AddBatchRequestProps) {
    this.brother_id = init?.brother_id ?? '';
    this.items = [];
    this.load(init);
  }

  load(init?: AddBatchRequestProps) {
    this.brother_id = init?.brother_id ?? '';

    const hasItems = Array.isArray(init?.items ?? null) && (init?.items?.length ?? 0) > 0;
    if (!hasItems) {
      this.items = [];
      return;
    }

    this.items = (init as AddBatchRequestProps).items.map((item) => new AddBatchItem(item));
    return this;
  }

  addItem(init?: AddBatchItemProps) {
    this.items.push(new AddBatchItem(init));
    return this;
  }
  removeItem(index: number) {
    this.items.splice(index, 1);
    return this;
  }
  formatItems(parser?: batchItemParser) {
    this.items = this.items.map((item) => item.toPayload(parser));
    return this;
  }

  getRules(): AddBatchRequestRules {
    return {
      brother_id: [
        { required: true, message: 'Please input the move date' }
      ],
      items: AddBatchItem.getRules(),
    };
  }
}

export class AddBatchItem {
  date: Date;
  amount: number;
  quantity: number;
  description: string;
  reference?: string;
  isGlobalMovement?: boolean;
  method?: PaymentItemMethod;
  type?: PaymentItemType;

  private static minDescriptionLen = 10;
  private static minReferenceLen = 5;

  constructor(init?: AddBatchItemProps) {
    this.date = init?.date ?? new Date();
    this.amount = init?.amount ?? 0;
    this.quantity = init?.quantity ?? 1;
    this.description = init?.description ?? '';
    this.reference = init?.reference ?? '';
    this.isGlobalMovement = init?.isGlobalMovement ?? false;
    this.method = init?.method ?? undefined;
    this.type = init?.type ?? undefined;
  }

  load(init?: AddBatchItemProps) {
    this.date = init?.date ?? new Date();
    this.amount = init?.amount ?? 0;
    this.quantity = init?.quantity ?? 0;
    this.description = init?.description ?? '';
    this.reference = init?.reference ?? '';
    this.isGlobalMovement = init?.isGlobalMovement ?? false;
    this.method = init?.method ?? undefined;
    this.type = init?.type ?? undefined;
  }

  toPayload(parser?: batchItemParser) {
    const internalValue = {
      ...this,
      amount: this.amount * 100,
    } as AddBatchItemProps;
    const newValue = parser !== undefined ? parser(internalValue) : internalValue;
    this.load(newValue as AddBatchItemProps);
    return this;
  }

  static getRules(): AddBatchItemRules {
    return {
      date: [{
        required: true,
        message: 'Please input the move date',
      }],
      amount: [
        { required: true, message: 'Please input the amount' },
        { min: +minMoneyValue, type: "number", message: `The amount most be greater than ${minMoneyValue}` },
      ],
      quantity: [
        { required: true, message: 'Please input the quantity' },
        { min: +minMoneyValue, type: "number", message: `The quantity most be greater than ${minMoneyValue}` },
      ],
      description: [
        { required: true, message: 'Please input the description' },
        { min: this.minDescriptionLen, message: `The description most have minimum ${this.minDescriptionLen} characters` },
      ],
      reference: [
        { required: false },
        { min: this.minReferenceLen, message: `The reference most have minimum ${this.minReferenceLen} characters` },
      ],
      isGlobalMovement: [
        { required: false },
        {  type: 'boolean', message: 'The global reference most be a valid one'},
      ],
      method: [
        { required: true, message: 'Please input the move method', },
        { enum: paymentItemMethods, message: 'The method most be a valid one' },
      ],
      type: [
        { required: true, message: 'Please input the move type', },
        { enum: paymentItemTypes, message: 'The type most be a valid one' },
      ],
    };
  }
}

export interface AddBatchRequestProps {
  brother_id: string;
  items: AddBatchItemProps[];
}
export interface AddBatchItemProps {
  date: Date;
  amount: number;
  quantity: number;
  description: string;
  reference?: string;
  isGlobalMovement: boolean;
  method: PaymentItemMethod;
  type: PaymentItemType;
}
export type AddBatchRequestRules = {
  brother_id: Rule[];
  items: AddBatchItemRules;
}
export type AddBatchItemRules = {
  [Property in keyof AddBatchItemProps]: Rule[];
}
export type batchItemParser = (item: AddBatchItemProps) => AddBatchItemProps;
