import { Button, Card, Col, Collapse, Form, Row, Space, notification } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";

import { PaymentRepoBatchReturn } from "../infrastructure/repository/payment.repo";
import { usePaymentRepo } from "../../common/application/context/repositories";
import PaymentItemPanelTitle from "./components/PaymentItemPanelTitle";
import UnauthorizedError from "../../common/domain/error/Unauthorized";
import { SearchBrotherPaymentProfile } from "../domain/interfaces";
import AddPaymentItemComponent from "./components/AddPaymentItem";
import useBrotherSavedModal from "./components/BrotherSavedModal";
import BrotherStatusAlert from "./components/BrotherStatusAlert";
import { dashboardPaymentPaths } from "../../../config/router";
import AddBatchRequest from "../domain/model/addBatch.request";
import BrotherSearcher from "./components/BrotherSearcher";
import ReceiptModal from "./components/ReceiptModal";

export default function AddPaymentView() {
  const [notify, notificationContextHolder] = notification.useNotification();
  const { show: showModal, modalContextHolder } = useBrotherSavedModal();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const repo = usePaymentRepo();

  const [selectedBro, setSelectedBro] = useState<SearchBrotherPaymentProfile>();
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [request, setRequest] = useState(new AddBatchRequest());
  const [itemPayments, setItemPayments] = useState([true]);
  const [activePanel, setActivePanel] = useState('1');
  const [sequence, setSequence] = useState('');
  const [receipt, setReceipt] = useState('');

  const onError = useCallback((error: Error) => notify.error({
    message: texts.notificationErroTitle,
    description: error instanceof UnauthorizedError? texts.errorUnauthorized : error.message,
    placement: 'top',
  }), [notify, texts]);
  const rules = useMemo(() => request.getRules(), [request]);

  const queryReceipt = useQuery(['getReceipt', sequence], {
    queryFn: (context) => repo.getReceipt(context.queryKey[1], context.signal),
    onSuccess: (receipt) => setReceipt(receipt),
    enabled: receipt !== '',
    retry: 0,
    onError,
  });
  const mutation = useMutation(
    async (payload: any) => {
      request.load(payload);
      request.formatItems((newPayload) => ({
        ...newPayload,
        isGlobalMovement: !newPayload.isGlobalMovement,
      }));
      return await repo.batch(request);
    },
    {
      onSuccess: (movement: PaymentRepoBatchReturn) => {
        const { destroy: destroyModal } = showModal({
          timeout: 10000,
          onCancel: () => navigate(dashboardPaymentPaths.listByBrother),
          onOk: () => {
            setSequence(movement.sequence);
            setShowReceiptModal(true);
            queryReceipt.refetch();
            destroyModal();
          },
        });
      },
      retry: 0,
      onError,
    }
  );

  const onRemove = useCallback((index: number, event?: any) => {
    const itemValues = form.getFieldValue('items') as any[];
    const newLength = itemValues.length - 1;
    const isNotLastItemRemove = newLength > index;

    if (isNotLastItemRemove) {
      for (let indexToReplace = index; indexToReplace < itemValues.length; indexToReplace++) {
        itemValues[indexToReplace] = itemValues[indexToReplace + 1];
      }
    }
    setItemPayments((value) => {
      const copy = [...value];
      copy.splice(index, 1);
      return copy;
    });
    event?.preventDefault();
  }, [form, setItemPayments]);

  const onAdd = useCallback((event?: any) => {
    event?.preventDefault();
    const lastIndex = itemPayments.length;
    form.setFieldValue(['items', lastIndex, 'description'], '');
    setItemPayments((value) => [...value, true]);
    setActivePanel(`${lastIndex + 1}`);
  }, [form, itemPayments, setItemPayments, setActivePanel]);

  const onReset = useCallback((event: any) => {
    setRequest(new AddBatchRequest());
    setSelectedBro(undefined);
    event.preventDefault();
    form.resetFields();
  }, [form, setRequest]);

  return (<>
    {notificationContextHolder}
    {modalContextHolder}

    <Card
      title={<h1 className="text-xl font-bold"> {texts.cardTitle} </h1>}
      bordered={false}>
      <Form
        form={form}
        name="newBatchPayment"
        scrollToFirstError
        initialValues={{ remember: true }}
        disabled={mutation.isLoading}
        onFinish={mutation.mutate}
        requiredMark="optional"
        layout="vertical">

        <Row className="mb-4" justify="space-between" wrap>
          <Col span={12}>
            <Form.Item
              label={texts.fields.brother}
              rules={rules.brother_id}
              name="brother_id">
              <BrotherSearcher
                onSelect={setSelectedBro}
                repo={repo}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            {selectedBro?.paymentStatus && <BrotherStatusAlert paymentStatus={selectedBro.paymentStatus} />}
          </Col>
        </Row>

        <Form.Item>
          <Collapse
            onChange={(key) => setActivePanel(key as string)}
            defaultActiveKey={['1']}
            activeKey={activePanel}
            bordered={false}
            accordion>
            {itemPayments.map((_, index)=>(
              <Collapse.Panel
                header={<PaymentItemPanelTitle
                  onRemove={onRemove}
                  index={index}
                />}
                key={index + 1}>
                <AddPaymentItemComponent
                  key={index}
                  index={index}
                  rules={rules.items}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </Form.Item>

        <Form.Item>
          <Row justify="center" align="middle">
            <Button
              onClick={onAdd}
              htmlType="submit"
              type="dashed"
              size="large">
              {texts.buttonAddItem}
            </Button>
          </Row>
        </Form.Item>

        <Form.Item>
          <Row justify="end">
            <Space wrap size={50}>
              <Button htmlType="submit" onClick={onReset}>
                {texts.buttonReset}
              </Button>

              <Button
                htmlType="submit"
                type="primary">
                {texts.buttonAction}
              </Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
    </Card>

    <ReceiptModal
      sequence={sequence}
      receiptContent={receipt}
      isOpen={showReceiptModal}
      isLoading={queryReceipt.isLoading}
      handleClose={() => setShowReceiptModal(false)}
    />
  </>);
}

const texts = {
  cardTitle: 'Agregar movimientos de dinero nuevos',
  buttonAddItem: 'Agregar movimiento',
  buttonAction: 'Guardar Movimientos',
  buttonReset: 'Limpiar formulario',
  fields: {
    brother: 'Hermano',
  },
  notificationErroTitle: 'Error al guardar',
  errorUnauthorized: 'La sesión expiró, por favor ingresa nuevamente',
};
