import axios from "axios";

const url = process.env.REACT_APP_API_URL;

//get all users with pagination and search with post api
const getAll = async (page: number, limit: number, search: string) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${url}/launch-collection/getAll`,{limit, page, search}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
      

    console.log("🚀 ~ getUsers ~ response:", response)

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//approve launchpad
const approveLaunchpad = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${url}/launch-collection/approve/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//reject launchpad
const rejectLaunchpad = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${url}/launch-collection/reject/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


//launchLaunchpad
const launchLaunchpad = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${url}/launch-collection/launch/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

//getAllLaunched
const getAllApproved = async (page: number, limit: number, search: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${url}/launch-collection/getAllApproved`,{limit, page, search}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("🚀 ~ getUsers ~ response:", response)

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
// router.get("/getById/:id",adminMiddleware, launchCollectionController.getById);

//getlaunchpad by id
const getLaunchpadById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/launch-collection/getById/${id}`, {
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
    approveLaunchpad,
    rejectLaunchpad,
    launchLaunchpad,
    getAllApproved,
    getLaunchpadById
};
