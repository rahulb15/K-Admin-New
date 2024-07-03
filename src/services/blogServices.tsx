import axios from "axios";

const url = process.env.REACT_APP_API_URL;

// create blog
const createBlog = async (formData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${url}/blog`, formData, {
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

// editBlog
const editBlog = async (formData: any, id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${url}/blog/${id}`, formData, {
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

//get all blogs
const getBlogList = async (page: number, limit: number, search: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${url}/blog/getBlogList`,
      { page, limit, search },
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

// deleteBlog
const deleteBlog = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${url}/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export default {
  createBlog,
  getBlogList,
  editBlog,
  deleteBlog,
};
