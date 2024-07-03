import axios from "axios";

const url = process.env.REACT_APP_API_URL;

const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${url}/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const createConfig = async (key: string, value: string) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  try {
    const response = await axios.post(
      `${url}/config`,
      {
        key,
        value
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getConfig = async () => {
  try {
    const response = await axios.get(`${url}/config/key/ticker`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//get all users with pagination and search with post api
const getUsers = async (page: number, limit: number, search: string) => {
  try {
    const response = await axios.post(`${url}/user/getAllUsers`, {
      page,
      limit,
      search
    });

    console.log("🚀 ~ getUsers ~ response:", response)

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// getTotalUsers
const getTotalUsers = async (role: string) => {
  try {
    const token = localStorage.getItem("token");
    //make post api
    const response = await axios.post(`${url}/admin/getTotalUsers`, {
      role
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


const enable2FA = async (token: string) => {
  try {
      const config = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      };
      const response = await axios.post(
        url + "/admin/enableTwoFactorAuth",
          {},
          config
      );
      return response;
  } catch (error) {
      console.error(error);
  }
};

const verify2FA = async (body: any) => {
  try {
    const config = {
      headers: {
          Authorization: `Bearer ${body.jwtToken}`,
      },
  };
      const response = await axios.post(
        url + "/admin/verifyTwoFactorAuth",
          body,
          config
      );
      return response;
  } catch (error) {
      console.error(error);
  }
};


export default {
  login,
  createConfig,
  getConfig,
  getUsers,
  getTotalUsers,
  enable2FA,
  verify2FA
};
