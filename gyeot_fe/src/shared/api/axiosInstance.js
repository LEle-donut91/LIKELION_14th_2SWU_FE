import axios from "axios";

// env에 등록된 baseURL 연결
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
