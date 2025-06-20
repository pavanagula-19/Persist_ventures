import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-gif-backend.onrender.com",
});

export default api;
