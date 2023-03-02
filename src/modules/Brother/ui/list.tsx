import { useCallback, useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import notification from "antd/es/notification";
import { useQuery } from 'react-query';
import { Table, Tag } from 'antd';

import { useBrotherRepo } from '../../common/application/context/repositories';
import UnauthorizedError from '../../common/domain/error/Unauthorized';
import { Brother, BrotherStatus } from '../domain/interfaces';
import TableHeader from './components/listHeader';
import { statusColors } from '../domain/dictionaries';

export default function BrotherListView() {
  const [api, contextHolder] = notification.useNotification();
  const repo = useBrotherRepo();

  const [search, setSearch] = useState('');
  const query = useQuery(['brotherList', search],
    async (context) => {
      const response = await repo.list(context.queryKey[1], context.signal);
      response.list.sort((a, b) => a.name.localeCompare(b.name));
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

  const onSearch = useCallback(async (newSearch: string)=>{
    setSearch(() => newSearch);
    await query.refetch();
  }, [query, setSearch]);

  const columns: ColumnsType<Brother> = useMemo(() => [
    {
      title: texts.name,
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: texts.grade,
      dataIndex: 'grade',
      key: 'grade',
      render: (_, { grade }) => texts.gradesDic[grade ?? 'NO'],
      onFilter: (value, record) => (record.grade ?? 'NO').startsWith(`${value}`),
      filters: [
        {
          text: texts.gradesDic.M,
          value: 'M',
        },
        {
          text: texts.gradesDic.COM,
          value: 'COM',
        },
        {
          text: texts.gradesDic.APR,
          value: 'APR',
        },
        {
          text: texts.gradesDic.NO,
          value: 'NO',
        },
      ],
    },
    {
      title: texts.status,
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => statusTag(status),
      onFilter: (value, record) => record.status.startsWith(`${value}`),
      filters: [
        {
          text: texts.statusDic.ACTIVE,
          value: 'ACTIVE',
        },
        {
          text: texts.statusDic.FREE,
          value: 'FREE',
        },
        {
          text: texts.statusDic.OFF,
          value: 'OFF',
        },
        {
          text: texts.statusDic.CANDIDATE,
          value: 'CANDIDATE',
        },
      ],
    },
    {
      title: texts.init,
      dataIndex: 'init',
      key: 'init',
      render: (_, { init }) => (formatDate(init)),
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>Invite {record.name}</a>
    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
  ], []);

  return (<>
    {contextHolder}
     <Table
      columns={columns}
      dataSource={query.data?.list}
      footer={() => <p className="m-0 text-end">{texts.footerLegend
        .replace('{actual}', `${query.data?.list?.length || 0}`)
        .replace('{total}', `${query.data?.total || 0}`)
      }</p>}
      loading={query.isLoading}
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: true,
      }}
      rowKey={(record) => record.id}
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
  title: 'Listado de Hermanos',
  rechargeButton: 'Recargar datos',
  notificationErrorTitle: 'Error al consultar datos',
  errorUnauthorized: 'La sesión expiró, por favor ingresa nuevamente',
  reloadSuccess: 'Datos cargados correctamente',
  searchPlaceholder: 'Buscar por nombre',
  name: "Nombre",
  grade: "Grado",
  status: "Estatus",
  init: "Iniciación",
  unknown: "Desconocida",
  footerLegend: 'Mostrando {actual} de {total}',
  statusDic: {
    ACTIVE: "Activo",
    FREE: "Miembro libre",
    OFF: "En sueños",
    CANDIDATE: "Candidato",
  },
  gradesDic: {
    M: "Maestro",
    COM: "Compañero",
    APR: "Aprendiz",
    NO: "Sin grado",
  } as {[key:string]: string},
}

const statusTag = (status: BrotherStatus) => {
  return (
    <Tag color={statusColors[status]} key={status}>
      {texts.statusDic[status]}
    </Tag>
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
