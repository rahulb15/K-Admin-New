export const navigations = [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "PAGES", type: "label" },
  { name: "Users", path: "/users", icon: "people" },
  {
    name: "Launchpad",
    path: "/launchpad",
    icon: "launch",
    children: [
      {
        name: "Apply Launchpad",
        path: "/launchpad/apply-launchpad",
        iconText: "AL",
      },
      {
        name: "Priority Pass",
        path: "/launchpad/priority-pass",
        iconText: "SL",
      },
      

    ],
  },
  {
    name: "Payments",
    path: "/payments",
    icon: "payment",
    children: [
      { name: "Deposits", path: "/payments/deposits", iconText: "D" },
      // { name: "Withdrawals", path: "/payments/withdrawals", iconText: "W" },
      { name: "Transactions", path: "/payments/transactions", iconText: "T" },
    ],
  },

  {
    name: "Config",
    path: "/config",
    icon: "settings",
    children: [
      {
        name: "Payment Gateway",
        path: "/config/payment-gateway",
        iconText: "PG",
      },
      {
        name: "Ticker Controller",
        path: "/config/ticker-controller",
        iconText: "TC",
      },
      { name: "Layout", path: "/config/layout", iconText: "L" },
    ],
  },

  {
    name: "Blog",
    path: "/blog",
    icon: "description",
    children: [
      { name: "Create Blog", path: "/blog/create-blog", iconText: "CB" },
      { name: "Blog List", path: "/blog/blog-list", iconText: "BL" },
    ],
  },

  { name: "Settings", path: "/settings", icon: "settings" },
  // {
  //   name: "Session/Auth",
  //   icon: "security",
  //   children: [
  //     { name: "Sign in", iconText: "SI", path: "/session/signin" },
  //     { name: "Sign up", iconText: "SU", path: "/session/signup" },
  //     { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
  //     { name: "Error", iconText: "404", path: "/session/404" }
  //   ]
  // },
  // { label: "Components", type: "label" },
  // {
  //   name: "Components",
  //   icon: "favorite",
  //   badge: { value: "30+", color: "secondary" },
  //   children: [
  //     { name: "Auto Complete", path: "/material/autocomplete", iconText: "A" },
  //     { name: "Buttons", path: "/material/buttons", iconText: "B" },
  //     { name: "Checkbox", path: "/material/checkbox", iconText: "C" },
  //     { name: "Dialog", path: "/material/dialog", iconText: "D" },
  //     { name: "Expansion Panel", path: "/material/expansion-panel", iconText: "E" },
  //     { name: "Form", path: "/material/form", iconText: "F" },
  //     { name: "Icons", path: "/material/icons", iconText: "I" },
  //     { name: "Menu", path: "/material/menu", iconText: "M" },
  //     { name: "Progress", path: "/material/progress", iconText: "P" },
  //     { name: "Radio", path: "/material/radio", iconText: "R" },
  //     { name: "Switch", path: "/material/switch", iconText: "S" },
  //     { name: "Slider", path: "/material/slider", iconText: "S" },
  //     { name: "Snackbar", path: "/material/snackbar", iconText: "S" },
  //     { name: "Table", path: "/material/table", iconText: "T" }
  //   ]
  // },
];
