import { axiosInstance } from "@/shared/api/axiosInstance";
import { REQUEST_API_URLS } from "@/shared/constants/apiUrlConstants";

// 요청 수정 API
export const patchEditApi = async ({ requestId, payload }) => {
  const response = await axiosInstance.patch(REQUEST_API_URLS.detail(requestId), payload);
  return response.data;
};

