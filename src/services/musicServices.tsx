import axios from "axios";

const url = process.env.REACT_APP_API_URL;

// //create nft
// const createNFT = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.post(`${url}/nft/create`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// };

// // updateNFT
// const updateNFT = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.put(`${url}/nft/update`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// }

// const updateLaunchapdNFT = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.put(`${url}/nft/updateLaunchpad`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// }

// // post updateRevealedNFTs
// const updateRevealedNFTs = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.post(`${url}/nft/owned`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// }

// const getRandomUris = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.post(`${url}/nft/randomUris`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// }

// // updateNFTWithRandomUri
// const updateNFTWithRandomUri = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.put(`${url}/nft/updateRandomUri`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// }

// const token = localStorage.getItem("token");
// const response = await axios.post(
//   "http://localhost:5000/api/v1/music/upload",
//   formData,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );

const uploadMusic = async (formData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${url}/music/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// const token = localStorage.getItem("token");
// const response = await axios.get(
//   `http://localhost:5000/api/v1/music/list?page=${page}&limit=${limit}&search=${search}`,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );

const getMusicList = async (page: number, limit: number, search: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${url}/music/list?page=${page}&limit=${limit}&search=${search}`,
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

// const token = localStorage.getItem("token");
// await axios.delete(
//   `http://localhost:5000/api/v1/music/delete/${trackId}`,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );

const deleteMusic = async (trackId: string) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${url}/music/delete/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error.response.data;
  }
};

export default {
  // createNFT,
  // updateNFT,
  // updateLaunchapdNFT,
  // getRandomUris,
  uploadMusic,
  getMusicList,
  deleteMusic,
};
