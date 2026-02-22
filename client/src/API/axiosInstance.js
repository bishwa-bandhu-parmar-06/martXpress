import axios from "axios";
// console.log("Checking URl : ", import.meta.env.VITE_API_URL);
// Create an Axios instance
const api = axios.create({
  // baseURL: "/api",
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
