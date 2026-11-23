// 홈 화면에서 사용하는 상수 정의

// 섹션 탭 (나의 상황 / 참여 상황)
// - key는 홈 통합 조회 situationCards의 key(my / participating)와 같음
export const SITUATION_TAB = {
  MY: "my",
  PARTICIPATING: "participating",
};

export const SITUATION_TAB_LIST = [
  { key: SITUATION_TAB.MY, label: "나의 상황" },
  { key: SITUATION_TAB.PARTICIPATING, label: "참여 상황" },
];

// 홈에서 이동하는 화면 경로 (App.jsx 라우트 기준, 주석은 화면 코드)
export const HOME_NAVIGATION_PATH = {
  SITUATION_DETAIL: "/situation/detail", // H-03 상황 상세
  SITUATION_CREATE: "/situation/create", // H-01 상황 만들기
  REQUEST_CREATE: (situationId) => `/request/${situationId}`, // H-03-02 요청 작성
  ASK_AGAIN: (requestId) => `/request/ask-again/${requestId}`, // N-06 다시 부탁하기 (M-01 '다른 사람')
  REQUEST_DETAIL: (requestId) => `/request/detail/${requestId}`, // H-03-01 요청 상세 (요청자·대상자·담당자 통합)
  ACQUAINTANCE_INVITE: "/relation/acquaintance-invite", // R-01 나의 사람 초대
  CARD: "/card", // C-00 안심카드
  CARD_SHARE: "/card/share", // C-06 공유 관리
};

// 상단 상태 카드 (한눈에 보기)
// isUrgent: 0보다 크면 활성화(강조)되는 "해야 할 일" 항목
// path: 카드 클릭 시 이동 경로 (없으면 이동하지 않음)
export const STATUS_CARD_LIST = [
  // TODO: 응답요청 · 담당없음 · 예정일정 이동 화면 미정 (H-03 연결 해제)
  { key: "requestCount", label: "응답요청", isUrgent: true },
  { key: "unassignedCount", label: "담당없음", isUrgent: true },
  { key: "scheduledCount", label: "예정일정", isUrgent: false },
  {
    key: "sharingCount",
    label: "공유중",
    isUrgent: false,
    path: HOME_NAVIGATION_PATH.CARD_SHARE,
  },
];

// 다가오는 일정 최대 노출 개수 (scr-H-00 주석 12: 가까운 순 2개)
export const MAX_UPCOMING_SCHEDULE_COUNT = 2;

// 홈 토스트 문구 (노출 시간은 공통 스토어 기준, shared/constants/toastConstants.js)
export const HOME_TOAST_MESSAGE = {
  SITUATION_ENDED: "상황을 종료했어요.", // 상황 종료 직후 홈 진입 (scr-H-00 주석 8)
};

// 도움 종류: 서버 응답에 쓰는 값(key), 한글 매핑(value)
// - 홈 통합 조회 helpType 기준 값 (card의 SHARE_HELP_TYPE_LABELS처럼 영역별로 둠)
export const HOME_HELP_TYPE_LABELS = {
  HOSPITAL: "병원 동행",
  MEAL: "식사",
  GROCERY: "장보기",
  PET_CARE: "반려동물",
  CHECK_IN: "연락/안부",
  OTHER: "기타",
};

// 응답이 필요한 요청의 종류 (홈 통합 조회 responseNeededItems.type)
// - RESPONSE: 새로 받은 요청(대상이 바뀌어 받은 요청 포함), deadline은 응답 기한
// - RECONFIRMATION: 수정 후 재확인이 필요한 요청, deadline은 재확인 기한
export const RESPONSE_NEEDED_TYPE = {
  RESPONSE: "RESPONSE",
  RECONFIRMATION: "RECONFIRMATION",
};

// 보낸 요청의 화면 상태 (홈 통합 조회 sentOpenItems.displayStatus)
// - 서버는 끝나지 않은 요청(응답 대기 · 담당자 없음 · 수락됨 · 진행 중)을 모두 내려준다
export const REQUEST_DISPLAY_STATUS = {
  WAITING: "WAITING", // 응답 대기
  NO_ASSIGNEE: "NO_ASSIGNEE", // 담당자 없음
  ACCEPTED: "ACCEPTED", // 수락됨
  IN_PROGRESS: "IN_PROGRESS", // 진행 중
};

// 홈 '보낸 요청'에 표시할 상태 (디자인 합의)
// - 수락됨 · 진행 중은 '다가오는 일정'에서 확인하므로 보낸 요청에서는 숨긴다 (중복 방지)
export const SENT_REQUEST_VISIBLE_STATUS_LIST = [
  REQUEST_DISPLAY_STATUS.WAITING,
  REQUEST_DISPLAY_STATUS.NO_ASSIGNEE,
];

// 요청 리스트 태그 문구
export const REQUEST_TAG_TEXT = {
  RECONFIRMATION: "재확인", // 받은 요청: 재확인 요청 (기한 태그 뒤)
  DEADLINE_PASSED: "기한 지남", // 받은 요청: 응답 기한이 지났지만 시작 전이라 아직 응답 가능
  NO_ASSIGNEE: "담당자 없음", // 보낸 요청: 담당자 없음 (남은 시간 대신)
};

// 보낸 요청 "To. 이름"에서 이름 대신 표시할 문구
// - 담당자 없음이거나, 이름이 없을 때(서버 이름 필드 반영 전 · 표시할 이름 없음) 사용
export const EMPTY_NAME_TEXT = "-";

// M-01 담당자 없음 모달: 사유(reason)별 태그 · 안내 문구 (키는 담당자 없음 안내 목록의 reason 값과 동일)
// - 이름 뒤 조사/위치가 사유마다 달라서 message는 이름을 받아 문장을 만드는 함수로 둠
// - 여기에 없는 사유는 noAssigneeNoticeService에서 제외 (모달을 그리지 못해 다음 안내가 막히지 않도록)
// - 문구는 디자인 시안 기준. USER_WITHDRAWN은 서버 이름이 "탈퇴한 사용자"라
//   "지금은 탈퇴한 사용자님께 요청이 불가능해요."로 표시됨 (11/19 디자인 유지 결정)
export const NO_ASSIGNEE_MODAL_CONFIG = {
  UNAVAILABLE: {
    tag: "어려움",
    message: (name) => `${name}님이 이번 요청은 어렵다고 응답하셨어요.`,
  },
  ACCEPTANCE_WITHDRAWN: {
    tag: "어려움",
    message: (name) => `${name}님이 요청이 어렵다고 응답을 수정하셨어요.`,
  },
  DEADLINE_PASSED: {
    tag: "기한 초과",
    message: (name) => `${name}님이 기한 내에 응답하지 않았어요.`,
  },
  RELATIONSHIP_ENDED: {
    tag: "관계 해제",
    message: (name) => `${name}님과 관계가 해제되어 요청할 수 없어요.`,
  },
  PARTICIPANT_LEFT: {
    tag: "상황 이탈",
    message: (name) => `${name}님이 상황에서 제외되어 요청할 수 없어요.`,
  },
  USER_WITHDRAWN: {
    tag: "탈퇴",
    message: (name) => `지금은 ${name}님께 요청이 불가능해요.`,
  },
};

// M-01 대상 이름이 null일 때 표시할 이름 (서버의 탈퇴 사용자 표시와 같은 문구)
export const NO_ASSIGNEE_FALLBACK_NAME = "탈퇴한 사용자";

// 상황 카드 하단 태그: 홈 통합 조회 requestCounts의 key → 태그 종류(SITUATION_TAG의 key)
// - 화면에 그릴 순서대로 작성. 응답에 없는 key는 태그를 그리지 않음
// - key는 F-34 명세(BE #147) requestCounts 기준: accepted, inProgress, waiting, noAssignee, responseNeeded
//   (참여 상황의 waiting · noAssignee는 서버가 항상 0)
// - inProgress(진행 중)는 수락과 따로 '진행중' 태그로 표시 (11/23 디자인 결정, 기본 태그 스타일)
export const SITUATION_REQUEST_COUNT_TAG_LIST = {
  [SITUATION_TAB.MY]: [
    { countKey: "accepted", tagType: "ACCEPTED" },
    { countKey: "inProgress", tagType: "IN_PROGRESS" },
    { countKey: "waiting", tagType: "WAITING" },
    { countKey: "noAssignee", tagType: "UNASSIGNED" },
  ],
  [SITUATION_TAB.PARTICIPATING]: [
    { countKey: "accepted", tagType: "ACCEPTED" },
    { countKey: "inProgress", tagType: "IN_PROGRESS" },
    { countKey: "responseNeeded", tagType: "REQUESTED" },
  ],
};