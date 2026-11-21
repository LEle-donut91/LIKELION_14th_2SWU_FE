/**
 * [request/ 공통] 토스트 · 안내 문구
 * 화면에 보여줄 알림 문구는 여기서만 수정
 */

export const DEADLINE_NOTICE = {
  DEFAULT: "응답 기한은 24시간으로 고정됩니다.",
  FIXED: "응답 기한은 시작 시간까지로 고정됩니다.",
};

// 요청 폼 입력 시 - 선행 조건 관련 토스트 메시지
export const REQUEST_PREREQUISITE_TOAST_MESSAGE = {
  SITUATION_REQUIRED: "상황을 먼저 선택해 주세요.",
  HELP_TYPE_REQUIRED: "도움 종류를 먼저 선택해 주세요.",
};

// 시작까지 1시간 미만일 때 응답 기한 고정 문구
export const FIXED_DUE_DATE_TOAST_MESSAGE =
  "시작까지 1시간 미만이라 응답 기한은 시작 시간까지로 고정돼요";

// 시작 시간이 이미 지난 경우 문구
export const START_PASSED_TOAST_MESSAGE =
  "시작 시간이 지나서 다시 부탁하기를 보낼 수 없어요.";

// 수정 요청 시 변경된 필드가 하나도 없는 경우 문구
export const NO_CHANGE_TOAST_MESSAGE = "변경된 내용이 없어요.";
