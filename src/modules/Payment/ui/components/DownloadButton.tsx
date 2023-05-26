import { DownloadOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import { useMemo } from 'react';
import { Button } from "antd";

export default function DownloadButton(params: ButtonProps) {
  const newParams = useMemo<ButtonProps>(() => ({
    ...params,
    icon: params.icon ?? <DownloadOutlined />,
    type: params.type ?? 'primary',
    size: params.size ?? 'small',
    block: params.block ?? true,
  }), [params]);
  return <Button {...newParams} />;
}
