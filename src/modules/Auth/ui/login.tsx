import { Button, Card, Form, Input, notification } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useMutation } from 'react-query';

import { useAuthRepo } from '../../common/application/context/repositories';
import { useAccess } from '../application/context/access';
import LoginRequest from '../domain/model/login.request';
import { dashboardPaths } from '../../../config/router';
import Session from '../domain/model/session';


export default function LoginView() {
  const request = useMemo(() => new LoginRequest(), []);
  const rules = useMemo(() => request.getRules(), [request]);

  const controller = useRef<AbortController>();

  const [api, contextHolder] = notification.useNotification();
  const { setToken } = useAccess();
  const navigate = useNavigate();
  const repo = useAuthRepo();
  const mutation = useMutation(
    async (payload: any) => {
      request.secret = payload.password;
      request.user = payload.user;
      return await repo.login(request, controller.current?.signal);
    },
    {
      onError: (error: Error) => api.error({
        message: texts.notificationTitle,
        description: error.message,
        placement: 'top',
      }),
      onSuccess: (sessionRaw) => {
        const session = new Session(sessionRaw);
        session.store();
        setToken(session.access.token);
        navigate(dashboardPaths.index);
      },
    }
  );

  useEffect(() => {
    controller.current = new AbortController();
    () => controller.current?.abort();
  }, [controller])

  return (
    <div className="h-screen flex flex-row justify-center items-center bg-slate-200">
      {contextHolder}
      <Card
        title={
          <h1 className="text-3xl font-bold text-center">
            {texts.cardTitle}
          </h1>
        }>
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          disabled={mutation.isLoading}
          onFinish={mutation.mutate}>
          <Form.Item
            label={texts.userLabel}
            rules={rules.user}
            name="user">
            <Input />
          </Form.Item>

          <Form.Item
            label={texts.passwordLabel}
            rules={rules.secret}
            name="password">
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              className="btn btn-blue"
              htmlType="submit"
              type="primary"
              disabled={mutation.isLoading}>
              {texts.buttonAction}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

const texts = {
  cardTitle: 'Bienvenido',
  userLabel: 'Usuario',
  passwordLabel: 'Contraseña',
  buttonAction: 'Ingresar',
  notificationTitle: 'Error al ingresar',
};