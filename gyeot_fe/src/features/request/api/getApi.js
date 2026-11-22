import { REQUEST_API_URLS, INFO_SHARE_API_URLS, SITUATION_API_URLS } from "@/shared/constants/apiUrlConstants";
import { axiosInstance } from "@/shared/api/axiosInstance";

// 홈 통합 조회 API (요청 작성 시 상황 목록을 가져오기 위함)
export const getHomeApi = async () => {
  const response = await axiosInstance.get(SITUATION_API_URLS.home);
  return response.data;
};

// 대상 후보 조회 API
export const getRequestTargetsApi = async ({ situationId, requestId } = {}) => {
  const response = await axiosInstance.get(REQUEST_API_URLS.targetCandidates, {
    params: { situationId, requestId },
  });
  return response.data;
};

// 공개 항목 선택지 조회 API
export const getInformationOptionsApi = async ({ helpType, requestId }) => {
  const response = await axiosInstance.get(INFO_SHARE_API_URLS.sharingOptions, {
    params: { helpType, requestId },
  });
  return response.data;
};

// 요청 상세 조회 API (응답의 viewerRole로 화면을 결정)
export const getRequestDetailApi = async (requestId) => {
  const response = await axiosInstance.get(REQUEST_API_URLS.detail(requestId));
  return response.data;
};

// 전달받은 정보 조회 API
export const getReceivedInfoApi = async (requestId) => {
  const response = await axiosInstance.get(INFO_SHARE_API_URLS.sharedInformation(requestId));
  return response.data;
};
