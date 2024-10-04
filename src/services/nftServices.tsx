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

// updateNFT
const updateNFT = async (data: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${url}/nft/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

const updateLaunchapdNFT = async (data: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${url}/nft/updateLaunchpad`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

// post updateRevealedNFTs
const updateRevealedNFTs = async (data: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${url}/nft/owned`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}








export default {
    createNFT,
    updateNFT,
    updateLaunchapdNFT,
    updateRevealedNFTs

};
