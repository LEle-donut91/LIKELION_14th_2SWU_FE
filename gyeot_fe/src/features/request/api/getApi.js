import { REQUEST_API_URLS } from "@/shared/constants/apiUrlConstants";
import { axiosInstance } from "@/shared/api/axiosInstance";

// 대상 후보 조회 API
export const getRequestTargetsApi = async ({ situationId, requestId } = {}) => {
  const response = await axiosInstance.get(REQUEST_API_URLS.targetCandidates, {
    params: { situationId, requestId },
  });
  return response.data;
};
