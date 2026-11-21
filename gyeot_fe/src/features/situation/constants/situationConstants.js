// 상황 화면에서 사용하는 상수 정의

// 상황 화면에서 이동하는 경로 (App.jsx 라우트 기준, 주석은 화면 코드)
export const SITUATION_NAVIGATION_PATH = {
  SITUATION_LIST: "/situation", // S-00 상황 목록
  SITUATION_CREATE: "/situation/create", // H-01 상황 만들기
  SITUATION_DETAIL: "/situation/detail", // H-03 상황 상세
  SITUATION_MANAGE: "/situation/manage", // H-03-05 참여자 · 상황 관리
  PAST_SITUATION: "/situation/past", // H-04 지난 상황
  PAST_SITUATION_DETAIL: "/situation/past/detail", // N-04 지난 상황 상세
  SITUATION_LEAVE: "/situation/leave", // N-09 상황 나가기
  REQUEST_CREATE: "/request", // H-03-02 요청 작성 (뒤에 /상황 ID)
  REQUEST_REQUESTER_DETAIL: "/request/requester", // H-03-01-A 요청 상세 - 요청자 (뒤에 /요청 ID)
  REQUEST_TARGET_DETAIL: "/request/target", // H-03-01-B 요청 상세 - 대상자 (뒤에 /요청 ID)
  REQUEST_ASSIGNEE_DETAIL: "/request/assignee", // H-03-01 요청 상세 - 담당자 (뒤에 /요청 ID)
};

// H-04 지난 상황 - 상단 탭 (전체 / 도와준 / 도움받은, F-22)
// - HELPED   : 내가 참여자로 도와준 상황
// - RECEIVED : 내가 정보 주인으로 도움받은 상황
export const PAST_SITUATION_FILTER_TABS = [
  { key: "ALL", label: "전체" },
  { key: "HELPED", label: "도와준" },
  { key: "RECEIVED", label: "도움받은" },
];

// H-04 탭 기본값 (지난 상황 목록 조회 filter, 기본 ALL)
export const PAST_SITUATION_DEFAULT_FILTER = "ALL";

// H-04 사람 별 보기 - 아무도 선택하지 않았을 때 문구
export const PAST_SITUATION_ALL_PERSON_TEXT = "전체";

// N-04 지난 상황 상세 - 요청 기록 상태 태그 (완료 / 취소 / 만료, F-22)
// 만료는 시안에 없어 취소와 같은 모양으로 임시 지정
export const PAST_REQUEST_STATUS_TAG = {
  COMPLETED: { label: "완료", variant: "completed" },
  CANCELLED: { label: "취소", variant: "cancelled" },
  EXPIRED: { label: "만료", variant: "cancelled" },
};

// N-04 담당자가 탈퇴했을 때 표시 이름 (F-32)
export const WITHDRAWN_USER_NAME = "탈퇴한 사용자";

// H-01 상황 종류 코드 (API 명세서 상황 생성 situationType)
export const SITUATION_TYPE = {
  HOSPITAL_VISIT: "HOSPITAL_VISIT",
  RECOVERY: "RECOVERY",
  ABSENCE: "ABSENCE",
  OTHER: "OTHER", // 기타 (customSituationType에 직접 입력한 문구)
};

// H-01 상황 종류 (종류 선택 시트)
// key: 서버 situationType 값
export const SITUATION_TYPE_OPTIONS = [
  {
    key: SITUATION_TYPE.HOSPITAL_VISIT,
    label: "병원 이용",
    description: "진료·검사·입원 등 병원에 갈 때",
  },
  {
    key: SITUATION_TYPE.RECOVERY,
    label: "회복",
    description: "수술이나 치료 뒤 회복하는 기간",
  },
  {
    key: SITUATION_TYPE.ABSENCE,
    label: "부재",
    description: "출장·여행 등으로 집을 비울 때",
  },
  { key: SITUATION_TYPE.OTHER, label: "기타", description: "직접 입력" },
];

// '기타' 직접 입력 최대 글자 수
export const SITUATION_TYPE_ETC_MAX_LENGTH = 15;

// 선택 전 표시 문구
export const SITUATION_SELECT_PLACEHOLDER = "선택";

// H-01 상황 이름 최대 글자 수 (API 명세서 상황 생성 name)
export const SITUATION_NAME_MAX_LENGTH = 150;

// H-01 상황 만들기 - 입력 확인 안내 문구 (토스트)
export const SITUATION_CREATE_VALIDATION_MESSAGE = {
  TYPE: "상황 종류를 선택해 주세요.",
  CUSTOM_TYPE: "기타 종류를 입력해 주세요.",
  NAME: "상황 이름을 입력해 주세요.",
  PERIOD: "시작과 종료 시간을 선택해 주세요.",
  PERIOD_ORDER: "종료를 시작 이후로 선택해 주세요.",
};

// 도움 종류 라벨 (H-03 요청 목록, S-00 상황 카드 다음 일정 등)
// key: 서버 helpType 값 (C 도움 요청 명세 기준)
export const HELP_TYPE_LABEL = {
  HOSPITAL: "병원 동행",
  MEAL: "식사",
  GROCERY: "장보기",
  PET_CARE: "반려동물 돌봄",
  CHECK_IN: "연락/안부",
  OTHER: "기타",
};

// H-03 요청 목록 - 상태 칩 (문구 + 스타일 이름)
// - isEnded: 끝난 요청(완료·취소·만료)은 카드 글자를 흐리게 표시
// - 만료는 시안에 없어 취소와 같은 모양으로 임시 지정
// - key: 상황 상세 조회 requests[].displayStatus 값 ('요청됨'은 '응답 대기'로 통합, F-14)
export const REQUEST_STATUS_TAG = {
  WAITING: { label: "응답 대기", variant: "waiting" },
  NO_ASSIGNEE: { label: "담당자 없음", variant: "unassigned" },
  ACCEPTED: { label: "수락됨", variant: "accepted" },
  IN_PROGRESS: { label: "진행 중", variant: "inProgress" },
  COMPLETED: { label: "완료", variant: "completed", isEnded: true },
  CANCELED: { label: "취소", variant: "cancelled", isEnded: true },
  EXPIRED: { label: "만료", variant: "cancelled", isEnded: true },
};

// 요청 화면 표시 상태 (상황 상세 조회 requests[].displayStatus)
export const REQUEST_DISPLAY_STATUS = {
  WAITING: "WAITING", // 응답 대기
  NO_ASSIGNEE: "NO_ASSIGNEE", // 담당자 없음
  ACCEPTED: "ACCEPTED", // 수락됨
  IN_PROGRESS: "IN_PROGRESS", // 진행 중
  COMPLETED: "COMPLETED", // 완료
  CANCELED: "CANCELED", // 취소
  EXPIRED: "EXPIRED", // 만료
};

// 참여 상태 (참여자 목록 조회 items[].status)
export const PARTICIPANT_STATUS = {
  ACTIVE: "ACTIVE",
  LEFT: "LEFT",
  REMOVED: "REMOVED",
};

// 참여자 목록 relationshipLabel 중 보호자 표시값 (보호자 태그 구분용)
export const GUARDIAN_RELATIONSHIP_LABEL = "보호자";

// 상황 상세 조회 실패 코드: 상황이 없거나 접근 불가 → 상황 목록으로 이동
export const SITUATION_NOT_FOUND_CODE = "SITUATION_NOT_FOUND";

// H-03-02 참여자뷰 - 이 요청에서 나의 역할 (요청 카드를 눌렀을 때 이동할 상세)
// - TARGET   : 응답이 필요한 요청 (대상자)
// - ASSIGNEE : 수락한 요청 (담당자)
export const MY_REQUEST_ROLE = {
  TARGET: { label: "내가 대상", path: SITUATION_NAVIGATION_PATH.REQUEST_TARGET_DETAIL },
  ASSIGNEE: { label: "내가 담당", path: SITUATION_NAVIGATION_PATH.REQUEST_ASSIGNEE_DETAIL },
};

// 상황 참여 역할 (진행 중 상황 목록 items[].role)
export const SITUATION_ROLE = {
  OWNER: "OWNER",
  PARTICIPANT: "PARTICIPANT",
};

// S-00 상황 카드 하단 태그: 진행 중 상황 목록 requestCounts의 key → 공통 태그 type
// (공통 태그 문구·스타일은 shared/constants/situationCardConstants.js의 SITUATION_TAG)
export const SITUATION_REQUEST_COUNT_TAGS = [
  { countKey: "acceptedCount", tagType: "ACCEPTED" }, // 수락
  { countKey: "waitingCount", tagType: "WAITING" }, // 응답대기
  { countKey: "noAssigneeCount", tagType: "UNASSIGNED" }, // 담당없음
];

// 목록 API 한 번에 받아올 개수
export const SITUATION_LIST_PAGE_SIZE = 20;

// S-00 하단 '지난 상황'에 미리 보여줄 개수 (나머지는 '전체 보기' → H-04)
export const PAST_SITUATION_PREVIEW_SIZE = 3;
