import axios from "axios";

const url = "http://localhost:5000/api/v1";

//get all users with pagination and search with post api
const getAll = async (page: number, limit: number, search: string) => {
  try {
    const response = await axios.get(
      `${url}/transaction/getAll?limit=${limit}&page=${page}&search=${search}`
    );

    console.log("🚀 ~ getUsers ~ response:", response);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//get by id
const getById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/transaction/getById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export default {
  getAll,
  getById
};
