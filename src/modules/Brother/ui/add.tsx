import { Button, Card, DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import NewMemberRequest, { NewMemberRequestProps } from "../domain/model/newMember.request";
import { useBrotherRepo } from "../../common/application/context/repositories";
import UnauthorizedError from "../../common/domain/error/Unauthorized";
import { brotherGrades, brotherStatus} from "../domain/interfaces";
import { dashboardBrotherPaths } from "../../../config/router";
import { dateInputFormat } from "../../../config/constants";

export default function AddBrotherView() {
  const [api, contextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const repo = useBrotherRepo();

  const controller = useRef<AbortController>();
  const request = useMemo(() => new NewMemberRequest(), []);
  const rules = useMemo(() => request.getRules(), [request]);

  const mutation = useMutation(
    async (payload: NewMemberRequestProps) => {
      request.load(payload);
      return await repo.save(request, controller.current?.signal);
    },
    {
      onError: (error: Error) => api.error({
        message: texts.notificationErroTitle,
        description: error instanceof UnauthorizedError? texts.errorUnauthorized : error.message,
        placement: 'top',
      }),
      onSuccess: (member: any) => {
        const message =  texts.modalSuccessBodyMessage.replace('{id}', member.id);
        const counterText =  texts.modalSuccessBodyCounter;
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
          onOk: () => navigate(dashboardBrotherPaths.list),
          okText: texts.modalSuccessButton
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

  useEffect(() => {
    controller.current = new AbortController();
    () => controller.current?.abort();
  }, [controller]);

  return (<>
    {contextHolder}
    {modalContextHolder}
    <Card
      bordered={false}
      title={
        <h1 className="text-xl font-bold">
          {texts.cardTitle}
        </h1>
      }>
      <Form
        name="newMember"
        scrollToFirstError
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: false }}
        disabled={mutation.isLoading}
        onFinish={mutation.mutate}>
        <Form.Item
          label={texts.nameLabel}
          rules={rules.name}
          name="name">
          <Input />
        </Form.Item>

        <Form.Item
          label={texts.statusLabel}
          rules={rules.status}
          name="status">
          <Select
            showArrow
            options={statusSelectOptions}
          />
        </Form.Item>

        <Form.Item
          label={texts.gradeLabel}
          rules={rules.grade}
          name="grade">
          <Select
            showArrow
            options={gradesSelectOptions}
          />
        </Form.Item>

        <Form.Item
          style={{ width: '100%' }}
          label={texts.bornLabel}
          rules={rules.born}
          name="born">
          <DatePicker
            format={(value) => value.format(dateInputFormat)}
            allowClear
          />
        </Form.Item>

        <Form.Item
          style={{ width: '100%' }}
          label={texts.initLabel}
          rules={rules.init}
          name="init">
          <DatePicker format={(value) => value.format(dateInputFormat)} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button
            htmlType="submit"
            type="primary">
            {texts.buttonAction}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </>);
}

const texts = {
  cardTitle: 'Agregar un miembro nuevo',
  notificationErroTitle: 'Error al guardar',
  errorUnauthorized: 'La sesión expiró, por favor ingresa nuevamente',
  modalSuccessTitle: '¡Éxito!',
  modalSuccessBodyMessage: 'Miembro guardado con la referencia {id}',
  modalSuccessBodyCounter: 'Este aviso se cerrará en {sec} segundos',
  modalSuccessButton: 'Regresar al listado',
  nameLabel: 'Nombre completo del miembro',
  statusLabel: 'Estado del miembro',
  gradeLabel: 'Grado del miembro (Opcional)',
  bornLabel: 'Fecha de del miembro (Opcional)',
  initLabel: 'Fecha de iniciación del miembro (Opcional)',
  buttonAction: 'Guardar miembro',
  statusDic: {
    ACTIVE: "Activo",
    FREE: "Miembro libre",
    OFF: "En sueños",
    CANDIDATE: "Candidato",
  } as {[key: string]: string},
  gradesDic: {
    M: "Maestro",
    COM: "Compañero",
    APR: "Aprendiz",
    '': "",
  } as {[key: string]: string},
}

const gradesSelectOptions = ['', ...brotherGrades].map((grade) => ({
  value: grade,
  label: texts.gradesDic[grade],
}));
const statusSelectOptions = brotherStatus.map((status) => ({
  value: status,
  label: texts.statusDic[status],
}));
