// routes.js

import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";
import Loadable from "./components/Loadable";
import MatLayout from "./components/MatLayout/MatLayout";

const NotFound = Loadable(lazy(() => import("app/views/super-admin/sessions/NotFound")));
const JwtSuperLogin = Loadable(lazy(() => import("app/views/super-admin/sessions/JwtLogin")));
const JwtAdminLogin = Loadable(lazy(() => import("app/views/admin/sessions/JwtAdminLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/super-admin/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/admin/sessions/ForgotPassword")));
const ForgotPasswordSuper = Loadable(lazy(() => import("app/views/super-admin/sessions/ForgotPassword")));
const ResetPassword = Loadable(lazy(() => import("app/views/admin/sessions/ResetPassword")));
const ResetPasswordSuper = Loadable(lazy(() => import("app/views/super-admin/sessions/ResetPassword")));

// Super Admin Pages
const Analytics = Loadable(lazy(() => import("app/views/super-admin/dashboard/Analytics")));
const CreateBlog = Loadable(lazy(() => import("app/views/super-admin/blog/Create")));
const BlogList = Loadable(lazy(() => import("app/views/super-admin/blog/List")));
const PaymentGateway = Loadable(lazy(() => import("app/views/super-admin/config/PaymentGateway")));
const TickerController = Loadable(lazy(() => import("app/views/super-admin/config/TickerController")));
const Layout = Loadable(lazy(() => import("app/views/super-admin/config/Layout")));
const Users = Loadable(lazy(() => import("app/views/super-admin/users/users")));
const Deposits = Loadable(lazy(() => import("app/views/super-admin/payments/Deposits")));
const Transactions = Loadable(lazy(() => import("app/views/super-admin/payments/Transactions")));
const ApplyLaunchpadAdmin = Loadable(lazy(() => import("app/views/super-admin/launchpad/apply-launchpad/ApplyLaunchpad")));
const LaunchpadFunctions = Loadable(lazy(() => import("app/views/super-admin/launchpad/launchpad-functions/LaunchpadFunctions")));
const PriorityPass = Loadable(lazy(() => import("app/views/super-admin/launchpad/priority-pass/PriorityPass")));
const MusicManager = Loadable(lazy(() => import("app/views/super-admin/music/AdminMusicManager")));
const SupportManager = Loadable(lazy(() => import("app/views/super-admin/support/SupportManager")));
const ConnectManager = Loadable(lazy(() => import("app/views/super-admin/connect/ConnectManager")));

// Admin Pages
const ApplyLaunchpad = Loadable(lazy(() => import("app/views/admin/launchpad/apply-launchpad/ApplyLaunchpad")));
const ApplicationList = Loadable(lazy(() => import("app/views/admin/application-list/list/List")));
const ActionPage = Loadable(lazy(() => import("app/views/admin/launchpad/apply-launchpad/shared/ActionPage")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatLayout />
      </AuthGuard>
    ),
    children: [
      // Super Admin Routes
      { path: "/dashboard", element: <Analytics />, auth: authRoles.superadmin },
      { path: "/blog/create-blog", element: <CreateBlog />, auth: authRoles.superadmin },
      { path: "/blog/blog-list", element: <BlogList />, auth: authRoles.superadmin },
      { path: "/config/payment-gateway", element: <PaymentGateway />, auth: authRoles.superadmin },
      { path: "/config/ticker-controller", element: <TickerController />, auth: authRoles.superadmin },
      { path: "/config/layout", element: <Layout />, auth: authRoles.superadmin },
      { path: "/users", element: <Users />, auth: authRoles.superadmin },
      { path: "/payments/deposits", element: <Deposits />, auth: authRoles.superadmin },
      { path: "/payments/transactions", element: <Transactions />, auth: authRoles.superadmin },
      { path: "/launchpad/apply-launchpad-list", element: <ApplyLaunchpadAdmin />, auth: authRoles.superadmin },
      { path: "/launchpad/launchpad-functions", element: <LaunchpadFunctions />, auth: authRoles.superadmin },
      { path: "/launchpad/priority-pass", element: <PriorityPass />, auth: authRoles.superadmin },
      { path: "/music-manager", element: <MusicManager />, auth: authRoles.superadmin },
      { path: "/support-manager", element: <SupportManager />, auth: authRoles.superadmin },
      { path: "/connect-manager", element: <ConnectManager />, auth: authRoles.superadmin },
      
      // Admin Routes
      { path: "/admin/launchpad/apply-launchpad", element: <ApplyLaunchpad />, auth: authRoles.admin },
      { path: "/admin/launchpad/apply-launchpad/action-page", element: <ActionPage />, auth: authRoles.admin },
      { path: "/admin/application-list", element: <ApplicationList />, auth: authRoles.admin },
    ],
  },
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtAdminLogin /> },
  { path: "/session/su-signin", element: <JwtSuperLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },
  { path: "/session/forgot-password-user", element: <ForgotPasswordSuper /> },
  { path: "/session/reset-password/:token", element: <ResetPassword /> },
  { path: "/session/reset-password-user/:token", element: <ResetPasswordSuper /> },
  { path: "/su", element: <Navigate to="/session/su-signin" /> },
  { path: "/", element: <Navigate to="/session/signin" /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
