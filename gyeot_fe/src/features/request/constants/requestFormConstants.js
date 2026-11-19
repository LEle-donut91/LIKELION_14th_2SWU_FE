import { HELP_TYPE } from "./enumConstants";

/**
 * [H-03-02] 요청 작성 / [H-03-01-02] 요청 수정 / [N-06] 다시 부탁하기
 * 요청 폼 필드 키, 도움 종류, 시트 종류, 화면별 검증 대상 필드
 */

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

// 열 수 있는 시트 종류. openSheet 는 이 값 중 하나이거나 null(모두 닫힘)
export const REQUEST_SHEET = {
  SITUATION: "situation",
  USER: "user",
  START: "start",
  END: "end",
  DUE_DATE: "dueDate",
};

// 요청 수정 폼에서 검증할 필드 (응답 기한/상황/도움 종류/요청 대상은 수정 대상이 아님)
export const EDIT_FORM_VALIDATE_FIELDS = [
  REQUEST_FORM_FIELD_KEY.START_DATE_TIME,
  REQUEST_FORM_FIELD_KEY.END_DATE_TIME,
  REQUEST_FORM_FIELD_KEY.LOCATION,
];

// 검증할 필드 (응답 기한이 고정된 경우)
export const ASK_AGAIN_VALIDATE_FIELDS_FIXED = [REQUEST_FORM_FIELD_KEY.USER_ID];

// 검증할 필드 (응답 기한이 고정되지 않은 경우)
export const ASK_AGAIN_VALIDATE_FIELDS_FLEXIBLE = [
  REQUEST_FORM_FIELD_KEY.USER_ID,
  REQUEST_FORM_FIELD_KEY.DUE_DATE,
];
