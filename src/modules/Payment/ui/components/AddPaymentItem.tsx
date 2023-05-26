import { DatePicker, Form, Input, InputNumber, Select, Switch } from "antd";

import { paymentItemMethods, paymentItemTypes } from "../../domain/interfaces";
import { dateInputFormat, minMoneyValue } from "../../../../config/constants";
import { AddBatchItemRules } from "../../domain/model/addBatch.request";


export interface AddPaymentItemProps {
  index: number;
  rules: AddBatchItemRules;
}
export default function AddPaymentItemComponent({
  index,
  rules,
}: AddPaymentItemProps) {
  return (<>
      <Form.Item
        label={texts.fields.type}
        name={['items', index, 'type']}
        rules={rules.type}>
        <Select
          showArrow
          options={typeSelectOptions}
        />
      </Form.Item>

      <Form.Item
        label={texts.fields.date}
        name={['items', index, 'date']}
        rules={rules.date}>
        <DatePicker
          allowClear
          format={(value) => value.format(dateInputFormat)}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label={texts.fields.amount}
        name={['items', index, 'amount']}
        rules={rules.amount}>
        <InputNumber
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          min={minMoneyValue}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
          precision={2}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label={texts.fields.quantity}
        name={['items', index, 'quantity']}
        rules={rules.quantity}>
        <InputNumber
          min={minMoneyValue}
          precision={0}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label={texts.fields.description}
        name={['items', index, 'description']}
        rules={rules.description}>
        <Input />
      </Form.Item>

      <Form.Item
        label={texts.fields.method}
        name={['items', index, 'method']}
        rules={rules.method}>
        <Select
          showArrow
          options={methodSelectOptions}
        />
      </Form.Item>

      <Form.Item
        label={texts.fields.reference}
        name={['items', index, 'reference']}
        rules={rules.reference}>
        <Input />
      </Form.Item>

      <Form.Item
        label={texts.fields.isNotGlobalMovement}
        name={['items', index, 'isGlobalMovement']}
        valuePropName="checked"
        initialValue={true}
        rules={rules.isGlobalMovement}>
        <Switch
          checkedChildren={texts.yes}
          unCheckedChildren={texts.no}
        />
      </Form.Item>
    </>);
}
const texts = {
  yes: 'Sí',
  no: 'No',
  fields: {
    date: 'Fecha del movimiento',
    amount: 'Monto del movimiento',
    quantity: 'Número de veces',
    description: 'Descripción del movimiento',
    reference: 'Referencia de movimiento',
    isNotGlobalMovement: '¿El movimiento se mantienen en el expediente del Hermano?',
    method: '¿Porqué medio se movió el dinero?',
    type: 'Tipo de movimiento',
  },
  methodsDic: {
    CASH: 'Efectivo',
    SPEI: 'Digital',
  } as {[key: string]: string},
  typesDic: {
    IN: 'Entrada al tesoro',
    OUT: 'Salida del tesoro',
    GIFT: 'Regalo o condonación',
  } as {[key: string]: string},
};

const methodSelectOptions = paymentItemMethods.map((status) => ({
  value: status,
  label: texts.methodsDic[status],
}));
const typeSelectOptions = paymentItemTypes.map((type) => ({
  value: type,
  label: texts.typesDic[type],
}));
