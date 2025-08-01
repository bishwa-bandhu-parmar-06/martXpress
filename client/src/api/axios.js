import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URI;
const axiosInstance = axios.create({
  baseURL: baseUrl,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
});
export default axiosInstance;
