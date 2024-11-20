import axios from "axios";

const url = process.env.REACT_APP_API_URL;

//get all users with pagination and search with post api       .getAll(page, limit, search, paymentFilter, approvalFilter)
const getAll = async (
  page: number,
  limit: number,
  search: string,
  paymentFilter: string,
  approvalFilter: string
) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${url}/launch-collection/getAll`,
      { limit, page, search, paymentFilter, approvalFilter },
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

//approve launchpad
const approveLaunchpad = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${url}/launch-collection/approve/${id}`,
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

//reject launchpad
const rejectLaunchpad = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${url}/launch-collection/reject/${id}`,
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

//launchLaunchpad
const launchLaunchpad = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${url}/launch-collection/launch/${id}`,
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

//getAllLaunched
const getAllApproved = async (page: number, limit: number, search: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${url}/launch-collection/getAllApproved`,
      { limit, page, search },
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
// router.get("/getById/:id",adminMiddleware, launchCollectionController.getById);

//getlaunchpad by id
const getLaunchpadById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/launch-collection/getById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const uploadImage = async (formData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${url}/launch-collection/upload-image-data-admin`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getApplications = async ({
  page,
  limit,
  search,
  stage,
  status,
}
) => {
  const token = localStorage.getItem("token");

  console.log("page", page);
  console.log("limit", limit);
  console.log("search", search);
  console.log("stageFilter", stage);
  console.log("statusFilter", status);

  try {
    const response = await axios.post(
      `${url}/stage-application/admin/applications`,
      { limit, page, search, stage, status },
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

const applicationApproval = async ({id}) => {
  try {

    console.log("🚀 ~ applicationApproval ~ id", id)
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${url}/stage-application/admin/applications/${id}/approve`,
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

const applicationRejection = async ({id}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${url}/stage-application/admin/applications/${id}/reject`,
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


const updatePrice = async (collectionName: string, mintPrice: number, walletAddress: string, wallet: string) => {
  try {
    console.log("🚀 ~ updatePrice ~ collectionName", collectionName)
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${url}/launch-collection/update-mint-price/${collectionName}`,
      {
        mintPrice,
        walletAddress,
        wallet
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
};

export default {
  getAll,
  approveLaunchpad,
  rejectLaunchpad,
  launchLaunchpad,
  getAllApproved,
  getLaunchpadById,
  uploadImage,
  getApplications,
  applicationApproval,
  applicationRejection,
  updatePrice
};
