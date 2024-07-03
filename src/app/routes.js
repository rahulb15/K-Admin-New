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
const JwtRegister = Loadable(
  lazy(() => import("app/views/sessions/JwtRegister"))
);
const ForgotPassword = Loadable(
  lazy(() => import("app/views/sessions/ForgotPassword"))
);
// E-CHART PAGE
const AppEchart = Loadable(
  lazy(() => import("app/views/charts/echarts/AppEchart"))
);
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));

//blog page
const CreateBlog = Loadable(lazy(() => import("app/views/blog/Create")));
const BlogList = Loadable(lazy(() => import("app/views/blog/List")));

// CONFIG PAGE
const PaymentGateway = Loadable(
  lazy(() => import("app/views/config/PaymentGateway"))
);
//ticker controller
const TickerController = Loadable(
  lazy(() => import("app/views/config/TickerController"))
);
//Layout
const Layout = Loadable(lazy(() => import("app/views/config/Layout")));

const Users = Loadable(lazy(() => import("app/views/users/users")));

const Deposits = Loadable(lazy(() => import("app/views/payments/Deposits")));
const Transactions = Loadable(
  lazy(() => import("app/views/payments/Transactions"))
);

const ApplyLaunchpad = Loadable(
  lazy(() => import("app/views/launchpad/apply-launchpad/ApplyLaunchpad"))
);

// {
//   name: "Blog",
//   path: "/blog",
//   icon: "description",
//   children: [
//     { name: "Create Blog", path: "/blog/create-blog", iconText: "CB" },
//     { name: "Blog List", path: "/blog/blog-list", iconText: "BL" }
//   ]
// },

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
      // blog route
      {
        path: "/blog/create-blog",
        element: <CreateBlog />,
        auth: authRoles.admin,
      },
      {
        path: "/blog/blog-list",
        element: <BlogList />,
        auth: authRoles.admin,
      },

      // config route
      {
        path: "/config/payment-gateway",
        element: <PaymentGateway />,
        auth: authRoles.admin,
      },
      {
        path: "/config/ticker-controller",
        element: <TickerController />,
        auth: authRoles.admin,
      },
      { path: "/config/layout", element: <Layout />, auth: authRoles.admin },
      // e-chart route
      {
        path: "/charts/echarts",
        element: <AppEchart />,
        auth: authRoles.editor,
      },
      // user route
      { path: "/users", element: <Users />, auth: authRoles.admin },
      // launchpad route
      {
        path: "/launchpad/apply-launchpad",
        element: <ApplyLaunchpad />,
        auth: authRoles.admin,
      },
      // deposit route
      {
        path: "/payments/deposits",
        element: <Deposits />,
        auth: authRoles.admin,
      },
      // transaction route
      {
        path: "/payments/transactions",
        element: <Transactions />,
        auth: authRoles.admin,
      },
    ],
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="/session/signin" /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
