// 홈 화면에서 사용하는 상수 정의

// 섹션 탭 (나의 상황 / 참여 상황)
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
  REQUEST_CREATE: "/request", // H-03-02 요청 작성
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

// 상황 카드 하단 태그
// isActive: 활성화 태그(테두리/배경 olive-200) 여부
export const SITUATION_TAG = {
  ACCEPTED: { label: "수락", isActive: false },
  WAITING: { label: "응답대기", isActive: false },
  UNASSIGNED: { label: "담당없음", isActive: true },
  REQUESTED: { label: "응답요청", isActive: true },
};

// 다가오는 일정 최대 노출 개수 (scr-H-00 주석 12: 가까운 순 2개)
export const MAX_UPCOMING_SCHEDULE_COUNT = 2;

// 토스트 노출 시간(ms)
export const TOAST_DURATION = 3000;
