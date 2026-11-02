import getEditFormMock from "@/features/request/mock/RequestEdit/getEditFormMock";
import postEditFormMock from "@/features/request/mock/RequestEdit/postEditFormMock";
import getEditCheckMock from "@/features/request/mock/RequestEdit/getEditCheckMock";
import postEditReconfirmMock from "@/features/request/mock/RequestEdit/postEditReconfirmMock";
import patchRequestCancelMock from "@/features/request/mock/RequestEdit/patchRequestCancelMock";
import getAskAgainMock from "@/features/request/mock/AskAgain/getAskAgainMock";
import postAskAgainMock from "@/features/request/mock/AskAgain/postAskAgainMock";

/**
 * =====================================================================
 * [H-03-01-02] 요청 수정 · 취소
 * - post/get/patch/delete + 요청 내용 + Api
 * - 데이터 조회 & 수정안 저장 & 재확인 요청 & 요청 취소
 *
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 - 폼 데이터 조회 (GET 1회)
// 응답: { situationId, requestId, isEditing, userName, dueDate, draft }
// - isEditing true  → draft: { startAt, endAt, location, sharedInfo }
// - isEditing false → draft: { sharedInfo }
// - sharedInfo의 각 항목에는 isDefault(체크 여부), isSensitive(민감정보 여부)가 포함됨
export const getEditFormApi = (requestId) => {
  console.log(requestId);
  return getEditFormMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 - 수정안 저장
export const postEditFormApi = (payload) => {
  console.log("전송한 Payload:", payload);
  return postEditFormMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 내용 확인 - 변경 전/후 조회
export const getEditCheckApi = (requestId) => {
  console.log(requestId);
  return getEditCheckMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 내용 확인 - 재확인 요청
export const postEditReconfirmApi = (payload) => {
  console.log("전송한 Payload:", payload);
  return postEditReconfirmMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 취소
export const patchRequestCancelApi = (requestId) => {
  console.log("요청 취소:", requestId);
  return patchRequestCancelMock;
};

/**
 * =====================================================================
 * [N-06] 다시 부탁하기
 * - post/get/patch/delete + 요청 내용 + Api
 * - 데이터 조회 & 폼 제출
 *
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [N-06] 다시 부탁하기 - 이전 요청 내용, 대상 이력, 새 요청 대상 조회
// 응답: { situationId, requestId, lastReqSummary, userRecord, userLst }
export const getAskAgainApi = (requestId) => {
  console.log(requestId);
  return getAskAgainMock;
};

// TODO: API 연동 로직 수정 필요
// [N-06] 다시 부탁하기 - 폼 제출
export const postAskAgainApi = (payload) => {
  console.log("전송한 Payload:", payload);
  return postAskAgainMock;
};
