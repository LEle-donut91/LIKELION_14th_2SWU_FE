import getAssigneeMock from "@/features/request/mock/RequestAssignee/getAssigneeMock";
import postAssigneeStartMock from "@/features/request/mock/RequestAssignee/postAssigneeStartMock";
import postAssigneeDoneMock from "@/features/request/mock/RequestAssignee/postAssigneeDoneMock";
import postAssigneeWithdrawMock from "@/features/request/mock/RequestAssignee/postAssigneeWithdrawMock";
import getAssigneeReconfirmMock from "@/features/request/mock/AssigneeReconfirm/getAssigneeReconfirmMock";
import postAssigneeReconfirmAcceptMock from "@/features/request/mock/AssigneeReconfirm/postAssigneeReconfirmAcceptMock";
import postAssigneeReconfirmRejectMock from "@/features/request/mock/AssigneeReconfirm/postAssigneeReconfirmRejectMock";

/**
 * =====================================================================
 * [H-03-01] 요청 상세 · 담당자 뷰
 * [N-05] 변경 내용 확인
 * - 데이터 조회 & 시작 / 완료 / 수락 철회
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(담당자 뷰) - 데이터 조회
// 응답: "도움 요청 상세 조회" API의 data (viewerRole = ASSIGNEE)
// - 실제 연동 시 envelope({ status, code, message, data })에서 data만 반환할 것
export const getAssigneeApi = (requestId) => {
  console.log("담당자 데이터 조회:", requestId);
  return getAssigneeMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(담당자 뷰) - 시작
export const postAssigneeStartApi = (requestId) => {
  console.log("시작:", requestId);
  return postAssigneeStartMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(담당자 뷰) - 완료
export const postAssigneeDoneApi = (requestId) => {
  console.log("완료:", requestId);
  return postAssigneeDoneMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(담당자 뷰) - 수락 철회
export const postAssigneeWithdrawApi = (requestId) => {
  console.log("수락 철회:", requestId);
  return postAssigneeWithdrawMock;
};

/**
 * =====================================================================
 * [N-05] 변경 내용 확인
 * - 데이터 조회 & 변경 내용 확인(수락) / 거절
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [N-05] 변경 내용 확인 - 데이터 조회
// 응답: "도움 요청 상세 조회" API의 data (viewerRole = ASSIGNEE, latestProposal 포함)
export const getAssigneeReconfirmApi = (requestId) => {
  console.log("변경 내용 조회:", requestId);
  return getAssigneeReconfirmMock;
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
