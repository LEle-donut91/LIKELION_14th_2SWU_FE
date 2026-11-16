import { axiosInstance } from "@/shared/api/axiosInstance";
import { REQUEST_API_URLS } from "@/shared/constants/apiUrlConstants";

// 도움 요청 생성 API
export const postCareRequestApi = async (payload) => {
  const response = await axiosInstance.post(REQUEST_API_URLS.create, payload);
  return response.data;
};
