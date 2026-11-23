// 홈 화면 테스트용 데이터 (홈 통합 조회 F-34 응답의 data와 같은 형태)
// - homeApi.js의 USE_MOCK 분기에서 공통 응답으로 감싸 사용한다.
// - 요청 · 일정 목록은 BE PR #133 실제 필드 · enum · 정렬 기준으로 작성한다.
//   PR #133에 없는 필드는 주석으로 표시한다 (API_CONVENTIONS 7-1).
//   · "서버 반영 대기": BE에서 추가 예정이라고 답변받은 필드 (requesterName · targetUserName · counterpartName)
//   · "추가 제안 · 미확정": 아직 제공 여부가 정해지지 않은 필드 (situationCards · isNewUser · 보낸 요청 responseDeadline)
//   필드명이 바뀌면 homeService.js만 수정한다.
// - 날짜는 항상 유효한 D-day/남은 시간이 나오도록 "오늘" 기준 상대값으로 생성한다.
//   형식은 "YYYY-MM-DDTHH:mm:ss" 로컬 시각 (toISOString 사용 금지, API 공통 규칙 7)
// - 로그인 사용자 ID는 10으로 가정한다.

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

// 현재 시각 기준 minuteOffset분 뒤 (음수면 지난 시각)
const getRelativeTime = (minuteOffset) =>
  toLocalDateTimeString(new Date(Date.now() + minuteOffset * 60000));

// 로그인 사용자 ID (요청자 · 담당자 ID 표시용)
const MY_USER_ID = 10;

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
// - requestCounts 형태는 명세에 없어 가정함: 참여 상황 { accepted, responseNeeded }
// - participantCount는 나의 상황에서만 표시 (화면에서 숨김은 service가 처리)
const PARTICIPATING_SITUATION_CARD_LIST = [
  {
    situationId: 11,
    name: "출장 부재",
    startAt: getRelativeDate(-4),
    endAt: getRelativeDate(9),
    participantCount: 3,
    isOwner: false,
    requestCounts: { accepted: 0, responseNeeded: 3 }, // 형태 미확정
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
    requestCounts: { responseNeeded: 1 }, // 형태 미확정
    nextSchedule: null,
    remainingScheduleCount: 0,
  },
];

// 응답이 필요한 요청 (responseNeededItems)
// - 서버 정렬: 기한(deadline)이 빠른 순
// - type: RESPONSE(새 요청 · 대상 변경으로 받은 요청) / RECONFIRMATION(수정 후 재확인)
// - 일반 요청은 응답 기한이 지나도 시작 전이면 목록에 남음 ('기한 지남' 확인용)
// - 급한 요청(URGENT, 일시 · 장소 null 가능)은 1차 추가 기능이라 목업에 넣지 않음 (null 처리 코드는 유지)
const RESPONSE_NEEDED_ITEM_LIST = [
  {
    requestId: 103,
    type: "RESPONSE",
    requestType: "GENERAL",
    helpType: "MEAL",
    startsAt: getRelativeDate(2, 12, 0),
    place: "자택",
    requesterId: 23,
    deadline: getRelativeTime(-120), // 기한 지남 (시작 전이라 응답 가능)
    requesterName: "민재", // 서버 반영 대기
  },
  {
    requestId: 104,
    type: "RESPONSE",
    requestType: "GENERAL",
    helpType: "CHECK_IN",
    startsAt: getRelativeDate(1, 19, 0),
    place: "자택",
    requesterId: 24,
    deadline: getRelativeTime(30),
    requesterName: null, // 서버 반영 대기 (표시할 이름이 없으면 null, 프로필 이름 빈칸 확인용)
  },
  {
    requestId: 102,
    type: "RECONFIRMATION",
    requestType: "GENERAL",
    helpType: "PET_CARE",
    startsAt: getRelativeDate(2, 10, 0),
    place: "자택",
    requesterId: 22,
    deadline: getRelativeTime(4 * 60 + 3), // 재확인 기한
    requesterName: "지훈", // 서버 반영 대기
  },
  {
    requestId: 101,
    type: "RESPONSE",
    requestType: "GENERAL",
    helpType: "HOSPITAL",
    startsAt: getRelativeDate(4, 22, 0),
    place: "슈슈 병원",
    requesterId: 21,
    deadline: getRelativeTime(60 * 24 * 3 + 120),
    requesterName: "서연", // 서버 반영 대기
  },
];

// 내가 보낸 끝나지 않은 요청 (sentOpenItems)
// - 서버 정렬: 시작 시각 순. 응답 대기 · 담당자 없음 · 수락됨 · 진행 중이 모두 내려옴
// - 화면에는 응답 대기 · 담당자 없음만 표시 (수락됨은 service에서 제외되는지 확인용)
const SENT_OPEN_ITEM_LIST = [
  {
    requestId: 201,
    requestType: "GENERAL",
    helpType: "GROCERY",
    startsAt: getRelativeDate(1, 22, 0),
    endsAt: getRelativeDate(1, 23, 0),
    requesterId: MY_USER_ID,
    targetUserId: 23,
    displayStatus: "WAITING",
    targetUserName: "하음", // 서버 반영 대기
    responseDeadline: getRelativeTime(60 * 20), // 추가 제안 · 미확정
  },
  {
    requestId: 203,
    requestType: "GENERAL",
    helpType: "GROCERY",
    startsAt: getRelativeDate(3, 15, 0),
    endsAt: getRelativeDate(3, 17, 0),
    requesterId: MY_USER_ID,
    targetUserId: 23,
    displayStatus: "ACCEPTED", // 화면에서 제외 (다가오는 일정 203과 같은 요청)
    targetUserName: "하음", // 서버 반영 대기
    responseDeadline: null, // 추가 제안 · 미확정 (응답 대기일 때만 값 있음)
  },
  {
    requestId: 202,
    requestType: "GENERAL",
    helpType: "MEAL",
    startsAt: getRelativeDate(5, 12, 0),
    endsAt: getRelativeDate(5, 13, 0),
    requesterId: MY_USER_ID,
    targetUserId: 24,
    displayStatus: "WAITING",
    targetUserName: null, // 서버 반영 대기 (이름이 없을 때 "To. -" 확인용)
    responseDeadline: getRelativeTime(4 * 60), // 추가 제안 · 미확정
  },
  {
    requestId: 204,
    requestType: "GENERAL",
    helpType: "HOSPITAL",
    startsAt: getRelativeDate(6, 10, 0),
    endsAt: getRelativeDate(6, 12, 0),
    requesterId: MY_USER_ID,
    targetUserId: 25, // 마지막 지정 대상 (거절 · 기한 경과 등)
    displayStatus: "NO_ASSIGNEE",
    targetUserName: null, // 서버 반영 대기 (담당자 없음이면 서버가 null로 내려줌)
    responseDeadline: null, // 추가 제안 · 미확정
  },
];

// 다가오는 일정 (upcomingSchedules)
// - 내가 부탁했거나 맡은 수락됨 · 진행 중 요청, 시작이 빠른 순 최대 2개 (전체 수는 counts.upcomingSchedules)
const UPCOMING_SCHEDULE_LIST = [
  {
    requestId: 301,
    helpType: "GROCERY",
    startsAt: getRelativeDate(1, 22, 0),
    place: "마트",
    requesterId: 21, // 내가 맡은 일정
    assigneeId: MY_USER_ID,
    counterpartName: "서연", // 서버 반영 대기 (내가 맡았으면 요청자 이름)
  },
  {
    requestId: 203,
    helpType: "GROCERY",
    startsAt: getRelativeDate(3, 15, 0),
    place: "마트",
    requesterId: MY_USER_ID, // 내가 부탁한 일정 (보낸 요청 203)
    assigneeId: 23,
    counterpartName: "하음", // 서버 반영 대기 (내가 부탁했으면 담당자 이름)
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
// - counts는 목록과 같은 기준: 응답 필요 = 목록 전체 수, 담당자 없음 = 보낸 요청 중 NO_ASSIGNEE 수
const WITH_SITUATION = {
  counts: {
    responseNeeded: RESPONSE_NEEDED_ITEM_LIST.length,
    unassigned: 1,
    upcomingSchedules: 4, // 전체 건수 (목록은 최대 2개)
    activeSharings: 3, // homeApi.js에서 공유 목업 저장소의 공유 중 건수로 바꿔서 반환
  },
  situationCards: {
    my: MY_SITUATION_CARD_LIST,
    participating: PARTICIPATING_SITUATION_CARD_LIST,
  },
  isNewUser: false, // 추가 제안 · 미확정
  responseNeededItems: RESPONSE_NEEDED_ITEM_LIST,
  sentOpenItems: SENT_OPEN_ITEM_LIST,
  upcomingSchedules: UPCOMING_SCHEDULE_LIST,
};

// 4) 진행 중인 나의 상황 1개 (도움 요청 → 시트 없이 바로 요청 작성)
// - 담당자 없음 0건이므로 보낸 요청에서도 담당자 없음 요청을 뺌
const SINGLE_SITUATION = {
  ...WITH_SITUATION,
  counts: { ...WITH_SITUATION.counts, unassigned: 0, upcomingSchedules: 2 },
  situationCards: {
    ...WITH_SITUATION.situationCards,
    my: MY_SITUATION_CARD_LIST.slice(0, 1),
  },
  sentOpenItems: SENT_OPEN_ITEM_LIST.filter(
    (item) => item.displayStatus !== "NO_ASSIGNEE",
  ),
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