// services/connect.service.ts
import axios from "axios";

const url = process.env.REACT_APP_API_URL;

// Get connect page data
const getConnectPage = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/connect`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Update connect page assets
const updateConnectPage = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${url}/connect`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Add new artist
const addArtist = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${url}/connect/artist`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Update existing artist
const updateArtist = async (artistId: string, formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${url}/connect/artist/${artistId}`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Delete artist
const deleteArtist = async (artistId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${url}/connect/artist/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Set active artist
const setActiveArtist = async (artistId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${url}/connect/artist/${artistId}/active`,
      {},
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

export default {
  getConnectPage,
  updateConnectPage,
  addArtist,
  updateArtist,
  deleteArtist,
  setActiveArtist,
};