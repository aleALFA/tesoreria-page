import { QueryClient, QueryClientProvider } from 'react-query'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import esES from 'antd/locale/es_ES'
import React from 'react'

import App from './modules/App'
import './index.css';

const queryClient = new QueryClient();

const theme = {
  token: {
    colorPrimary: '#fecaca', // tailwind Red-200
    colorBgBase: '#ffffff', //'#202020',
  },
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={esES} theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>,
)
