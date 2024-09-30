import { Pact, createClient } from "@kadena/client"; // CUSTOM COMPONENT
import { MatLoading } from "app/components";
import axios from "axios";
import { NETWORK } from "../../constants/contextConstants";
import React, { createContext, useEffect, useReducer, useState } from "react";
import userServices from "services/userServices.tsx";
import ChainweaverModal from "app/components/ChainweaverModal";
const url = process.env.REACT_APP_API_URL;
const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID;
console.log(NETWORKID, "NETWORKID");

const API_HOST = NETWORK;
const client = createClient(API_HOST);
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
  superlogin: () => {},
  chainweaverConnect: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [chainweaverModalOpen, setChainweaverModalOpen] = useState(false);
  const [chainweaverAddressPromiseResolver, setChainweaverAddressPromiseResolver] = useState(null);

  const openChainweaverModal = () => {
    return new Promise((resolve) => {
      setChainweaverModalOpen(true);
      setChainweaverAddressPromiseResolver(() => resolve);
    });
  };

  const handleChainweaverSubmit = (address) => {
    setChainweaverModalOpen(false);
    if (chainweaverAddressPromiseResolver) {
      chainweaverAddressPromiseResolver(address);
    }
  };
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

  //   const setVerifiedAccount = async (accountName) => {
  //     try {
  //         let data = await Pact.fetch.local(
  //             {
  //                 pactCode: `(coin.details ${JSON.stringify(accountName)})`,
  //                 meta: Pact.lang.mkMeta(
  //                     "",
  //                     CHAIN_ID,
  //                     GAS_PRICE,
  //                     3000,
  //                     creationTime(),
  //                     600
  //                 ),
  //             },
  //             NETWORK
  //         );
  //         if (data.result.status === "success") {
  //             setLocalRes(data.result.data);
  //             return data.result;
  //         }
  //     } catch (e) {
  //         console.log(e);
  //     }
  // };

  // const getColCreator = async (colName) => {
  //   console.log("colName", colName);
  //   const pactCode = `(free.lptest001.get-collection-creator ${JSON.stringify(
  //     colName
  //   )})`;

  //   const transaction = Pact.builder
  //     .execution(pactCode)
  //     .setMeta({ chainId: "1" })
  //     .createTransaction();

  //   const response = await client.local(transaction, {
  //     preflight: false,
  //     signatureVerification: false,
  //   });

  //   if (response.result.status == "success") {
  //     // alert(`Sale is live`);
  //     console.log(response.result.data);
  //     return response.result.data;
  //   } else {
  //     alert(`CHECK CONSOLE`);
  //   }
  // };

  const chainweaverConnect = async (walletAddress) => {
    const admin = walletAddress;
    console.log(admin);
    const pactCode = `(coin.details ${JSON.stringify(admin)})`;
    console.log(pactCode);

    const transaction = Pact.builder
      .execution(pactCode)
      .setMeta({ chainId: "1" })
      .createTransaction();

    const response = await client.local(transaction, {
      preflight: false,
      signatureVerification: false,
    });
    console.log(response);

    return response.result;
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

  const superlogin = async (email, password, response) => {
    try {
      // const response = await eckoWalletConnect();
      // const response = await chainweaverConnect();
      console.log(response);
      if (response.status === "success") {
        console.log(response);
        const user = await axios.post(`${url}/superadmin/login`, {
          email,
          password,
          walletAddress: response.data.account,
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
        } else {
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

  // const login = async (username, password) => {
  //   try {
  //     const response = await eckoWalletConnect();
  //     console.log(response);
  //     if (response.status === "success") {
  //       console.log(response);
  //       const user = await axios.post(`${url}/admin/login`, {
  //         username,
  //         password,
  //         walletAddress: response.account.account,
  //       });
  //       console.log(user);
  //       if (user.data.status === "success") {
  //         console.log(user.data.data.is2FAEnabled, "ddddddddddddddata");
  //         if (user.data.data.is2FAEnabled === false) {
  //           console.log("enable2FA");
  //           const twofadata = await enable2FA(user.data.token);
  //           console.log(twofadata);
  //           if (
  //             twofadata.qrCodeUrl &&
  //             twofadata.secret &&
  //             twofadata.qrCodeUrl !== "" &&
  //             twofadata.secret !== ""
  //           ) {
  //             dispatch({ type: "LOGIN", payload: { user: user.data.data } });
  //             // localStorage.setItem("token", user.data.token);
  //             user.data.data.qrCodeUrl = twofadata.qrCodeUrl;
  //             user.data.data.secret = twofadata.secret;
  //             user.data.data.is2FAModalOpen = true;
  //             return user.data;
  //           }
  //         } else {
  //           console.log("enable2FA");
  //           const twofadata = await enable2FA(user.data.token);
  //           console.log(twofadata);
  //           if (twofadata.secret && twofadata.secret !== "") {
  //             dispatch({ type: "LOGIN", payload: { user: user.data.data } });
  //             // localStorage.setItem("token", user.data.token);
  //             user.data.data.qrCodeUrl = twofadata.qrCodeUrl;
  //             user.data.data.secret = twofadata.secret;
  //             user.data.data.is2FAModalOpen = true;
  //             return user.data;
  //           }
  //         }

  //         // dispatch({ type: "LOGIN", payload: { user: user.data.data } });
  //         // localStorage.setItem("token", user.data.token);
  //       } else {
  //         return user.data;
  //       }

  //       // return user.data;
  //     } else {
  //       return response;
  //     }

  //     // dispatch({ type: "LOGIN", payload: { user } });
  //   } catch (error) {
  //     return error.response.data;
  //   }

  //   // const response = await axios.post("/api/auth/login", { email, password });
  //   // const { user } = response.data;
  // };
  
  const login = async (username, password) => {
    try {
      // First, check username and password to determine wallet type
      const checkResponse = await axios.post(`${url}/user/check-user-auth`, {
        username,
        password,
      });
  
      if (checkResponse.data.status !== "success") {
        return checkResponse.data;
      }
  
      const { walletName } = checkResponse.data.data;
      console.log(walletName);
  
      let walletResponse;
      if (walletName === "Chainweaver") {
        // Open modal for Chainweaver address input
        const address = await openChainweaverModal(); // You need to implement this function
        walletResponse = await chainweaverConnect(address);
      } else if (walletName === "Ecko Wallet") {
        walletResponse = await eckoWalletConnect();
      } else {
        return { status: "error", message: "Unsupported wallet type" };
      }

      console.log(walletResponse);

  
      if (walletResponse.status !== "success") {
        return walletResponse;
      }
  
      // Proceed with login
      const loginData = {
        username,
        password,
        walletAddress: walletName === "Chainweaver" ? walletResponse.data.account : walletResponse.account.account,
      };
  
      const user = await axios.post(`${url}/admin/login`, loginData);
  
      if (user.data.status === "success") {
        if (!user.data.data.is2FAEnabled) {
          const twofadata = await enable2FA(user.data.token);
          if (twofadata.qrCodeUrl && twofadata.secret) {
            dispatch({ type: "LOGIN", payload: { user: user.data.data } });
            user.data.data.qrCodeUrl = twofadata.qrCodeUrl;
            user.data.data.secret = twofadata.secret;
            user.data.data.is2FAModalOpen = true;
            return user.data;
          }
        } else {
          const twofadata = await enable2FA(user.data.token);
          if (twofadata.secret) {
            dispatch({ type: "LOGIN", payload: { user: user.data.data } });
            user.data.data.qrCodeUrl = twofadata.qrCodeUrl;
            user.data.data.secret = twofadata.secret;
            user.data.data.is2FAModalOpen = true;
            return user.data;
          }
        }
      } else {
        return user.data;
      }
    } catch (error) {
      return error.response?.data || { status: "error", message: "An unexpected error occurred" };
    }
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
      value={{
        ...state,
        method: "JWT",
        login,
        superlogin,
        logout,
        register,
        chainweaverConnect,
      }}
    >
      {children}
      <ChainweaverModal
        open={chainweaverModalOpen}
        onClose={() => setChainweaverModalOpen(false)}
        onSubmit={handleChainweaverSubmit}
      />
    </AuthContext.Provider>
  );
};

export default AuthContext;
