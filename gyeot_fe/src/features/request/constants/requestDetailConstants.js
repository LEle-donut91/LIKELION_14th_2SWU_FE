import { REQUEST_STATE } from "./enumConstants";

/**
 * [H-03-01] 요청 상세 · 공통 / 담당자 뷰
 * 진행 단계, 부탁 순서 배지 상태, 담당자 안내 문구
 */

// 요청 진행 단계 순서 (요청 -> 수락 -> 진행 -> 완료)
export const REQUEST_STEP_ORDER = [
  REQUEST_STATE.REQUESTED,
  REQUEST_STATE.ACCEPTED,
  REQUEST_STATE.IN_PROGRESS,
  REQUEST_STATE.COMPLETED,
];

// 요청 진행 단계 라벨
export const REQUEST_STEP_LABELS = {
  [REQUEST_STATE.REQUESTED]: "요청",
  [REQUEST_STATE.ACCEPTED]: "수락",
  [REQUEST_STATE.IN_PROGRESS]: "진행",
  [REQUEST_STATE.COMPLETED]: "완료",
};

// 더 이상 진행되지 않는 종료 상태 (취소 / 만료)
export const REQUEST_ENDED_STATES = [
  REQUEST_STATE.CANCELED,
  REQUEST_STATE.EXPIRED,
];

// 서버 응답으로부터 계산한 부탁 순서 배지의 UI 상태
export const USER_ORDER_STATE = {
  EXPIRED: "EXPIRED",
  WAITING: "WAITING",
  DIFFICULTY: "DIFFICULTY",
  CANCEL: "CANCEL",
};

export const USER_ORDER_STATE_TEXT = {
  [USER_ORDER_STATE.EXPIRED]: "기한 경과",
  [USER_ORDER_STATE.WAITING]: "응답 대기",
  [USER_ORDER_STATE.DIFFICULTY]: "어려움",
  [USER_ORDER_STATE.CANCEL]: "취소",
};

// 전달받은 정보(SafetyCardGroup) 안내 문구 (요청 상태별, 없으면 "")
export const ASSIGNEE_SAFETY_INFORMATION = {
  [REQUEST_STATE.ACCEPTED]: "수락한 이후 확인할 수 있어요.",
  [REQUEST_STATE.COMPLETED]: "접근이 종료되었어요.",
  [REQUEST_STATE.CANCELED]: "접근이 종료되었어요.",
  [REQUEST_STATE.EXPIRED]: "접근이 종료되었어요.",
};
