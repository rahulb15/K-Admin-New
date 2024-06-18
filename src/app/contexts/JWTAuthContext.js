import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
// CUSTOM COMPONENT
import { MatLoading } from "app/components";
const url = "http://localhost:5000/api/v1";

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
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
  register: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    try {
      const user = await axios.post(`${url}/admin/login`, {
        email,
        password
      });
      console.log(user);
      if (user.data.status === "success") {
        dispatch({ type: "LOGIN", payload: { user: user.data.data } });
        localStorage.setItem("token", user.data.token);
      }
      return user.data;
      // dispatch({ type: "LOGIN", payload: { user } });
    } catch (error) {
      return error.response.data;
    }

    // const response = await axios.post("/api/auth/login", { email, password });
    // const { user } = response.data;
  };

  const register = async (email, username, password) => {
    const response = await axios.post("/api/auth/register", { email, username, password });
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
          dispatch({ type: "INIT", payload: { isAuthenticated: true, user: data.data } });
        }

        // dispatch({ type: "INIT", payload: { isAuthenticated: true, user: data.user } });
      } catch (err) {
        console.error(err);
        dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
      }
    })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialized) return <MatLoading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
