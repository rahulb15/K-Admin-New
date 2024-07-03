import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
// CUSTOM COMPONENT
import { MatLoading } from "app/components";
import userServices from "services/userServices.tsx";
const url = "http://localhost:5000/api/v1";
const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID;
console.log(NETWORKID, "NETWORKID");

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    case "LOGIN": {
      return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    case "REGISTER": {
      const { user } = action.payload;

      return { ...state, isAuthenticated: true, user };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const eckoWalletConnect = async () => {
    console.log("eckoWalletConnect");
    const checkNetwork = await window.kadena.request({
      method: "kda_getNetwork",
    });
    if (
      (checkNetwork?.name === "Testnet" && NETWORKID === "testnet04") ||
      (checkNetwork?.name === "Mainnet" && NETWORKID === "mainnet01")
    ) {
      const response = await window.kadena.request({
        method: "kda_connect",
        networkId: NETWORKID,
      });
      console.log(response);

      if (response?.status === "success") {
        const account = await window.kadena.request({
          method: "kda_checkStatus",
          networkId: NETWORKID,
        });
        if (account?.status === "success") {
          return response;
        }
      } else {
        // Handle error case
      }
    } else {
      if (NETWORKID === "testnet04") {
        // alert("Please connect to Testnet");
        return {
          status: "error",
          message: "Please connect to Testnet",
        };
      } else {
        // alert("Please connect to Mainnet");
        return {
          status: "error",
          message: "Please connect to Mainnet",
        };
      }
    }
  };

  const enable2FA = async (token) => {
    // const token = localStorage.getItem("token");

    const response = await userServices.enable2FA(token || "");
    console.log(response);

    if (response?.data?.status === "success") {
      // setQrImage(response.data.data.qrCodeUrl);
      // setSecret(response.data.data.secret);
      // setIsTwoFactorModalOpen(true);
      const qrCodeUrl = response.data.data.qrCodeUrl;
      const secret = response.data.data.secret;
      console.log(qrCodeUrl, secret);

      return { qrCodeUrl, secret };
    } else {
      const qrCodeUrl = "";
      const secret = "";
      return { qrCodeUrl, secret };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await eckoWalletConnect();
      console.log(response);
      if (response.status === "success") {
        console.log(response);
        const user = await axios.post(`${url}/admin/login`, {
          email,
          password,
          walletAddress: response.account.account,
        });
        console.log(user);
        if (user.data.status === "success") {
          console.log(user.data.data.is2FAEnabled, "ddddddddddddddata");
          if (user.data.data.is2FAEnabled === false) {
            console.log("enable2FA");
            const twofadata = await enable2FA(user.data.token);
            console.log(twofadata);
            if (
              twofadata.qrCodeUrl &&
              twofadata.secret &&
              twofadata.qrCodeUrl !== "" &&
              twofadata.secret !== ""
            ) {
              dispatch({ type: "LOGIN", payload: { user: user.data.data } });
              // localStorage.setItem("token", user.data.token);
              user.data.data.qrCodeUrl = twofadata.qrCodeUrl;
              user.data.data.secret = twofadata.secret;
              user.data.data.is2FAModalOpen = true;
              return user.data;
            }
          } else {
            console.log("enable2FA");
            const twofadata = await enable2FA(user.data.token);
            console.log(twofadata);
            if (twofadata.secret && twofadata.secret !== "") {
              dispatch({ type: "LOGIN", payload: { user: user.data.data } });
              // localStorage.setItem("token", user.data.token);
              user.data.data.qrCodeUrl = twofadata.qrCodeUrl;
              user.data.data.secret = twofadata.secret;
              user.data.data.is2FAModalOpen = true;
              return user.data;
            }
          }

          // dispatch({ type: "LOGIN", payload: { user: user.data.data } });
          // localStorage.setItem("token", user.data.token);
        }else {
          return user.data;
        }

        // return user.data;
      } else {
        return response;
      }

      // dispatch({ type: "LOGIN", payload: { user } });
    } catch (error) {
      return error.response.data;
    }

    // const response = await axios.post("/api/auth/login", { email, password });
    // const { user } = response.data;
  };

  const register = async (email, username, password) => {
    const response = await axios.post("/api/auth/register", {
      email,
      username,
      password,
    });
    const { user } = response.data;

    dispatch({ type: "REGISTER", payload: { user } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) throw new Error("User not authenticated");
        const headers = { Authorization: `Bearer ${token}` };
        const { data } = await axios.post(`${url}/admin/me`, null, { headers });
        console.log(data);

        console.log(data);
        if (data.status === "success") {
          console.log(data.data);
          dispatch({
            type: "INIT",
            payload: { isAuthenticated: true, user: data.data },
          });
        }

        // dispatch({ type: "INIT", payload: { isAuthenticated: true, user: data.user } });
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: false, user: null },
        });
      }
    })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialized) return <MatLoading />;

  return (
    <AuthContext.Provider
      value={{ ...state, method: "JWT", login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
