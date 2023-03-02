import { Alert, Button, Card, Col, Collapse, Form, Modal, Row, Select, Space, Tooltip } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import type { SelectProps } from 'antd/es/select';
import { CloseOutlined } from '@ant-design/icons';
import notification from "antd/es/notification";
import { useNavigate } from "react-router-dom";

import { usePaymentRepo } from "../../common/application/context/repositories";
import UnauthorizedError from "../../common/domain/error/Unauthorized";
import { SearchBrotherPaymentProfile } from "../domain/interfaces";
import AddPaymentItemComponent from "./components/AddPaymentItem";
import { dashboardPaymentPaths } from "../../../config/router";
import AddBatchRequest from "../domain/model/addBatch.request";
import { formatCurrency, formatDate } from "../../../config/constants";

export default function AddPaymentView() {
  const [api, notificationContextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const repo = usePaymentRepo();

  const newRequest = useCallback(() => {
    const newRequest = new AddBatchRequest();

    if (newRequest.items.length < 1) {
      newRequest.addItem({
        isGlobalMovement: true,
      } as any);
    }

    return newRequest;
  }, []);

  const [selectedBro, setSelectedBro] = useState<SearchBrotherPaymentProfile>();
  const [isSearchingBro, setIsSearchingBro] = useState(false);
  const [itemPayments, setItemPayments] = useState([true]);
  const [request, setRequest] = useState(newRequest());
  const [activePanel, setActivePanel] = useState('1');
  const [search, setSearch] = useState('');

  const rules = useMemo(() => request.getRules(), [request]);
  const timeoutToSearch = useRef(setTimeout(() => {}));
  const controller = useRef<AbortController>();

  const mutation = useMutation(
    async (payload: any) => {
      request.load(payload);
      request.formatItems((newPayload) => ({
        ...newPayload,
        isGlobalMovement: !newPayload.isGlobalMovement,
      }));
      return await repo.batch(request, controller.current?.signal);
    },
    {
      onError: (error: Error) => api.error({
        message: texts.notificationErroTitle,
        description: error instanceof UnauthorizedError? texts.errorUnauthorized : error.message,
        placement: 'top',
      }),
      onSuccess: () => {
        const counterText =  texts.modalSuccessBodyCounter;
        const message =  texts.modalSuccessBodyMessage;
        let secondsToGo = 10;

        const getContent = () => (
          <div>
            <p>{message}</p>
            <p>{counterText.replace('{sec}', `${secondsToGo}`)}</p>
          </div>
        );

        const instance = modal.success({
          title: texts.modalSuccessTitle,
          content: getContent(),
          onOk: () => navigate(dashboardPaymentPaths.listByBrother),
          okText: texts.modalSuccessButton,
        });
        const timer = setInterval(() => {
          secondsToGo -= 1;
          instance.update({
            content: getContent(),
          });
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          instance.destroy();
        }, secondsToGo * 1000);
      },
    }
  );
  const broQuery = useQuery(['searchPaymentBrother', search], async (context) => {
    return await repo.searchBrotherProfile(search, context.signal);
  });

  const handleSearch = useCallback((search: string) => {
    setIsSearchingBro(true);
    clearTimeout(timeoutToSearch.current);
    timeoutToSearch.current = setTimeout(async () => {
      setSearch(() => search);
      await broQuery.refetch();
      setIsSearchingBro(false);
    }, 500);
  }, [broQuery, setSearch, setIsSearchingBro, timeoutToSearch]);
  const onReset = useCallback((event: any) => {
    event.preventDefault();
    form.resetFields();
    setRequest(newRequest());
  }, [form, newRequest, setRequest]);
  const onAdd = useCallback((event?: any) => {
    event?.preventDefault();
    const lastIndex = itemPayments.length;
    form.setFieldValue(['items', lastIndex, 'description'], '');
    setItemPayments((value) => [...value, true]);
    setActivePanel(`${lastIndex + 1}`);
  }, [form, itemPayments, setItemPayments, setActivePanel]);
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
  const onSelectBro = useCallback((id: string) => {
    setSelectedBro(broQuery.data?.list?.find(({ brother }) => brother.id === id));
  }, [broQuery, setSelectedBro]);

  useEffect(() => {
    controller.current = new AbortController();
    () => controller.current?.abort();
  }, []);

  return (<>
    {notificationContextHolder}
    {modalContextHolder}
    <Card
      bordered={false}
      title={
        <h1 className="text-xl font-bold">
          {texts.cardTitle}
        </h1>
      }>
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
              <Select
                placeholder={texts.fields.brotherPlaceholder}
                options={mapBroOptions(broQuery.data?.list)}
                defaultActiveFirstOption={false}
                loading={isSearchingBro}
                onSearch={handleSearch}
                onSelect={onSelectBro}
                filterOption={false}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            {selectedBro?.paymentStatus?.status === 'OK' && <Alert
              description={<>
                <Row gutter={16} className="mb-2">
                  <Col className="gutter-row" span={12}>{texts.alertLastPayment}</Col>
                  <Col className="gutter-row" span={12}>{
                    selectedBro.paymentStatus.lastPaymentDate !== null ?
                    formatDate(selectedBro.paymentStatus.lastPaymentDate) :
                    texts.alertLastPaymentNoDate
                  }</Col>
                </Row>
              </>}
              message={texts.alertOkTitle}
              type="success"
              showIcon
            />}
            {selectedBro?.paymentStatus?.status === 'DEBT' && <Alert
              description={<>
                <Row gutter={16} className="mb-2">
                  <Col className="gutter-row" span={12}>{texts.alertLastPayment}</Col>
                  <Col className="gutter-row" span={12}>{
                    selectedBro.paymentStatus.lastPaymentDate !== null ?
                    formatDate(selectedBro.paymentStatus.lastPaymentDate) :
                    texts.alertLastPaymentNoDate
                  }</Col>
                </Row>
                <Row gutter={16}>
                  <Col className="gutter-row" span={12}>{texts.alertDebitAmount}</Col>
                  <Col className="gutter-row" span={12}>{formatCurrency(
                    (selectedBro.paymentStatus.debitAmount ?? 0) / 100
                  )}</Col>
                </Row>
              </>}
              message={texts.alertDebitTitle}
              type="error"
              showIcon
            />}
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
                header={<PanelTitle
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

        <Form.Item wrapperCol={{ span: 16 }}>
          <Space wrap size={50}>
            <Button
              htmlType="submit"
              type="primary">
              {texts.buttonAction}
            </Button>

            <Button htmlType="submit" onClick={onReset}>
              {texts.buttonReset}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  </>);
}

const texts = {
  cardTitle: 'Agregar movimientos de dinero nuevos',
  paymentItemTitle: 'Movimiento número {number}',
  buttonAddItem: 'Agregar movimiento',
  buttonAction: 'Guardar Movimientos',
  buttonReset: 'Limpiar formulario',
  buttonDelete: 'Eliminar item',
  fields: {
    brother: 'Hermano',
    brotherPlaceholder: 'Buscar por nombre',
  },
  alertOkTitle: 'Hermano a plomo',
  alertDebitTitle: 'Hermano desplomado',
  alertLastPayment: 'Fecha de ultimo pago:',
  alertDebitAmount: 'Monto a deber:',
  alertLastPaymentNoDate: 'Sin fecha',
  notificationErroTitle: 'Error al guardar',
  errorUnauthorized: 'La sesión expiró, por favor ingresa nuevamente',
  modalSuccessTitle: '¡Éxito!',
  modalSuccessBodyMessage: 'Movimientos guardados',
  modalSuccessBodyCounter: 'Este aviso se cerrará en {sec} segundos',
  modalSuccessButton: 'Regresar al listado',
};

const mapBroOptions = (list?: SearchBrotherPaymentProfile[]): SelectProps<object>['options'] => {
  if (list === undefined) return [];
  return list.map(({ brother }) => ({
    label: brother.name,
    value: brother.id,
  }));
}

interface PanelTitleProps {
  index: number;
  onRemove: (index: number, e?: Event) => void;
};
const PanelTitle = (props: PanelTitleProps) => {
return (<Row justify="space-between" align="middle">
  <span>{texts.paymentItemTitle.replace('{number}', `${props.index+1}`)}</span>
  {props.index>0 && <Tooltip title={texts.buttonDelete}>
    <Button
      onClick={(e) => props.onRemove(props.index, e as any)}
      icon={<CloseOutlined />}
      type="primary"
      shape="circle"
      size="small"
      danger
    />
  </Tooltip>}
  </Row>
)};
