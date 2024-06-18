import axios from "axios";

const url = "http://localhost:5000/api/v1";

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

export default {
  login,
  createConfig,
  getConfig,
  getUsers
};
