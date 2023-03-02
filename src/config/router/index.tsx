import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import LoginView from "../../modules/Auth/ui/login";
import DashboardLayout from "../../modules/Dashboard/ui/layout";
import HomeDashboardView from "../../modules/Dashboard/ui/home";
import BrotherListView from "../../modules/Brother/ui/list";
import AddBrotherView from "../../modules/Brother/ui/add";
import PaymentListByBrotherView from "../../modules/Payment/ui/listByBrother";
import AddPaymentView from "../../modules/Payment/ui/add";

export const dashboardBrotherPaths = {
  index: '/dashboard/brother',
  list: '/dashboard/brother/list',
  add: '/dashboard/brother/add',
}
export const dashboardPaymentPaths = {
  index: '/dashboard/payment',
  listByBrother: '/dashboard/payment/list/brother',
  add: '/dashboard/payment/add',
}
export const dashboardPaths = {
  index: '/dashboard',
  brother: dashboardBrotherPaths,
  payment: dashboardPaymentPaths,
}
export const paths = {
  index: '/',
  notFound: '/404',
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
              <Route path={dashboardPaymentPaths.listByBrother} element={<PaymentListByBrotherView />} />
              <Route path={dashboardPaymentPaths.add} element={<AddPaymentView />} />
            </Route>
          </Route>

          <Route path="*" element={<LoginView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}