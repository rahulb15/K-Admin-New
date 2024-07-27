import axios from "axios";

const url = process.env.REACT_APP_API_URL;

//create nft
const createNFT = async (data: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${url}/nft/create`, data, {
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
    createNFT,

};
