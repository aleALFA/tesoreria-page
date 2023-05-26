import { Alert, Col, Row } from "antd";
import { useMemo } from "react";

import { formatCurrency, formatDate } from "../../../../config/constants";
import { SearchPaymentStatus } from "../../domain/interfaces";

export type BrotherStatusAlertProps = {
  paymentStatus: SearchPaymentStatus;
}

export default function BrotherStatusAlert({ paymentStatus }: BrotherStatusAlertProps) {
  const PaymentDate = useMemo(() => {
    return <Row gutter={16} className="mb-2">
      <Col className="gutter-row" span={12}>{texts.alertLastPayment}</Col>
      <Col className="gutter-row" span={12}>{
        paymentStatus.lastPaymentDate !== null ?
        formatDate(paymentStatus.lastPaymentDate) :
        texts.alertLastPaymentNoDate
      }</Col>
    </Row>;
  }, [texts, paymentStatus]);

  const parts = useMemo(() => {
    const hasDebit = paymentStatus.status === 'DEBT';

    if (hasDebit) {
      return {
        title: texts.alertDebitTitle,
        type: 'error' as const,
        body: <>
          {PaymentDate}
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>{texts.alertDebitAmount}</Col>
            <Col className="gutter-row" span={12}>{formatCurrency(
              (paymentStatus.debitAmount ?? 0) / 100
            )}</Col>
          </Row>
        </>,
      };
    }

    return {
      title: texts.alertOkTitle,
      type: 'success' as const,
      body: PaymentDate,
    };
  }, [texts, paymentStatus, PaymentDate]);


  return (
    <Alert
      description={parts.body}
      message={parts.title}
      type={parts.type}
      showIcon
    />
  );
}

const texts = {
  alertOkTitle: 'Hermano a plomo',
  alertDebitTitle: 'Hermano desplomado',
  alertLastPayment: 'Fecha de ultimo pago:',
  alertDebitAmount: 'Monto a deber:',
  alertLastPaymentNoDate: 'Sin fecha',

};
