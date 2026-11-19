import { REQUEST_STATE, ASSIGNMENT_CLOSE_REASON } from "./enumConstants";

/**
 * [H-03-01-B] 요청 상세 · 대상자 뷰
 * 대상자 화면 알림/안내 문구
 */

// 알림(RequestState) 문구 설정 - 기획/디자인 변경 시 여기 문구만 수정
export const TARGET_NOTICE_CONFIG = {
  [REQUEST_STATE.CANCELED]: {
    title: "요청 취소",
    information: "요청자가 취소했어요.",
  },
  [REQUEST_STATE.EXPIRED]: {
    title: "요청 만료",
    information: "요청이 만료됐어요.",
  },
  [ASSIGNMENT_CLOSE_REASON.TARGET_CHANGED]: {
    title: "요청 취소",
    information: "다른 사용자에게 요청이 넘어갔어요.",
  },
};

// 안내 가이드 텍스트 종류 / 문구 (배열의 각 원소 = 한 줄)
export const TARGET_GUIDE_KEY = {
  HOLD: "HOLD",
  CLOSED: "CLOSED",
};

export const TARGET_GUIDE_LINES = {
  [TARGET_GUIDE_KEY.HOLD]: [
    "보류 중인 요청사항이에요.",
    "보류 중 요청자가 취소할 경우, 응답할 수 없어요.",
  ],
  [TARGET_GUIDE_KEY.CLOSED]: ["더 이상 응답할 수 없어요."],
};
