import { useCallback, useMemo, useState } from "react";
import { SnippetsOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import notification from "antd/es/notification";
import { useNavigate } from "react-router-dom";
import { Button, Space, Tag } from "antd";
import { useQuery } from "react-query";
import CountUp from "react-countup";
import Table from "antd/es/table";

import { statusColors as broStatusColors } from "../../Brother/domain/dictionaries";
import { BrotherPaymentProfile, PaymentStatusStatus } from '../domain/interfaces';
import { usePaymentRepo } from "../../common/application/context/repositories";
import UnauthorizedError from "../../common/domain/error/Unauthorized";
import TableHeader from "../../Brother/ui/components/listHeader";
import { BrotherStatus } from "../../Brother/domain/interfaces";
import { dashboardPaymentPaths } from "../../../config/router";
import { paymentStatusColors } from "../domain/dictionaries";

export default function PaymentListByBrotherView() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const repo = usePaymentRepo();

  const [search, setSearch] = useState('');
  const query = useQuery(['paymentListByBrother', search],
    async (context) => {
      let response = await repo.listByBrother(context.queryKey[1], context.signal);
      const hasBroName = (response.list[0]?.brother?.name?? null) !== null;
      if (hasBroName) {
        response.list.sort((a, b) => a.brother?.name?.localeCompare(b.brother?.name ?? '') ?? 1);
      }
      return response;
    }, {
    cacheTime: 0,
    retry: 2,
    onError: (error: Error) => {
      return api.error({
        message: texts.notificationErrorTitle,
        description: error instanceof UnauthorizedError? texts.errorUnauthorized : error.message,
        placement: 'top',
      });
    },
  });

  const columns: ColumnsType<BrotherPaymentProfile> = useMemo(() => [
    {
      title: texts.actions,
      render: (_, record) => <Space wrap size="middle">
        <Button
          onClick={() => navigate(`${dashboardPaymentPaths.list}?brother_id=${record.brother?.id}`)}
          icon={<SnippetsOutlined />}
          type="link">
          {texts.actionListReceipts}
        </Button>
      </Space>,
    },
    {
      title: texts.name,
      dataIndex: ['brother.name'],
      render: (_, record) => <a>{record.brother?.name ?? ''}</a>,
    },
    {
      title: texts.broStatus,
      dataIndex: ['brother.status'],
      render: (_, record) => statusBroTag(record.brother?.status),
      onFilter: (value, record) => record.brother?.status?.startsWith(`${value}`) ?? false,
      filters: [
        {
          text: texts.statusBroDic.ACTIVE,
          value: 'ACTIVE',
        },
        {
          text: texts.statusBroDic.FREE,
          value: 'FREE',
        },
        {
          text: texts.statusBroDic.OFF,
          value: 'OFF',
        },
        {
          text: texts.statusBroDic.CANDIDATE,
          value: 'CANDIDATE',
        },
      ],
      responsive: ["lg"],
    },
    {
      title: texts.status,
      dataIndex: ['paymentStatus.status'],
      render: (_, record) => statusTag(record.paymentStatus?.status),
      onFilter: (value, record) => record.paymentStatus?.status?.startsWith(`${value}`) ?? false,
      filters: [
        {
          text: texts.statusDic.OK,
          value: 'OK',
        },
        {
          text: texts.statusDic.DEBT,
          value: 'DEBT',
        },
      ],
    },
    {
      title: texts.debitAmount,
      dataIndex: ['paymentStatus.debitAmount'],
      render: (_, record) => <CountUp end={(record.paymentStatus?.debitAmount ?? 0) / 100} separator="," decimals={2} />,
      responsive: ["md"],
    },
    {
      title: texts.lastPaymentDate,
      dataIndex: ['paymentStatus.lastPaymentDate'],
      render: (_, record) => formatDate(record.paymentStatus?.lastPaymentDate),
      responsive: ["lg"],
    },
  ], []);

  const onSearch = useCallback(async (newSearch: string)=>{
    setSearch(() => newSearch);
    await query.refetch();
  }, [query, setSearch]);

  return (<>
    {contextHolder}
     <Table
      columns={columns}
      dataSource={query.data?.list}
      loading={query.isLoading}
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: true,
      }}
      rowKey={(record) => record.brother?.id ?? ''}
      scroll={{
        scrollToFirstRowOnChange: true,
        y: '60vh',
      }}
      title={() => <TableHeader
        loading={query.isLoading}
        onSearch={onSearch}
        placeholder={texts.searchPlaceholder}
        title={texts.title}
      />}
    />
  </>);
}

const texts = {
  title: 'Listado de pagos por Hermano',
  actions: 'Acciones',
  actionListReceipts: 'Ver recibos',
  name: "Nombre",
  status: "Estatus de pago",
  broStatus: "Estatus del Hermano",
  debitAmount: 'Monto a deber',
  lastPaymentDate: 'Fecha de ultimo pago',
  searchPlaceholder: 'Buscar por nombre',
  notificationErrorTitle: 'Error al consultar datos',
  errorUnauthorized: 'La sesión expiró, por favor ingresa nuevamente',
  unknown: 'desconocido',
  statusDic: {
    OK: "A plomo",
    DEBT: "Debe",
  },
  statusBroDic: {
    ACTIVE: "Activo",
    FREE: "Miembro libre",
    OFF: "En sueños",
    CANDIDATE: "Candidato",
  },
};

const statusBroTag = (status?: BrotherStatus) => {
  const color = status === undefined ? 'grey' : broStatusColors[status];
  const label = status === undefined ? texts.unknown : texts.statusBroDic[status];
  return (
    status === undefined ? null : <Tag color={color} key={status}>{label}</Tag>
  );
};
const statusTag = (status?: PaymentStatusStatus) => {
  const label = status === undefined ? texts.unknown : texts.statusDic[status];
  const color = status === undefined ? 'grey' : paymentStatusColors[status];
  return (
    status === undefined ? null : <Tag color={color} key={status}>{label}</Tag>
  );
};
const formatDate = (date?: string) => {
  const hasContent = (date ?? null) !== null;
  let text = texts.unknown;
  if (hasContent) {
    const dateObj = new Date(date as string);
    text = dateObj.toLocaleDateString('as-MX', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  }
  return (<p className="m-0">{text}</p>);
};
