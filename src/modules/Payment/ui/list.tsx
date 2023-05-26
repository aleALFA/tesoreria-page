import { Space, Table, Tag, notification } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from "react-query";

import { ListPaymentItem, PaymentItemType, paymentItemTypes } from "../domain/interfaces";
import { usePaymentRepo } from "../../common/application/context/repositories";
import { formatCurrency, formatDate } from "../../../config/constants";
import UnauthorizedError from "../../common/domain/error/Unauthorized";
import TableHeader from "../../Brother/ui/components/listHeader";
import { paymentTypeColors } from "../domain/dictionaries";
import DownloadButton from "./components/DownloadButton";
import ReceiptModal from "./components/ReceiptModal";

export default function PaymentListView() {
  const [notify, contextHolder] = notification.useNotification();
  const [searchParams] = useSearchParams();
  const repo = usePaymentRepo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptImage, setReceiptImage] = useState('');
  const [sequence, setSequence] = useState('');
  const [search, setSearch] = useState('');

  const onError = useCallback((error: Error) => {
    notify.error({
      message: texts.notificationErrorTitle,
      description: error instanceof UnauthorizedError? texts.errorUnauthorized : error.message,
      placement: 'top',
    });
  }, [notify, texts]);

  const query = useQuery(['paymentList', searchParams.get('brother_id'), search],
    async (context) => {
      return repo.list(context.queryKey[1] ?? undefined, context.queryKey[2], context.signal);
    }, {
    cacheTime: 0,
    retry: 2,
    onError,
  });
  const queryReceipt = useQuery(['movementReceipt', sequence], {
    queryFn: (context) => repo.getReceipt(context.queryKey[1], context.signal),
    onSuccess: (image) => setReceiptImage(image),
    enabled: sequence !== '',
    cacheTime: 0,
    retry: 2,
    onError,
  });

  const columns: ColumnsType<ListPaymentItem> = useMemo(() => [
    {
      title: texts.actions,
      dataIndex: ['id'],
      render: (_, record) => {
        const isIn = record.type == 'IN';

        return (<Space wrap size="middle">
          {isIn && <DownloadButton
            onClick={() => {
              setSequence(record.sequence);
              queryReceipt.refetch();
              setIsModalOpen(true);
            }}
            disabled={queryReceipt.isLoading}>
            {texts.actionDownloadReceipt}
          </DownloadButton>}
        </Space>);
      },
    },
    {
      title: texts.description,
      dataIndex: ['description'],
      responsive: ["lg"],
    },
    {
      title: texts.type,
      dataIndex: ['type'],
      render: (_, record) => typeTag(record.type),
      onFilter: (value, record) => record.type?.startsWith(`${value}`) ?? false,
      filters: [
        {
          text: texts.typeDic.IN,
          value: paymentItemTypes[0],
        },
        {
          text: texts.typeDic.OUT,
          value: paymentItemTypes[1],
        },
        {
          text: texts.typeDic.GIFT,
          value: paymentItemTypes[2],
        },
      ],
    },
    {
      title: texts.amount,
      dataIndex: ['amount'],
      render: (_, record) => formatCurrency(record.amount/100),
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ['ascend', 'descend'],
      responsive: ["md"],
    },
    {
      title: texts.date,
      dataIndex: ['date'],
      render: (_, record) => formatDate(record.date),
      sorter: (a, b) => +new Date(a.date) - +new Date(b.date),
      sortDirections: ['ascend', 'descend'],
    },
  ], []);

  const onSearch = useCallback(async (newSearch: string) => {
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
    <ReceiptModal
      sequence={sequence}
      receiptContent={receiptImage}
      isOpen={isModalOpen}
      isLoading={queryReceipt.isLoading}
      handleClose={() => setIsModalOpen(false)}
    />
  </>);
}

const texts = {
  title: 'Listado de movimientos',
  actions: 'Acciones',
  actionDownloadReceipt: 'Descargar recibo',
  date: "Fecha de movimiento",
  amount: "Monto",
  description: 'Descripción',
  type: 'Tipo de movimiento',
  searchPlaceholder: 'Buscar por fecha',
  notificationErrorTitle: 'Error al consultar datos',
  errorUnauthorized: 'La sesión expiró, por favor ingresa nuevamente',
  typeDic: {
    IN: 'Pago',
    OUT: 'Salida',
    GIFT: 'Condonación',
  },
};

const typeTag = (type: PaymentItemType) => {
  return (<Tag color={paymentTypeColors[type]} key={type}>{texts.typeDic[type]}</Tag>);
};
