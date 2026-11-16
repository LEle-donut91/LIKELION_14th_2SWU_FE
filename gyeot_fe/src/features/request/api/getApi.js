import getAssigneeMock from "@/features/request/mock/RequestDetail/getAssigneeMock";
import getAssigneeReconfirmMock from "@/features/request/mock/AssigneeReconfirm/getAssigneeReconfirmMock";
import getReceivedInfoMock from "@/features/request/mock/ReceivedInfo/getReceivedInfoMock";
import getEditFormMock from "@/features/request/mock/RequestEdit/getEditFormMock";
import getEditCheckMock from "@/features/request/mock/RequestEdit/getEditCheckMock";
import getAskAgainMock from "@/features/request/mock/AskAgain/getAskAgainMock";
import getRequesterMock from "@/features/request/mock/RequestDetail/getRequesterMock";
import getTargetMock from "@/features/request/mock/RequestDetail/getTargetMock";
import { REQUEST_API_URLS, INFO_SHARE_API_URLS } from "@/shared/constants/apiUrlConstants";
import { axiosInstance } from "@/shared/api/axiosInstance";

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

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(담당자 뷰) - 데이터 조회
// 응답: "도움 요청 상세 조회" API의 data (viewerRole = ASSIGNEE)
// - 실제 연동 시 envelope({ status, code, message, data })에서 data만 반환할 것
export const getAssigneeApi = (requestId) => {
  console.log("담당자 데이터 조회:", requestId);
  return getAssigneeMock;
};

// TODO: API 연동 로직 수정 필요
// [N-05] 변경 내용 확인 - 데이터 조회
// 응답: "도움 요청 상세 조회" API의 data (viewerRole = ASSIGNEE, latestProposal 포함)
export const getAssigneeReconfirmApi = (requestId) => {
  console.log("변경 내용 조회:", requestId);
  return getAssigneeReconfirmMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-01] 전달받은 정보 - 데이터 조회
// - 실제 연동 시 envelope({ status, code, message, data })에서 data만 반환할 것
// - 404 SHARED_INFO_NOT_FOUND: 오류 문구를 띄우고 이전 화면으로 돌아갈 것
export const getReceivedInfoApi = (requestId) => {
  console.log("전달받은 정보 조회:", requestId);
  return getReceivedInfoMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 - 폼 데이터 조회 (GET 1회)
export const getEditFormApi = (requestId) => {
  console.log(requestId);
  return getEditFormMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 내용 확인 - 변경 전/후 조회
export const getEditCheckApi = (requestId) => {
  console.log(requestId);
  return getEditCheckMock;
};

// TODO: API 연동 로직 수정 필요
// [N-06] 다시 부탁하기 - 이전 요청 내용, 대상 이력, 새 요청 대상 조회
// 응답: { situationId, requestId, lastReqSummary: { type, time, startAt, location, info, message }, userRecord, userLst }
// - startAt: 시작 일시 (DateTimeValue). 시작까지 1시간 미만이면 응답 기한이 시작 시간까지로 고정됨
export const getAskAgainApi = (requestId) => {
  console.log(requestId);
  return getAskAgainMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(요청자 뷰) - 데이터 조회
// Returns the shared request detail data (viewerRole = REQUESTER).
export const getRequesterApi = (requestId) => {
  console.log("요청자 데이터 조회:", requestId);
  return getRequesterMock;
};

// TODO: API 연동 로직 수정 필요
// 요청 상세(대상자 뷰) - 데이터 조회
export const getTargetApi = (requestId) => {
  console.log("대상자 데이터 조회:", requestId);
  return getTargetMock;
};
