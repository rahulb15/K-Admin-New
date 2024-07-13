import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { MatTheme } from "./components";
// ALL CONTEXTS
import { AuthProvider } from "./contexts/JWTAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
// ROUTES
import routes from "./routes";
// FAKE SERVER
import "../fake-db";

import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  const content = useRoutes(routes);

  return (
    <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
    <SettingsProvider>
      <AuthProvider>
        <MatTheme>
          <CssBaseline />
          {content}
        </MatTheme>
      </AuthProvider>
    </SettingsProvider>
    </PersistGate>
    </Provider>
  );
}
