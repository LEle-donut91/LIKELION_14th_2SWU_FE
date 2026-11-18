import { CANCEL_REASON, NO_ASSIGNEE_REASON } from "./enumConstants";

/**
 * [H-03-01-A] 요청 상세 · 요청자 뷰
 * 요청자 화면 제목/알림 문구
 */

// 요청 순서 타이틀
export const REQUESTER_ORDER_TITLE = {
  ASK_OTHER: "부탁 순서",
  DEFAULT: "요청 순서",
};

// 요청 대상 상태 문구
export const REQUESTER_USER_STATE_TEXT = {
  DONE: "*요청사항을 완료했어요!",
  EDIT_PENDING: "*수정사항을 확인 중이에요.",
};

// 헤더 우측 버튼 문구
export const REQUESTER_CANCEL_BTN_TITLE = "취소";

// 알림(RequestState) 문구 설정
// [담당자 없음] 사유별 제목/본문
export const NO_ASSIGNEE_NOTICE_CONFIG = {
  [NO_ASSIGNEE_REASON.UNAVAILABLE]: {
    title: "요청 거절",
    information: "진행이 어렵다고 응답했어요.",
  },
  [NO_ASSIGNEE_REASON.DEADLINE_PASSED]: {
    title: "기한 지남",
    information: "상대방이 응답하지 않았어요.",
  },
  [NO_ASSIGNEE_REASON.ACCEPTANCE_WITHDRAWN]: {
    title: "수락 철회",
    information: "상대방이 수락을 취소했어요.",
  },
  [NO_ASSIGNEE_REASON.PARTICIPANT_LEFT]: {
    title: "상황 나가기",
    information: "상대방이 상황에서 나갔어요.",
  },
  [NO_ASSIGNEE_REASON.RELATIONSHIP_ENDED]: {
    title: "관계 해제",
    information: "상대방과 관계가 해제됐어요.",
  },
};

// [요청 취소] 사유별 제목/본문
export const CANCEL_NOTICE_CONFIG = {
  [CANCEL_REASON.REQUESTER_CANCELED]: {
    title: "요청 취소",
    information: "직접 취소했어요.",
  },
  [CANCEL_REASON.RECONFIRMATION_REJECTED]: {
    title: "거절함",
    information: "담당자가 거절해 취소됐어요.",
  },
};

// [수정 무효] 고정 제목/본문
export const EDIT_INVALID_NOTICE_CONFIG = {
  title: "수정 무효",
  information: "수정이 반영되지 않았어요",
};
