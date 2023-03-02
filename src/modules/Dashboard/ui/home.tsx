import { Button, Col, Divider, Row, Skeleton, Statistic } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import notification from "antd/es/notification";
import { useQuery } from 'react-query';
import CountUp from 'react-countup';

import { useDashboardRepo } from "../../common/application/context/repositories";
import UnauthorizedError from "../../common/domain/error/Unauthorized";
import { valueType } from "antd/es/statistic/utils";

export default function HomeDashboardView() {
  const repo = useDashboardRepo();
  const [api, contextHolder] = notification.useNotification();
  const query = useQuery('dashboardIndex', () => repo.index(controller.current?.signal), {
    cacheTime: 0,
    retry: 2,
    onError: (error: Error) => {
      return api.error({
        message: texts.notificationErrorTitle,
        description: error instanceof UnauthorizedError? texts.errorUnauthorized : error.message,
        placement: 'top',
      });
    }
  });

  const controller = useRef<AbortController>();

  const rechargeData = useCallback(async () => {
    controller.current = new AbortController();
    await query.refetch();
    api.success({
      message: texts.reloadSuccess,
      placement: 'top',
    });
  }, [api, controller, query]);

  const formatterUp  = useMemo(
    () => (value: valueType) => <CountUp end={+value} separator="," decimals={2} />,
    [CountUp]
  );
  const showSkeleton = useMemo(() => query.isLoading || (query.error ?? null)!==null , [query]);
  const cashOut = useMemo(() => (query.data?.cash?.out || 0) / 100, [query]);
  const speiOut = useMemo(() => (query.data?.spei?.out || 0)/ 100, [query]);
  const cashIn = useMemo(() => (query.data?.cash?.in || 0) / 100, [query]);
  const speiIn = useMemo(() => (query.data?.spei?.in || 0)/ 100, [query]);


  useEffect(() => {
    controller.current = new AbortController();
    () => controller.current?.abort();
  }, [controller]);

  return (<>
    {contextHolder}
    <div className="container mx-auto">
      <Row justify="space-between" align="middle">
          <h2>{texts.title}</h2>
          <Button type="primary" onClick={rechargeData}>
            {texts.rechargeButton}
          </Button>
      </Row>
      <Divider orientation="left">{texts.numberSection}</Divider>

      <Row justify="space-between" align="top">
        <Col span={12} sm={{ span: 24 }}>
          <h3>{texts.cash}</h3>

          <Row gutter={16}>
            { showSkeleton ?
              <Skeleton paragraph={{ rows: 4 }} />
              : <>
              <Col span={12}>
                <Statistic title={texts.in} value={cashIn} formatter={formatterUp} />
              </Col>
              <Col span={12}>
                <Statistic title={texts.out} value={cashOut} formatter={formatterUp} />
              </Col>
              <Col span={12}>
                <Statistic title={texts.gift} value={(query.data?.cash?.gift || 0) / 100} formatter={formatterUp} />
              </Col>
              <Col span={12}>
                <Statistic title={texts.total} value={cashIn - cashOut} formatter={formatterUp} />
              </Col>
            </>}
          </Row>
        </Col>
        <Col span={12} sm={{ span: 24 }}>
          <h3>{texts.spei}</h3>

          <Row gutter={16}>
            { showSkeleton ?
              <Skeleton paragraph={{ rows: 4 }} />
              : <>
              <Col span={12}>
                <Statistic title={texts.in} value={speiIn} formatter={formatterUp} />
              </Col>
              <Col span={12}>
                <Statistic title={texts.out} value={speiOut} formatter={formatterUp} />
              </Col>
              <Col span={12}>
                <Statistic title={texts.gift} value={(query.data?.spei?.gift || 0) / 100} formatter={formatterUp} />
              </Col>
              <Col span={12}>
                <Statistic title={texts.total} value={speiIn - speiOut} formatter={formatterUp} />
              </Col>
            </>}
          </Row>
        </Col>
      </Row>
    </div>
  </>);
}

const texts = {
  title: 'Bienvenido!',
  numberSection: 'Números generales',
  cash: 'Efectivo:',
  spei: 'Digital:',
  in: 'Entradas:',
  out: 'Salidas:',
  gift: 'Condonado:',
  total: 'Total: ',
  rechargeButton: 'Recargar datos',
  notificationErrorTitle: 'Error al consultar datos',
  errorUnauthorized: 'La sesión expiró, por favor ingresa nuevamente',
  reloadSuccess: 'Datos cargados correctamente',
}
