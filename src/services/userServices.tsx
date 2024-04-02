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
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjZiMTA5Mzg4M2E5ZGM0ZTYzMmY5YiIsImlhdCI6MTcxMTQ1MDE0NywiZXhwIjoxNzExNTM2NTQ3fQ.P5M-uKbBiu_18AvppOTIewcdBSrySFmn3T_b9AXrM-s";
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

export default {
  login,
  createConfig,
  getConfig
};
