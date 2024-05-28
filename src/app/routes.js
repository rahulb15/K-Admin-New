import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatLayout from "./components/MatLayout/MatLayout";

import materialRoutes from "app/views/material-kit/MaterialRoutes";

import AppTable from "./views/material-kit/tables/AppTable";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));
// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
// CONFIG PAGE
const PaymentGateway = Loadable(lazy(() => import("app/views/config/PaymentGateway")));
//ticker controller
const TickerController = Loadable(lazy(() => import("app/views/config/TickerController")));

const Users = Loadable(lazy(() => import("app/views/users/users")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      { path: "/dashboard", element: <Analytics />, auth: authRoles.admin },
      // config route
      { path: "/config/payment-gateway", element: <PaymentGateway />, auth: authRoles.admin },
      { path: "/config/ticker-controller", element: <TickerController />, auth: authRoles.admin },
      // e-chart route
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor },
      // user route
      { path: "/users", element: <Users />, auth: authRoles.admin },
    ]
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="/session/signin" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
