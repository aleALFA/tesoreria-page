import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import LoginView from "../../modules/Auth/ui/login";
import DashboardLayout from "../../modules/Dashboard/ui/layout";
import HomeDashboardView from "../../modules/Dashboard/ui/home";
import BrotherListView from "../../modules/Brother/ui/list";
import AddBrotherView from "../../modules/Brother/ui/add";
import PaymentListByBrotherView from "../../modules/Payment/ui/listByBrother";
import PaymentListView from "../../modules/Payment/ui/list";
import AddPaymentView from "../../modules/Payment/ui/add";

const basePath = import.meta.env.VITE_BASE_PATH_URI;

export const dashboardBrotherPaths = {
  index: basePath + '/dashboard/brother',
  list: basePath + '/dashboard/brother/list',
  add: basePath + '/dashboard/brother/add',
}
export const dashboardPaymentPaths = {
  index: basePath + '/dashboard/payment',
  list: basePath + '/dashboard/payment/list',
  listByBrother: basePath + '/dashboard/payment/list/brother',
  add: basePath + '/dashboard/payment/add',
}
export const dashboardPaths = {
  index: basePath+'/dashboard',
  brother: dashboardBrotherPaths,
  payment: dashboardPaymentPaths,
}
export const paths = {
  index: basePath,
  notFound: basePath+'/404',
  dashboard: dashboardPaths,
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.index}>
          <Route index element={<LoginView />} />

          <Route path={dashboardPaths.index} element={<DashboardLayout />} >
            <Route index element={<HomeDashboardView />} />

            <Route path={dashboardBrotherPaths.index}>
              <Route index element={<Navigate replace to={dashboardBrotherPaths.list} />} />
              <Route path={dashboardBrotherPaths.list} element={<BrotherListView />} />
              <Route path={dashboardBrotherPaths.add} element={<AddBrotherView />} />
            </Route>
            <Route path={dashboardPaymentPaths.index}>
              <Route index element={<Navigate replace to={dashboardPaymentPaths.listByBrother} />} />
              <Route path={dashboardPaymentPaths.list} element={<PaymentListView />} />
              <Route path={dashboardPaymentPaths.listByBrother} element={<PaymentListByBrotherView />} />
              <Route path={dashboardPaymentPaths.add} element={<AddPaymentView />} />
            </Route>
          </Route>

          <Route path="*" element={<LoginView />} />
        </Route>

        { basePath !== '/' && <Route index element={<Navigate replace to={paths.index} />} /> }
      </Routes>
    </BrowserRouter>
  );
}