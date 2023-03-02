import { Layout } from 'antd';
import { useMemo } from 'react';

export default function LayoutFooter() {
  const year = useMemo(()=> new Date().getFullYear(), [])
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      <p>{text.legend}</p>
      <p>©{year}</p>
    </Layout.Footer>
  );
}

const text = {
  legend: 'Hecho por Jesus Alejandro Alvarez, permitido el uso para Dantón',
}