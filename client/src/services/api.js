import axios from "axios";
// Trigger redeploy to pick up new environment variables

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ---- Auth ----
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// ---- News ----
export const getNews = (params) => API.get("/news", { params });
export const getNewsById = (id) => API.get(`/news/${id}`);
export const getTrending = () => API.get("/news/trending");
export const createNews = (formData) =>
  API.post("/news", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateNews = (id, formData) =>
  API.put(`/news/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteNews = (id) => API.delete(`/news/${id}`);

// ---- Categories ----
export const getCategories = () => API.get("/category");
export const createCategory = (data) => API.post("/category", data);
export const updateCategory = (id, data) => API.put(`/category/${id}`, data);
export const deleteCategory = (id) => API.delete(`/category/${id}`);

// ---- Comments ----
export const getComments = (newsId) => API.get(`/comments/${newsId}`);
export const addComment = (newsId, data) => API.post(`/comments/${newsId}`, data);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

export default API;
