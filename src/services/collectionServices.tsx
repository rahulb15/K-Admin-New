import axios from "axios";

const url = process.env.REACT_APP_API_URL;

//create collection
const createCollection = async (data: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${url}/collection`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//get all users with pagination and search with post api
const getAll = async (page: number, limit: number, search: string) => {
  try {
    const response = await axios.get(
      `${url}/collection/getAll?limit=${limit}&page=${page}&search=${search}`
    );

    console.log("🚀 ~ getUsers ~ response:", response);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//update collection
const updateCollection = async (body:any,name:any) => {
  try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        url + "/launch-collection/update-admin/"+name,
          body,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      console.log(response, "response");
      return response;
  } catch (error) {
      console.error(error);
  }
};

export default {
  createCollection,
  getAll,
  updateCollection,
};
