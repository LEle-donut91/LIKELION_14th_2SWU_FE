import postAssigneeReconfirmAcceptMock from "@/features/request/mock/AssigneeReconfirm/postAssigneeReconfirmAcceptMock";
import postAssigneeReconfirmRejectMock from "@/features/request/mock/AssigneeReconfirm/postAssigneeReconfirmRejectMock";
import postEditFormMock from "@/features/request/mock/RequestEdit/postEditFormMock";
import postEditReconfirmMock from "@/features/request/mock/RequestEdit/postEditReconfirmMock";
import postAskAgainMock from "@/features/request/mock/AskAgain/postAskAgainMock";
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

// TODO: API 연동 로직 수정 필요
// [N-05] 변경 내용 확인 - "확인" (수정안 수락)
export const postAssigneeReconfirmAcceptApi = (requestId, proposalId) => {
  console.log("변경 내용 확인:", requestId, proposalId);
  return postAssigneeReconfirmAcceptMock;
};

// TODO: API 연동 로직 수정 필요
// [N-05] 변경 내용 확인 - 모달의 "거절" (수정안 거절)
export const postAssigneeReconfirmRejectApi = (requestId, proposalId) => {
  console.log("변경 내용 거절:", requestId, proposalId);
  return postAssigneeReconfirmRejectMock;
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

// TODO: API 연동 로직 수정 필요
// [N-06] 다시 부탁하기 - 폼 제출
export const postAskAgainApi = (payload) => {
  console.log("전송한 Payload:", payload);
  return postAskAgainMock;
};
