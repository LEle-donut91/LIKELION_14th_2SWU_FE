// 홈 화면 테스트용 데이터
// 백엔드 API 연동 전까지 homeApi.js에서 사용한다.
// 날짜는 항상 유효한 D-day/남은 시간이 나오도록 "오늘" 기준 상대값으로 생성한다.

// 오늘 기준 dayOffset일 뒤, hour:minute 시각의 ISO 문자열
const getRelativeDate = (dayOffset, hour = 0, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

// 현재 시각 기준 minuteOffset분 뒤의 ISO 문자열
const getRelativeTime = (minuteOffset) =>
  new Date(Date.now() + minuteOffset * 60000).toISOString();

/*
 * 임시 홈 응답 데이터 형태
 * {
 *   isNewUser: boolean,                     // 신규 사용자(빈 상태) 여부
 *   summary: {                              // 상단 상태 카드
 *     requestCount, unassignedCount, scheduledCount, sharingCount
 *   },
 *   mySituation: TabContent,                // 나의 상황 탭
 *   participatingSituation: TabContent,     // 참여 상황 탭
 * }
 *
 * TabContent {
 *   situations: [{
 *     id, title, startDate, endDate,
 *     participantCount?,                    // 없으면 메타에서 숨김
 *     nextSchedule: { dateTime, assigneeName, typeName } | null,
 *     extraScheduleCount,                   // nextSchedule 외 예정 일정 수
 *     tags: [{ type: "ACCEPTED" | "WAITING" | "UNASSIGNED" | "REQUESTED", count }]
 *   }],
 *   receivedRequests: [{ id, requester: { name, profileImageUrl }, typeName, dateTime, location, deadline }],
 *   sentRequests: [{ id, receiverName, typeName, dateTime, deadline }],
 *   upcomingSchedules: [{ id, dateTime, typeName, assigneeName }]
 * }
 */

const EMPTY_TAB_CONTENT = {
  situations: [],
  receivedRequests: [],
  sentRequests: [],
  upcomingSchedules: [],
};

const UPCOMING_SCHEDULE_LIST = [
  { id: 301, dateTime: getRelativeDate(1, 22, 0), typeName: "장보기", assigneeName: "서연" },
  { id: 302, dateTime: getRelativeDate(3, 15, 0), typeName: "장보기", assigneeName: "하음" },
];

// 1) 신규 사용자 · 빈 상태 (H-00 홈-빈화면)
const NEW_USER = {
  isNewUser: true,
  summary: { requestCount: 0, unassignedCount: 0, scheduledCount: 0, sharingCount: 0 },
  mySituation: EMPTY_TAB_CONTENT,
  participatingSituation: EMPTY_TAB_CONTENT,
};

// 2) 진행 중 상황 없음 (H-00 홈-상황없음-토스트)
const NO_SITUATION = {
  isNewUser: false,
  summary: { requestCount: 0, unassignedCount: 0, scheduledCount: 0, sharingCount: 0 },
  mySituation: EMPTY_TAB_CONTENT,
  participatingSituation: EMPTY_TAB_CONTENT,
};

// 3) 상황·요청 있음 (H-00 홈-나의상황 / 홈-참여상황)
const WITH_SITUATION = {
  isNewUser: false,
  summary: { requestCount: 2, unassignedCount: 2, scheduledCount: 4, sharingCount: 3 },
  mySituation: {
    situations: [
      {
        id: 1,
        title: "출장 부재",
        startDate: getRelativeDate(-4),
        endDate: getRelativeDate(9),
        participantCount: 2,
        nextSchedule: { dateTime: getRelativeDate(3, 15, 0), assigneeName: "하음", typeName: "장보기" },
        extraScheduleCount: 1,
        tags: [
          { type: "ACCEPTED", count: 0 },
          { type: "WAITING", count: 0 },
          { type: "UNASSIGNED", count: 0 },
        ],
      },
      {
        id: 2,
        title: "수술 회복",
        startDate: getRelativeDate(-27),
        endDate: getRelativeDate(4),
        participantCount: 4,
        nextSchedule: null,
        extraScheduleCount: 0,
        tags: [
          { type: "ACCEPTED", count: 0 },
          { type: "UNASSIGNED", count: 0 },
        ],
      },
      {
        id: 3,
        title: "다리 부상",
        startDate: getRelativeDate(-3),
        endDate: getRelativeDate(0),
        participantCount: 0,
        nextSchedule: null,
        extraScheduleCount: 0,
        tags: [],
      },
    ],
    receivedRequests: [
      {
        id: 101,
        requester: { name: "서연", profileImageUrl: null },
        typeName: "병원 동행",
        dateTime: getRelativeDate(1, 22, 0),
        location: "슈슈 병원",
        deadline: getRelativeTime(60 * 24 * 3 + 120),
      },
      {
        id: 102,
        requester: { name: "지훈", profileImageUrl: null },
        typeName: "반려동물 돌봄",
        dateTime: getRelativeDate(2, 10, 0),
        location: "자택",
        deadline: getRelativeTime(4 * 60 + 3),
      },
    ],
    sentRequests: [
      {
        id: 201,
        receiverName: "하음",
        typeName: "장보기",
        dateTime: getRelativeDate(1, 22, 0),
        deadline: getRelativeTime(60 * 25),
      },
      {
        id: 202,
        receiverName: "나예",
        typeName: "심부름",
        dateTime: getRelativeDate(5, 12, 0),
        deadline: getRelativeTime(4 * 60),
      },
    ],
    upcomingSchedules: UPCOMING_SCHEDULE_LIST,
  },
  participatingSituation: {
    situations: [
      {
        id: 11,
        title: "출장 부재",
        startDate: getRelativeDate(-4),
        endDate: getRelativeDate(9),
        nextSchedule: { dateTime: getRelativeDate(3, 15, 0), assigneeName: "하음", typeName: "장보기" },
        extraScheduleCount: 1,
        tags: [
          { type: "ACCEPTED", count: 0 },
          { type: "REQUESTED", count: 3 },
        ],
      },
      {
        id: 12,
        title: "수술 회복",
        startDate: getRelativeDate(-27),
        endDate: getRelativeDate(4),
        nextSchedule: null,
        extraScheduleCount: 0,
        tags: [{ type: "REQUESTED", count: 1 }],
      },
    ],
    receivedRequests: [
      {
        id: 111,
        requester: { name: "서연", profileImageUrl: null },
        typeName: "병원 동행",
        dateTime: getRelativeDate(1, 22, 0),
        location: "슈슈 병원",
        deadline: getRelativeTime(60 * 24 * 3 + 120),
      },
    ],
    sentRequests: [
      {
        id: 211,
        receiverName: "하음",
        typeName: "장보기",
        dateTime: getRelativeDate(1, 22, 0),
        deadline: getRelativeTime(60 * 25),
      },
    ],
    upcomingSchedules: UPCOMING_SCHEDULE_LIST,
  },
};

// 4) 진행 중인 나의 상황 1개 (도움 요청 → 시트 없이 바로 요청 작성)
const SINGLE_SITUATION = {
  ...WITH_SITUATION,
  summary: { requestCount: 2, unassignedCount: 0, scheduledCount: 2, sharingCount: 3 },
  mySituation: {
    ...WITH_SITUATION.mySituation,
    situations: WITH_SITUATION.mySituation.situations.slice(0, 1),
  },
};

// 테스트 시나리오를 지정하는 URL 쿼리 키 (예: /home?mock=empty)
export const MOCK_QUERY_KEY = "mock";
export const DEFAULT_MOCK_SCENARIO = "default";

// 시나리오 키 → 테스트 데이터
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
