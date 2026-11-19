// 홈 화면 테스트용 데이터 (홈 통합 조회 F-34 응답의 data와 같은 형태)
// - homeApi.js의 USE_MOCK 분기에서 공통 응답으로 감싸 사용한다.
// - 명세 초안(임시 계약): 현행 예시 JSON에 없는 필드는 "// 추가 제안 · 미확정" 주석으로 표시
//   (API_CONVENTIONS 7-1). 필드명이 바뀌면 homeService.js만 수정한다.
// - 날짜는 항상 유효한 D-day/남은 시간이 나오도록 "오늘" 기준 상대값으로 생성한다.
//   형식은 "YYYY-MM-DDTHH:mm:ss" 로컬 시각 (toISOString 사용 금지, API 공통 규칙 7)

const padTwo = (number) => String(number).padStart(2, "0");

// Date → "YYYY-MM-DDTHH:mm:ss" (로컬 시각)
const toLocalDateTimeString = (date) =>
  `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}` +
  `T${padTwo(date.getHours())}:${padTwo(date.getMinutes())}:${padTwo(date.getSeconds())}`;

// 오늘 기준 dayOffset일 뒤, hour:minute 시각
const getRelativeDate = (dayOffset, hour = 0, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return toLocalDateTimeString(date);
};

// 현재 시각 기준 minuteOffset분 뒤
const getRelativeTime = (minuteOffset) =>
  toLocalDateTimeString(new Date(Date.now() + minuteOffset * 60000));

/**
 * =====================================================================
 * 공통 조각
 * =====================================================================
 */

const EMPTY_COUNTS = {
  responseNeeded: 0,
  unassigned: 0,
  upcomingSchedules: 0, // upcomingScheduleCount로 이름 변경 제안 (미확정)
  activeSharings: 0, // D sharingCount와 이름 통일 협의 중 (미확정)
};

const EMPTY_SITUATION_CARDS = { my: [], participating: [] };

// 나의 상황 카드 (situationCards.my) - 추가 제안 · 미확정
// - requestCounts 형태는 명세에 없어 가정함: 나의 상황 { accepted, waiting, noAssignee }
const MY_SITUATION_CARD_LIST = [
  {
    situationId: 1,
    name: "출장 부재",
    startAt: getRelativeDate(-4),
    endAt: getRelativeDate(9),
    participantCount: 2,
    isOwner: true,
    requestCounts: { accepted: 0, waiting: 0, noAssignee: 0 }, // 형태 미확정
    nextSchedule: {
      startsAt: getRelativeDate(3, 15, 0),
      helpType: "GROCERY",
      assigneeName: "하음",
    },
    remainingScheduleCount: 1,
  },
  {
    situationId: 2,
    name: "수술 회복",
    startAt: getRelativeDate(-27),
    endAt: getRelativeDate(4),
    participantCount: 4,
    isOwner: true,
    requestCounts: { accepted: 0, noAssignee: 0 }, // 형태 미확정
    nextSchedule: null,
    remainingScheduleCount: 0,
  },
  {
    situationId: 3,
    name: "다리 부상",
    startAt: getRelativeDate(-3),
    endAt: getRelativeDate(0),
    participantCount: 0,
    isOwner: true,
    requestCounts: null, // 형태 미확정 (태그 없음 확인용)
    nextSchedule: null,
    remainingScheduleCount: 0,
  },
];

// 참여 상황 카드 (situationCards.participating) - 추가 제안 · 미확정
// - requestCounts 형태는 명세에 없어 가정함: 참여 상황 { accepted, requested }
// - participantCount는 나의 상황에서만 표시 (화면에서 숨김은 service가 처리)
const PARTICIPATING_SITUATION_CARD_LIST = [
  {
    situationId: 11,
    name: "출장 부재",
    startAt: getRelativeDate(-4),
    endAt: getRelativeDate(9),
    participantCount: 3,
    isOwner: false,
    requestCounts: { accepted: 0, requested: 3 }, // 형태 미확정
    nextSchedule: {
      startsAt: getRelativeDate(3, 15, 0),
      helpType: "GROCERY",
      assigneeName: "하음",
    },
    remainingScheduleCount: 1,
  },
  {
    situationId: 12,
    name: "수술 회복",
    startAt: getRelativeDate(-27),
    endAt: getRelativeDate(4),
    participantCount: 2,
    isOwner: false,
    requestCounts: { requested: 1 }, // 형태 미확정
    nextSchedule: null,
    remainingScheduleCount: 0,
  },
];

// 응답이 필요한 요청 (responseNeededItems)
const RESPONSE_NEEDED_ITEM_LIST = [
  {
    requestId: 101,
    title: "병원 동행", // 현행 초안 (helpType으로 변경 검토)
    status: "REQUESTED", // C 저장 상태 (enum 미확정)
    requester: { userId: 21, name: "서연", profileImageUrl: null }, // 추가 제안 · 미확정
    helpType: "HOSPITAL", // 추가 제안 · 미확정
    startsAt: getRelativeDate(1, 22, 0), // 추가 제안 · 미확정
    place: "슈슈 병원", // 추가 제안 · 미확정
    responseDeadline: getRelativeTime(60 * 24 * 3 + 120), // 추가 제안 · 미확정
    displayStatus: "WAITING", // 추가 제안 · 미확정
  },
  {
    requestId: 102,
    title: "반려동물 돌봄",
    status: "REQUESTED",
    requester: { userId: 22, name: "지훈", profileImageUrl: null },
    helpType: "PET_CARE",
    startsAt: getRelativeDate(2, 10, 0),
    place: "자택",
    responseDeadline: getRelativeTime(4 * 60 + 3),
    displayStatus: "WAITING",
  },
];

// 내가 보낸 진행 중 요청 (sentOpenItems)
const SENT_OPEN_ITEM_LIST = [
  {
    requestId: 201,
    title: "장보기", // 현행 초안 (helpType으로 변경 검토)
    status: "REQUESTED",
    target: { userId: 23, name: "하음" }, // 추가 제안 · 미확정 (요청 대상. 실제 담당자와 구분)
    helpType: "GROCERY", // 추가 제안 · 미확정
    startsAt: getRelativeDate(1, 22, 0), // 추가 제안 · 미확정
    responseDeadline: getRelativeTime(60 * 25), // 추가 제안 · 미확정
    hasAssignee: false, // 추가 제안 · 미확정 (실제 담당자 배정 여부)
    displayStatus: "WAITING", // 추가 제안 · 미확정
  },
  {
    requestId: 202,
    title: "식사",
    status: "REQUESTED",
    target: { userId: 24, name: "나예" },
    helpType: "MEAL",
    startsAt: getRelativeDate(5, 12, 0),
    responseDeadline: getRelativeTime(4 * 60),
    hasAssignee: false,
    displayStatus: "WAITING",
  },
];

// 예정 일정 (upcomingSchedules, 최대 2개 / 가까운 순)
const UPCOMING_SCHEDULE_LIST = [
  {
    requestId: 301,
    title: "장보기", // 현행 초안 (helpType으로 대체 검토)
    scheduledAt: getRelativeDate(1, 22, 0), // 현행 초안 (startsAt으로 변경 제안)
    startsAt: getRelativeDate(1, 22, 0), // 추가 제안 · 미확정
    helpType: "GROCERY", // 추가 제안 · 미확정
    counterpartName: "서연", // 추가 제안 · 미확정 (일정에 표시할 상대 이름)
  },
  {
    requestId: 302,
    title: "장보기",
    scheduledAt: getRelativeDate(3, 15, 0),
    startsAt: getRelativeDate(3, 15, 0),
    helpType: "GROCERY",
    counterpartName: "하음",
  },
];

/**
 * =====================================================================
 * 시나리오
 * =====================================================================
 */

// 1) 신규 사용자 · 빈 상태 (H-00 홈-빈화면)
const NEW_USER = {
  counts: EMPTY_COUNTS,
  situationCards: EMPTY_SITUATION_CARDS, // 추가 제안 · 미확정
  isNewUser: true, // 추가 제안 · 미확정 (신규 판정 기준 A·B 협의 중)
  responseNeededItems: [],
  sentOpenItems: [],
  upcomingSchedules: [],
};

// 2) 진행 중 상황 없음 (H-00 홈-상황없음-토스트)
const NO_SITUATION = {
  ...NEW_USER,
  isNewUser: false,
};

// 3) 상황·요청 있음 (H-00 홈-나의상황 / 홈-참여상황)
const WITH_SITUATION = {
  counts: {
    responseNeeded: 2,
    unassigned: 2,
    upcomingSchedules: 4, // 전체 건수 (목록은 최대 2개)
    activeSharings: 3, // homeApi.js에서 공유 목업 저장소의 공유 중 건수로 바꿔서 반환
  },
  situationCards: {
    my: MY_SITUATION_CARD_LIST,
    participating: PARTICIPATING_SITUATION_CARD_LIST,
  },
  isNewUser: false,
  responseNeededItems: RESPONSE_NEEDED_ITEM_LIST,
  sentOpenItems: SENT_OPEN_ITEM_LIST,
  upcomingSchedules: UPCOMING_SCHEDULE_LIST,
};

// 4) 진행 중인 나의 상황 1개 (도움 요청 → 시트 없이 바로 요청 작성)
const SINGLE_SITUATION = {
  ...WITH_SITUATION,
  counts: { ...WITH_SITUATION.counts, unassigned: 0, upcomingSchedules: 2 },
  situationCards: {
    ...WITH_SITUATION.situationCards,
    my: MY_SITUATION_CARD_LIST.slice(0, 1),
  },
};

// 테스트 시나리오를 지정하는 URL 쿼리 키 (예: /home?mock=empty)
export const MOCK_QUERY_KEY = "mock";
export const DEFAULT_MOCK_SCENARIO = "default";

// 시나리오 키 → 테스트 데이터 (응답의 data 부분)
export const HOME_MOCK_DATA = {
  new: NEW_USER,
  empty: NO_SITUATION,
  single: SINGLE_SITUATION,
  default: WITH_SITUATION,
};

// 테스트 버튼(HomeTestSwitcher)에 표시할 시나리오 목록
export const HOME_MOCK_SCENARIO_LIST = [
  { key: "new", label: "신규" },
  { key: "empty", label: "상황 0개" },
  { key: "single", label: "상황 1개" },
  { key: "default", label: "상황 여러 개" },
];