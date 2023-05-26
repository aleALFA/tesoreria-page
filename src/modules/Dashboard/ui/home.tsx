import { Button, Col, Divider, Row, Skeleton, Statistic } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import notification from "antd/es/notification";
import { useQuery } from 'react-query';
import CountUp from 'react-countup';

import { useDashboardRepo } from "../../common/application/context/repositories";
import UnauthorizedError from "../../common/domain/error/Unauthorized";
import { valueType } from "antd/es/statistic/utils";

export default function HomeDashboardView() {
  const [notify, contextHolder] = notification.useNotification();
  const repo = useDashboardRepo();

  const query = useQuery('dashboardIndex', {
    onError: (error: Error) => {
      return notify.error({
        message: texts.notificationErrorTitle,
        description: error instanceof UnauthorizedError? texts.errorUnauthorized : error.message,
        placement: 'top',
      });
    },
    queryFn: (context) => repo.index(context.signal),
    keepPreviousData: false,
    cacheTime: 0,
    retry: 2,
  });

  const rechargeData = useCallback(async () => {
    await query.refetch();
    notify.success({
      message: texts.reloadSuccess,
      placement: 'top',
    });
  }, [notify, query]);

  const formatterUp  = useMemo(
    () => (value: valueType) => <CountUp end={+value} separator="," decimals={2} />,
    [CountUp]
  );
  const showSkeleton = useMemo(() => query.isLoading || (query.error ?? null)!==null , [query]);
  const cashOut = useMemo(() => (query.data?.cash?.out || 0) / 100, [query]);
  const speiOut = useMemo(() => (query.data?.spei?.out || 0)/ 100, [query]);
  const cashIn = useMemo(() => (query.data?.cash?.in || 0) / 100, [query]);
  const speiIn = useMemo(() => (query.data?.spei?.in || 0)/ 100, [query]);

  return (<>
    {contextHolder}
    <div className="container mx-auto">
      <Row justify="space-between" align="middle">
        <h2>{texts.title}</h2>
        <Button type="primary" onClick={rechargeData}> {texts.rechargeButton} </Button>
      </Row>

      <Divider orientation="left">{texts.cash}</Divider>
      <Row justify="space-between" align="top" wrap>
        { showSkeleton ?
          <Skeleton paragraph={{ rows: 4 }} active />
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
          </>
        }
      </Row>

      <Divider orientation="left">{texts.spei}</Divider>
      <Row justify="space-between" align="top" wrap>
        { showSkeleton ?
          <Skeleton paragraph={{ rows: 4 }} active />
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
          </>
        }
      </Row>
    </div>
  </>);
}

const texts = {
  title: 'Bienvenido!',
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
