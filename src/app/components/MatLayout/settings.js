import { themes } from "../MatTheme/initThemes";
import layout1Settings from "./Layout1/Layout1Settings";

// UPDATE BELOW CODE
// DOC http://demos.ui-lib.com/Mat-react-doc/layout.html
export const MatLayoutSettings = {
  activeLayout: "layout1", // layout1, layout2
  activeTheme: "blue", // View all valid theme colors inside MatTheme/themeColors.js
  perfectScrollbar: false,

  themes: themes,
  layout1Settings, // open Layout1/Layout1Settings.js

  secondarySidebar: {
    show: true,
    open: false,
    theme: "slateDark1" // View all valid theme colors inside MatTheme/themeColors.js
  },
  // Footer options
  footer: {
    show: true,
    fixed: false,
    theme: "slateDark1" // View all valid theme colors inside MatTheme/themeColors.js
  }
};
