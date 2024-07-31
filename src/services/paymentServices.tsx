import axios from "axios";

const url = process.env.REACT_APP_API_URL;

//get all users with pagination and search with post api
const getAll = async (page: number, limit: number, search: string) => {
  try {
    const token = localStorage.getItem("token");
    // const response = await axios.get(
    //   `${url}/transaction/getAll?limit=${limit}&page=${page}&search=${search}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    //post api
    const response = await axios.post(
      `${url}/transaction/getAll`,
      {
        limit: limit,
        page: page,
        search: search,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//get by id
const get = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${url}/transaction/getPaymentDetail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//get all  transactions
const getAllTransactions = async ( page: number, limit: number, search: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${url}/transaction/getAllTransactions`,
      {
        limit: limit,
        page: page,
        search: search,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("🚀 ~ getUsers ~ response:", response);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


const approveDeposit = async (id: string, address: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${url}/transaction/approveDeposit`,
      {
        id: id,
        address: address,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
}



export default {
  getAll,
  getById,
  get,
  getAllTransactions,
  approveDeposit
};
