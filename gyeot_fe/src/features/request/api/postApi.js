import postEditFormMock from "@/features/request/mock/RequestEdit/postEditFormMock";
import postEditReconfirmMock from "@/features/request/mock/RequestEdit/postEditReconfirmMock";
import { axiosInstance } from "@/shared/api/axiosInstance";
import { REQUEST_API_URLS } from "@/shared/constants/apiUrlConstants";

// 도움 요청 생성 API
export const postCareRequestApi = async (payload) => {
  const response = await axiosInstance.post(REQUEST_API_URLS.create, payload);
  return response.data;
};

// 수락 철회 API
export const postAcceptWithdrawApi = async (requestId) => {
  const response = await axiosInstance.post(REQUEST_API_URLS.withdraw(requestId));
  return response.data;
};

// 돌봄 시작 API
export const postStartApi = async (requestId) => {
  const response = await axiosInstance.post(REQUEST_API_URLS.start(requestId));
  return response.data;
};

// 돌봄 완료 API (담당자·요청자 공통)
export const postDoneApi = async (requestId) => {
  const response = await axiosInstance.post(REQUEST_API_URLS.complete(requestId));
  return response.data;
};

// 요청 응답 API (대상자 뷰) - 보류, 거절, 수락
export const postResponseApi = async ({ requestId, response }) => {
  const result = await axiosInstance.post(REQUEST_API_URLS.respond(requestId), {
    response,
  });
  return result.data;
};

// 요청 취소 API (요청자 뷰)
export const postCancelApi = async (requestId) => {
  const response = await axiosInstance.post(REQUEST_API_URLS.cancel(requestId));
  return response.data;
};

// 수정안 철회 API (요청자 뷰)
export const postEditWithdrawApi = async ({ requestId, proposalId }) => {
  const response = await axiosInstance.post(
    REQUEST_API_URLS.editWithdraw(requestId, proposalId),
  );
  return response.data;
};

// [N-05] 변경 내용 확인 - "확인" (수정안 수락)
export const postReconfirmAcceptApi = async ({ requestId, proposalId }) => {
  const response = await axiosInstance.post(
    REQUEST_API_URLS.reconfirmAccept(requestId, proposalId),
  );
  return response.data;
};

// [N-05] 변경 내용 확인 - 모달의 "거절" (수정안 거절)
export const postReconfirmRejectApi = async ({ requestId, proposalId }) => {
  const response = await axiosInstance.post(
    REQUEST_API_URLS.reconfirmReject(requestId, proposalId),
  );
  return response.data;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 - 수정안 저장
export const postEditFormApi = (payload) => {
  console.log("전송한 Payload:", payload);
  return postEditFormMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 내용 확인 - 재확인 요청
export const postEditReconfirmApi = (payload) => {
  console.log("전송한 Payload:", payload);
  return postEditReconfirmMock;
};

// 다시 부탁하기 - 새 대상 지정
export const postAskAgainApi = async ({ requestId, payload }) => {
  const response = await axiosInstance.post(REQUEST_API_URLS.assignments(requestId), payload);
  return response.data;
};
