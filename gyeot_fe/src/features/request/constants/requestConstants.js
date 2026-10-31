/**
 * =====================================================================
 * [request/ 공통] request/ 내에서 공통으로 사용하는 constants
 * =====================================================================
 */
// 토스트 노출 시간(ms)
export const TOAST_DURATION = 3000;

/**
 * =====================================================================
 * [H-03-02] 요청 작성
 * =====================================================================
 */

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

// 요청 폼 입력 시 - 선행 조건 관련 토스트 메시지
export const REQUEST_PREREQUISITE_TOAST_MESSAGE = {
  SITUATION_REQUIRED: "상황을 먼저 선택해 주세요.",
  HELP_TYPE_REQUIRED: "도움 종류를 먼저 선택해 주세요.",
};

// 시트에 주입할 DateTimeOption 입력 그룹 설정 (날짜/시간)
export const DATE_TIME_SECTIONS = [
  { type: "date", title: "날짜" },
  { type: "time", title: "시간" },
];

// 시트에 주입할 DateTimeOption 입력 그룹 설정 (응답기한)
export const DUE_DATE_SECTIONS = [{ type: "dueDate", title: "응답기한" }];

// 시작 시간 입력인지, 종료 시간 입력인지 구분
export const DATE_TARGET = {
  START: "start",
  END: "end",
};

// 도움 종류: 서버 응답/요청에 쓰는 값(key), 한글 매핑(value)
export const HELP_TYPE_LABELS = {
  HOSPITAL_ESCORT: "병원 동행",
  MEAL: "식사",
  SHOPPING: "장보기",
  PET: "반려동물",
  CHECK_IN: "연락/안부",
  ETC: "기타",
};

// 라디오 버튼으로 그릴 [도움 종류]값 목록 (HELP_TYPE_LABELS 객체의 선언 순서대로)
// -> ["HOSPITAL_ESCORT", "MEAL", "SHOPPING", "PET", "CHECK_IN", "ETC"]
export const HELP_TYPE_OPTIONS = Object.keys(HELP_TYPE_LABELS);

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
 * TODO: 추후 주석 추가
 * =====================================================================
 */

// 민감정보 항목의 ID 목록 정의
export const SENSITIVE_KEYS = [
  "disease",
  "medicine",
  "allergy",
  "address",
  "entranceMethod",
];

// [H-03-01-B] 요청 상태에 따른 RequestState 컴포넌트 설정 데이터 매핑
export const REQUEST_STATE_CONFIG = {
  cancel: { title: "요청 취소", information: "요청자가 취소했어요." },
  expired: { title: "요청 만료", information: "요청이 만료됐어요." },
  pass: {
    title: "요청 취소",
    information: "다른 사용자에게 요청이 넘어갔어요.",
  },
};
