/**
 * =====================================================================
 * [request/ 공통] API 호출 시 응답 데이터 enum 값
 * =====================================================================
 */

// 요청 진행 상태 (status)
export const REQUEST_STATE = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
  EXPIRED: "EXPIRED",
};

// 수정안 상태 (latestProposal.status)
export const PROPOSAL_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  INVALIDATED: "INVALIDATED",
};

// 내 응답 (myAssignment.responseStatus, 미응답이면 null)
export const RESPONSE_STATUS = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
  CHECK_LATER: "CHECK_LATER",
};

// 담당자 없음 사유 (noAssignedReason)
export const NO_ASSIGNEE_REASON = {
  REJECTED: "REJECTED", // 요청 거절
  EXPIRED: "EXPIRED", // 기한 지남
  ACCEPT_WITHDRAWN: "ACCEPT_WITHDRAWN", // 수락 철회
  LEFT_SITUATION: "LEFT_SITUATION", // 상황 나가기
  RELATION_RELEASED: "RELATION_RELEASED", // 관계 해제
};

// 요청 취소 사유 (cancelReason)
export const CANCEL_REASON = {
  SELF: "SELF", // 직접 취소
  EXPIRED: "EXPIRED", // 담당자 없음으로 만료
  REJECTED: "REJECTED", // 담당자 거절
};

// TODO : API 명세서 확인 후 삭제 여부 검토
// 요청 수정 상태 (서버 값)
export const CHANGE_STATE = {
  BEFORE_EDIT: "BEFORE_EDIT", // 수정 전
  RECONFIRMING: "RECONFIRMING", // 재확인 중
  RECONFIRMED: "RECONFIRMED", // 재확인 수락
  INVALID: "INVALID", // 수정 무효
};

// 부탁 순서 마감 사유
export const USER_ORDER_STATE = {
  EXPIRED: "EXPIRED",
  WAITING: "WAITING",
  DIFFICULTY: "DIFFICULTY",
  CANCEL: "CANCEL",
};

// 화면 상태 (displayStatus)
export const DISPLAY_STATUS = {
  WAITING: "WAITING",
  NO_ASSIGNEE: "NO_ASSIGNEE",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
  EXPIRED: "EXPIRED",
};
