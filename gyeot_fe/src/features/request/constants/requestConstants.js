import {
  HELP_TYPE,
  CANCEL_REASON,
  NO_ASSIGNEE_REASON,
  REQUEST_STATE,
  USER_ORDER_STATE,
  INFORMATION_TYPE,
  UNAVAILABLE_REASON,
} from "./enumConstants";

/**
 * =====================================================================
 * [request/ 공통] request/ 내에서 공통으로 사용하는 constants
 * =====================================================================
 */

// 토스트 노출 시간(ms)
export const TOAST_DURATION = 3000;

// setTimeout이 지원하는 최대 지연 시간 (약 24.8일, 초과하면 즉시 실행됨)
export const MAX_TIMEOUT_MS = 2 ** 31 - 1;

/**
 * =====================================================================
 * [H-03-02] 요청 작성
 * =====================================================================
 */

// 요청 폼 입력 시 - 선행 조건 관련 토스트 메시지
export const REQUEST_PREREQUISITE_TOAST_MESSAGE = {
  SITUATION_REQUIRED: "상황을 먼저 선택해 주세요.",
  HELP_TYPE_REQUIRED: "도움 종류를 먼저 선택해 주세요.",
};

// 도움 종류: 서버 응답/요청에 쓰는 값(key), 한글 매핑(value)
export const HELP_TYPE_LABELS = {
  [HELP_TYPE.HOSPITAL]: "병원 동행",
  [HELP_TYPE.MEAL]: "식사",
  [HELP_TYPE.GROCERY]: "장보기",
  [HELP_TYPE.PET_CARE]: "반려동물",
  [HELP_TYPE.CHECK_IN]: "연락/안부",
  [HELP_TYPE.OTHER]: "기타",
};

// 라디오 버튼으로 그릴 [도움 종류]값 목록 (HELP_TYPE_LABELS 객체의 선언 순서대로)
// -> ["HOSPITAL", "MEAL", "GROCERY", "PET_CARE", "CHECK_IN", "OTHER"]
export const HELP_TYPE_OPTIONS = Object.keys(HELP_TYPE_LABELS);

/**
 * =====================================================================
 * [H-03-02] 요청 작성
 * [H-03-01-02] 요청 수정 · 취소
 * [N-06] 다시 부탁하기
 * =====================================================================
 */

// 요청 작성 Form 필드 키
export const REQUEST_FORM_FIELD_KEY = {
  SITUATION_ID: "situationId",
  USER_ID: "userId",
  HELP_TYPE: "helpType",
  START_DATE_TIME: "startDateTime",
  END_DATE_TIME: "endDateTime",
  LOCATION: "location",
  CONTENT: "content",
  DUE_DATE: "dueDate",
};

// 1분(Minute)을 밀리초(Millisecond) 단위로 환산하기 위한 상수
export const MS_PER_MINUTE = 60 * 1000;

// 시간/응답 기한 관련 Number 타입 상수
export const DUE_DATE_MIN_MINUTES = 60; // 응답 기한 최소 1시간
export const DUE_DATE_MAX_MINUTES = 3 * 24 * 60; // 응답 기한 최대 3일
export const DUE_DATE_DEFAULT_MINUTES = 24 * 60; // 응답 기한 기본값 24시간
export const START_MIN_LEAD_MINUTES = 60; // 시작까지 최소 1시간

// 열 수 있는 시트 종류. openSheet 는 이 값 중 하나이거나 null(모두 닫힘)
export const REQUEST_SHEET = {
  SITUATION: "situation",
  USER: "user",
  START: "start",
  END: "end",
  DUE_DATE: "dueDate",
};

// 시트에 주입할 DateTimeOption 입력 그룹 설정 (날짜/시간)
export const DATE_TIME_SECTIONS = [
  { type: "date", title: "날짜" },
  { type: "time", title: "시간" },
];

// 시트에 주입할 DateTimeOption 입력 그룹 설정 (응답기한)
export const DUE_DATE_SECTIONS = [{ type: "dueDate", title: "응답기한" }];

// DateTimeOption 컴포넌트 - 날짜 입력칸 설정
const DATE_CONFIGS = [
  {
    key: "year",
    placeholder: "2026",
    maxLength: 4,
    label: "년",
    className: "yearInput",
    min: 1,
  },
  {
    key: "month",
    placeholder: "00",
    maxLength: 2,
    label: "월",
    className: "dateTimeInput",
    min: 1,
    max: 12,
  },
  {
    key: "day",
    placeholder: "00",
    maxLength: 2,
    label: "일",
    className: "dateTimeInput",
    min: 1,
    max: 31,
  },
];

// DateTimeOption 컴포넌트 - 시간 입력칸 설정
const TIME_CONFIGS = [
  {
    key: "hour",
    placeholder: "00",
    maxLength: 2,
    label: "시",
    className: "dateTimeInput",
    min: 0,
    max: 23,
  },
  {
    key: "minute",
    placeholder: "00",
    maxLength: 2,
    label: "분",
    className: "dateTimeInput",
    min: 0,
    max: 59,
  },
];

// DateTimeOption 컴포넌트 - 응답 기한 입력칸 설정
const DUE_DATE_CONFIGS = [
  {
    key: "days",
    placeholder: "00",
    maxLength: 2,
    label: "일",
    className: "dateTimeInput",
    min: 0,
  },
  {
    key: "hours",
    placeholder: "00",
    maxLength: 2,
    label: "시간",
    className: "dateTimeInput",
    min: 0,
    max: 23,
  },
  {
    key: "minutes",
    placeholder: "00",
    maxLength: 2,
    label: "분",
    className: "dateTimeInput",
    min: 0,
    max: 59,
  },
];

// DateTimeOption 컴포넌트의 종류별(날짜/시간/응답기한) 입력 필드 설정 (최종 설정 객체)
export const DATE_TIME_OPTION_CONFIGS = {
  date: DATE_CONFIGS,
  time: TIME_CONFIGS,
  dueDate: DUE_DATE_CONFIGS,
};

// 날짜/시간 입력 필드의 key 목록 (["year", "month", "day", "hour", "minute"])
export const DATE_TIME_KEYS = [...DATE_CONFIGS, ...TIME_CONFIGS].map(
  (item) => item.key,
);

// 응답 기한 입력 필드의 key 목록 (["days", "hours", "minutes"])
export const DUE_DATE_KEYS = DUE_DATE_CONFIGS.map((item) => item.key);

// 날짜/시간 입력 필드 최소값 목록
export const DATE_TIME_MIN_LIMITS = [...DATE_CONFIGS, ...TIME_CONFIGS].reduce(
  (acc, item) => ({ ...acc, [item.key]: item.min }),
  {},
);

// 날짜/시간 입력 필드 최대값 목록
export const DATE_TIME_MAX_LIMITS = [...DATE_CONFIGS, ...TIME_CONFIGS].reduce(
  (acc, item) => ({ ...acc, [item.key]: item.max }),
  {},
);

// 응답 기한 입력 필드 최소값 목록
export const DUE_DATE_MIN_LIMITS = DUE_DATE_CONFIGS.reduce(
  (acc, item) => ({ ...acc, [item.key]: item.min }),
  {},
);

// 응답 기한 입력 필드 최대값 목록
export const DUE_DATE_MAX_LIMITS = DUE_DATE_CONFIGS.reduce(
  (acc, item) => ({ ...acc, [item.key]: item.max }),
  {},
);

/**
 * =====================================================================
 * [H-03-02-01] 공개 정보 미리보기
 * [H-03-01-02] 요청 수정 · 취소
 * =====================================================================
 */

// 공개 정보 체크 Form 필드 키 (기본 정보 / 건강 정보 / 생활 정보 / 미리 남기는 말)
export const CHECK_FORM_FIELD_KEY = {
  BASIC: "basicInfo",
  HEALTH: "healthInfo",
  LIFE: "lifeInfo",
  MESSAGE: "messageInfo",
};

// 공개 정보 섹션 설정 (화면에 그릴 순서대로)
// - key: CHECK_FORM_FIELD_KEY 값 (form, sections, openSheet의 키로 공용 사용)
// - title / description: SafetyCardGroup, DefaultSheet에 표시할 문구
export const INFO_PREVIEW_SECTIONS = [
  {
    key: CHECK_FORM_FIELD_KEY.BASIC,
    title: "기본 정보",
    description: "생년월일, 혈액형이 포함되어 있어요.",
  },
  {
    key: CHECK_FORM_FIELD_KEY.HEALTH,
    title: "건강 정보",
    description: "질환, 복용약, 알러지, 주의사항이 포함되어 있어요.",
  },
  {
    key: CHECK_FORM_FIELD_KEY.LIFE,
    title: "생활 정보",
    description: "주소, 출입 방법, 반려동물 정보가 포함되어 있어요.",
  },
  {
    key: CHECK_FORM_FIELD_KEY.MESSAGE,
    title: "미리 남기는 말",
    description: "기타 정보가 포함되어 있어요.",
  },
];

// 공개 정보 항목 ID (API 응답 JSON의 항목 키와 동일)
export const CHECK_ITEM_ID = {
  // 기본 정보
  BIRTH_DATE: "birthDate",
  BLOOD_TYPE: "bloodType",

  // 건강 정보
  DISEASE: "disease",
  MEDICINE: "medicine",
  ALLERGY: "allergy",
  CAUTION: "caution",

  // 생활 정보
  ADDRESS: "address",
  ENTRANCE_METHOD: "entranceMethod",
  PET: "pet",

  // 미리 남기는 말
  PREFERENCE: "preference",
  DOCUMENT: "document",
};

// TODO : API 명세서 확인 후 삭제 여부 검토
// 민감정보 항목의 ID 목록 정의
export const SENSITIVE_KEYS = [
  CHECK_ITEM_ID.DISEASE,
  CHECK_ITEM_ID.MEDICINE,
  CHECK_ITEM_ID.ALLERGY,
  CHECK_ITEM_ID.ADDRESS,
  CHECK_ITEM_ID.ENTRANCE_METHOD,
];

/**
 * =====================================================================
 * [H-03-01-02] 요청 수정 · 취소
 * =====================================================================
 */

// 요청 수정 폼에서 검증할 필드 (응답 기한/상황/도움 종류/요청 대상은 수정 대상이 아님)
export const EDIT_FORM_VALIDATE_FIELDS = [
  REQUEST_FORM_FIELD_KEY.START_DATE_TIME,
  REQUEST_FORM_FIELD_KEY.END_DATE_TIME,
  REQUEST_FORM_FIELD_KEY.LOCATION,
];

/**
 * =====================================================================
 * [N-06] 다시 부탁하기
 * =====================================================================
 */

// 검증할 필드 (응답 기한이 고정된 경우)
export const ASK_AGAIN_VALIDATE_FIELDS_FIXED = [REQUEST_FORM_FIELD_KEY.USER_ID];

// 검증할 필드 (응답 기한이 고정되지 않은 경우)
export const ASK_AGAIN_VALIDATE_FIELDS_FLEXIBLE = [
  REQUEST_FORM_FIELD_KEY.USER_ID,
  REQUEST_FORM_FIELD_KEY.DUE_DATE,
];

// 시작까지 1시간 미만일 때 응답 기한 고정 문구
export const FIXED_DUE_DATE_TOAST_MESSAGE =
  "시작까지 1시간 미만이라 응답 기한은 시작 시간까지로 고정돼요";

// 시작 시간이 이미 지난 경우 문구
export const START_PASSED_TOAST_MESSAGE =
  "시작 시간이 지나서 다시 부탁하기를 보낼 수 없어요.";

/**
 * =====================================================================
 * [H-03-01-A] 요청 상세 · 요청자 뷰
 * =====================================================================
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

export const USER_ORDER_STATE_TEXT = {
  [USER_ORDER_STATE.EXPIRED]: "기한 경과",
  [USER_ORDER_STATE.WAITING]: "응답 대기",
  [USER_ORDER_STATE.DIFFICULTY]: "어려움",
  [USER_ORDER_STATE.CANCEL]: "취소",
};

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

// 알림(RequestState) 종류 - React key 및 노출 규칙 구분용
export const REQUESTER_NOTICE_KEY = {
  CANCEL: "cancel",
  NO_ASSIGNEE: "noAssignee",
  EDIT_INVALID: "editInvalid",
};

// 알림(RequestState) 문구 설정
// [담당자 없음] 사유별 제목/본문
export const NO_ASSIGNEE_NOTICE_CONFIG = {
  [NO_ASSIGNEE_REASON.REJECTED]: {
    title: "요청 거절",
    information: "진행이 어렵다고 응답했어요.",
  },
  [NO_ASSIGNEE_REASON.EXPIRED]: {
    title: "기한 지남",
    information: "상대방이 응답하지 않았어요.",
  },
  [NO_ASSIGNEE_REASON.ACCEPT_WITHDRAWN]: {
    title: "수락 철회",
    information: "상대방이 수락을 취소했어요.",
  },
  [NO_ASSIGNEE_REASON.LEFT_SITUATION]: {
    title: "상황 나가기",
    information: "상대방이 상황에서 나갔어요.",
  },
  [NO_ASSIGNEE_REASON.RELATION_RELEASED]: {
    title: "관계 해제",
    information: "상대방과 관계가 해제됐어요.",
  },
};

// [요청 취소] 사유별 제목/본문
export const CANCEL_NOTICE_CONFIG = {
  [CANCEL_REASON.SELF]: {
    title: "요청 취소",
    information: "직접 취소했어요.",
  },
  [CANCEL_REASON.EXPIRED]: {
    title: "만료됨",
    information: "담당자가 없어 요청이 만료됐어요.",
  },
  [CANCEL_REASON.REJECTED]: {
    title: "거절함",
    information: "담당자가 거절해 취소됐어요.",
  },
};

// [수정 무효] 고정 제목/본문
export const EDIT_INVALID_NOTICE_CONFIG = {
  title: "수정 무효",
  information: "수정이 반영되지 않았어요",
};

// 푸터 종류
export const REQUESTER_FOOTER_KEY = {
  EDIT: "edit",
  EDIT_ASK_AGAIN: "editAskAgain",
  EDIT_WITHDRAW: "editWithdraw",
  DONE: "done",
  SAME_REQUEST: "sameRequest",
};

// 푸터 설정 - action 값은 페이지의 footerActions 키와 연결
export const REQUESTER_FOOTER_CONFIG = {
  [REQUESTER_FOOTER_KEY.EDIT]: {
    size: "large",
    title: "수정",
    type: "secondary",
    action: "edit",
  },
  [REQUESTER_FOOTER_KEY.EDIT_ASK_AGAIN]: {
    size: "small",
    leftType: "secondary",
    rightType: "primary",
    leftTitle: "수정",
    rightTitle: "다른사람 요청",
    leftAction: "edit",
    rightAction: "askAgain",
  },
  [REQUESTER_FOOTER_KEY.EDIT_WITHDRAW]: {
    size: "small",
    leftType: "tertiary",
    rightType: "secondary",
    leftTitle: "수정 철회",
    rightTitle: "수정",
    leftAction: "withdraw",
    rightAction: "edit",
  },
  [REQUESTER_FOOTER_KEY.DONE]: {
    size: "large",
    title: "완료",
    type: "primary",
    action: "done",
  },
  [REQUESTER_FOOTER_KEY.SAME_REQUEST]: {
    size: "large",
    title: "같은 내용 요청",
    type: "secondary",
    action: "sameRequest",
  },
};

/**
 * =====================================================================
 * [H-03-01-B] 요청 상세 · 대상자 뷰
 * =====================================================================
 */

// 대상자 뷰의 요청 상태 (서버 값)
export const TARGET_STATE = {
  BEFORE: "BEFORE", // 응답 전
  HOLD: "HOLD", // 보류
  REFUSED: "REFUSED", // 거절
  CANCEL: "CANCEL", // 요청자가 취소
  EXPIRED: "EXPIRED", // 요청 만료
  PASS: "PASS", // 다른 사용자에게 넘어감
};

// 더 이상 응답할 수 없는 상태 목록
export const TARGET_CLOSED_STATES = [
  TARGET_STATE.CANCEL,
  TARGET_STATE.EXPIRED,
  TARGET_STATE.PASS,
];

// 알림(RequestState) 문구 설정 - 기획/디자인 변경 시 여기 문구만 수정
export const TARGET_NOTICE_CONFIG = {
  [TARGET_STATE.CANCEL]: {
    title: "요청 취소",
    information: "요청자가 취소했어요.",
  },
  [TARGET_STATE.EXPIRED]: {
    title: "요청 만료",
    information: "요청이 만료됐어요.",
  },
  [TARGET_STATE.PASS]: {
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

// 푸터 종류
export const TARGET_FOOTER_KEY = {
  RESPOND: "RESPOND", // 응답 전: [거절, 수락]
  CHANGE: "CHANGE", // 보류: [거절로 변경, 수락으로 변경]
  CHANGE_TO_ACCEPT: "CHANGE_TO_ACCEPT", // 거절: [수락으로 변경]
};

// 푸터 설정 - action 값은 페이지의 targetActions 키와 연결
export const TARGET_FOOTER_CONFIG = {
  [TARGET_FOOTER_KEY.RESPOND]: {
    size: "small",
    leftType: "secondary",
    leftTitle: "거절",
    rightTitle: "수락",
    leftAction: "refuse",
    rightAction: "accept",
  },
  [TARGET_FOOTER_KEY.CHANGE]: {
    size: "small",
    leftType: "secondary",
    leftTitle: "거절로 변경",
    rightTitle: "수락으로 변경",
    leftAction: "changeToRefuse",
    rightAction: "changeToAccept",
  },
  [TARGET_FOOTER_KEY.CHANGE_TO_ACCEPT]: {
    size: "large",
    title: "수락으로 변경",
    type: "primary",
    action: "changeToAccept",
  },
};

/**
 * =====================================================================
 * [H-03-01] 요청 상세 · 담당자 뷰
 * =====================================================================
 */

// 전달받은 정보(SafetyCardGroup) 안내 문구 (요청 상태별, 없으면 "")
export const ASSIGNEE_SAFETY_INFORMATION = {
  [REQUEST_STATE.ACCEPTED]: "수락한 이후 확인할 수 있어요.",
  [REQUEST_STATE.COMPLETED]: "접근이 종료되었어요.",
  [REQUEST_STATE.CANCELED]: "접근이 종료되었어요.",
  [REQUEST_STATE.EXPIRED]: "접근이 종료되었어요.",
};

// 푸터 종류
export const ASSIGNEE_FOOTER_KEY = {
  CHECK_CHANGE: "checkChange",
  START: "start",
  DONE: "done",
  PAST_SITUATION: "pastSituation",
};

// 푸터 설정 - action 값은 페이지의 footerActions 키와 연결
export const ASSIGNEE_FOOTER_CONFIG = {
  [ASSIGNEE_FOOTER_KEY.CHECK_CHANGE]: {
    title: "변경 내용 확인",
    type: "primary",
    action: "checkChange",
  },
  [ASSIGNEE_FOOTER_KEY.START]: {
    title: "시작",
    type: "primary",
    action: "start",
  },
  [ASSIGNEE_FOOTER_KEY.DONE]: {
    title: "완료",
    type: "primary",
    action: "done",
  },
  [ASSIGNEE_FOOTER_KEY.PAST_SITUATION]: {
    title: "지난 상황에서 보기",
    type: "primary",
    action: "pastSituation",
  },
};

/**
 * =====================================================================
 * [H-03-01-01] 전달받은 정보
 * =====================================================================
 */

// 항목 이름("페니실린 알러지", "반려동물 나롱이") 조합 규칙
export const RECEIVED_INFO_TITLE_RULE = {
  TITLE_FIRST: "TITLE_FIRST", // title + typeName
  TYPE_FIRST: "TYPE_FIRST", // typeName + title
  TITLE_ONLY: "TITLE_ONLY", // title만
  TYPE_ONLY: "TYPE_ONLY", // typeName만 (title이 없는 유형)
};

// 항목 유형별 이름 조합 규칙 (기획/디자인 변경 시 여기만 수정, 미지정 유형은 TITLE_FIRST)
export const RECEIVED_INFO_TITLE_RULE_BY_TYPE = {
  [INFORMATION_TYPE.BIRTH_DATE]: RECEIVED_INFO_TITLE_RULE.TYPE_ONLY,
  [INFORMATION_TYPE.BLOOD_TYPE]: RECEIVED_INFO_TITLE_RULE.TYPE_ONLY,
  [INFORMATION_TYPE.DISEASE]: RECEIVED_INFO_TITLE_RULE.TITLE_ONLY,
  [INFORMATION_TYPE.MEDICATION]: RECEIVED_INFO_TITLE_RULE.TITLE_ONLY,
  [INFORMATION_TYPE.ALLERGY]: RECEIVED_INFO_TITLE_RULE.TITLE_FIRST,
  [INFORMATION_TYPE.CAUTION]: RECEIVED_INFO_TITLE_RULE.TITLE_FIRST,
  [INFORMATION_TYPE.ADDRESS]: RECEIVED_INFO_TITLE_RULE.TYPE_ONLY,
  [INFORMATION_TYPE.ENTRY_METHOD]: RECEIVED_INFO_TITLE_RULE.TYPE_ONLY,
  [INFORMATION_TYPE.PET]: RECEIVED_INFO_TITLE_RULE.TYPE_FIRST,
  [INFORMATION_TYPE.PREFERENCE_REQUEST]: RECEIVED_INFO_TITLE_RULE.TITLE_ONLY,
  [INFORMATION_TYPE.DOCUMENT_LOCATION]: RECEIVED_INFO_TITLE_RULE.TITLE_ONLY,
};

// 항목 우측 표시 문구
export const RECEIVED_INFO_BADGE_TEXT = {
  ADDED: "추가됨", // added = true
  UPDATED: "갱신", // updated = true -> "9/20 갱신"
};

// 접근 종료 화면 문구 (unavailableReason별)
export const RECEIVED_INFO_UNAVAILABLE_MESSAGE = {
  [UNAVAILABLE_REASON.NOT_ACCEPTED]: "수락한 이후 확인할 수 있어요.",
  [UNAVAILABLE_REASON.REQUEST_COMPLETED]: "요청을 완료하여 접근이 종료됐어요.",
  [UNAVAILABLE_REASON.REQUEST_ENDED_BY_TIME]:
    "요청 종료 시각이 지나 접근이 종료됐어요.",
  [UNAVAILABLE_REASON.REQUEST_CANCELED]: "요청이 취소되어 접근이 종료됐어요.",
  [UNAVAILABLE_REASON.REQUEST_EXPIRED]: "요청이 만료되어 접근이 종료됐어요.",
  [UNAVAILABLE_REASON.ASSIGNMENT_CLOSED]:
    "담당자 지정이 해제되어 접근이 종료됐어요.",
  [UNAVAILABLE_REASON.OWNER_REVOKED]:
    "정보 주인이 공유를 철회하여 접근이 종료됐어요.",
};

// 알 수 없는 사유일 때 기본 문구
export const RECEIVED_INFO_DEFAULT_UNAVAILABLE_MESSAGE = "접근이 종료됐어요.";
