import { CloseOutlined } from '@ant-design/icons';
import { createElement, useMemo } from 'react';
import { ButtonProps } from 'antd/lib/button';
import { Button, Row, Tooltip } from "antd";

export type PaymentItemPanelTitleProps = ButtonProps & {
  onRemove: (index: number, e?: Event) => void;
  showDeleteSinceIndex?: number;
  title?: React.ReactNode;
  index: number;
};

export default function PaymentItemPanelTitle (props: PaymentItemPanelTitleProps) {
  const buttonParams = useMemo(() => {
    const newParams = {...props};
    newParams.onClick = newParams.onClick ?? ((e: any) => props.onRemove(props.index, e));
    newParams.icon = newParams.icon ?? <CloseOutlined />;
    newParams.shape = newParams.shape ?? 'circle';
    newParams.type = newParams.type ?? 'primary';
    newParams.danger = newParams.danger ?? true;
    newParams.size = newParams.size ?? 'small';
    return newParams;
  }, [props]);
  const title = useMemo(() => {
    return props.title ?? <span>{texts.title.replace('{number}', `${props.index+1}`)}</span>;
  }, [props.index, props.title]);
  const showDeleteSinceIndex = useMemo(() => props.showDeleteSinceIndex ?? 0, [props.showDeleteSinceIndex]);

  return (
    <Row justify="space-between" align="middle">
      {title}
      {props.index > showDeleteSinceIndex && <Tooltip title={texts.buttonDelete}>
        {createElement(Button, buttonParams)}
      </Tooltip>}
    </Row>
  );
}

const texts = {
  title: 'Movimiento número {number}',
  buttonDelete: 'Eliminar item',
};
