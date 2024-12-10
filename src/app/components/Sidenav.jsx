// Sidenav.js

import { Fragment } from "react";
import { styled } from "@mui/material/styles";
import Scrollbar from "react-perfect-scrollbar";
import useAuth from "app/hooks/useAuth";
import { MatVerticalNav } from "app/components";
import useSettings from "app/hooks/useSettings";

const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: "1rem",
  paddingRight: "1rem",
  position: "relative"
}));

const SideNavMobile = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  width: "100vw",
  background: "rgba(0, 0, 0, 0.54)",
  [theme.breakpoints.up("lg")]: { display: "none" }
}));

export default function Sidenav({ children }) {
  const { settings, updateSettings } = useSettings();
  const { login, user } = useAuth();

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings
        }
      }
    });
  };

  const navigations = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard", roles: ["superadmin"] },
    { label: "PAGES", type: "label", roles: ["superadmin"] },
    { name: "Users", path: "/users", icon: "people", roles: ["superadmin"] },
    { name: "Launchpad", path: "/launchpad", icon: "launch", roles: ["superadmin", "admin", "user"], children: [
      { name: "Apply Launchpad List", path: "/launchpad/apply-launchpad-list", iconText: "AL", roles: ["superadmin"] },
      { name: "Launchpad Functions", path: "/launchpad/launchpad-functions", iconText: "LF", roles: ["superadmin"] },
      { name: "Priority Pass", path: "/launchpad/priority-pass", iconText: "SL", roles: ["superadmin"] },
      { name: "Apply Launchpad", path: "/admin/launchpad/apply-launchpad", iconText: "AL", roles: ["user"] },
      { name: "Application List", path: "/admin/application-list", iconText: "AL", roles: ["user"] }



    ] },
    { name: "Blog", path: "/blog", icon: "description", roles: ["superadmin"], children: [
      { name: "Create Blog", path: "/blog/create-blog", iconText: "CB", roles: ["superadmin"] },
      { name: "Blog List", path: "/blog/blog-list", iconText: "BL", roles: ["superadmin"] }
    ] },
    { name: "Payments", path: "/payments", icon: "payment", roles: ["superadmin"], children: [
      { name: "Deposits", path: "/payments/deposits", iconText: "D", roles: ["superadmin"] },
      { name: "Transactions", path: "/payments/transactions", iconText: "T", roles: ["superadmin"] }
    ] },
    { name: "Music Manager", path: "/music-manager", icon: "music_note", roles: ["superadmin"] },
    { name: "Support Manager", path: "/support-manager", icon: "support", roles: ["superadmin"] },
    { name: "Connect Manager", path: "/connect-manager", icon: "connect_without_contact", roles: ["superadmin"] },
    { name: "Config", path: "/config", icon: "settings", roles: ["superadmin"], children: [
      { name: "Payment Gateway", path: "/config/payment-gateway", iconText: "PG", roles: ["superadmin"] },
      { name: "Ticker Controller", path: "/config/ticker-controller", iconText: "TC", roles: ["superadmin"] },
      { name: "Layout", path: "/config/layout", iconText: "L", roles: ["superadmin"] }
    ] },
    { name: "Settings", path: "/settings", icon: "settings", roles: ["superadmin"] }
  ];

  const filteredNavigations = navigations.filter(navItem => {
    console.log(navItem.roles + " " + user?.role);

    if (navItem.roles.includes(user?.role)) {
      if (navItem.children) {
        navItem.children = navItem.children.filter(childItem => childItem.roles.includes(user?.role));
      }
      return true;
    }
    return false;
  });

  return (
    <Fragment>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        {children}
        <MatVerticalNav items={filteredNavigations} />
      </StyledScrollBar>
      <SideNavMobile onClick={() => updateSidebarMode({ mode: "close" })} />
    </Fragment>
  );
}
