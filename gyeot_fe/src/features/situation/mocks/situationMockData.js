// S-00 상황 목록 목업 데이터 (API 연동 전 화면 확인용)
// 진행 중 상황은 홈(H-00)과 같은 형태를 사용해 공통 SituationCard에 그대로 넘긴다.

export const ONGOING_SITUATION_MOCK = {
  id: 1,
  title: "출장 부재",
  startDate: "2026-10-01",
  endDate: "2026-11-14",
  participantCount: 4,
  nextSchedule: {
    dateTime: "2026-10-03T15:00:00",
    assigneeName: "하음",
    typeName: "장보기",
  },
  extraScheduleCount: 1,
  tags: [
    { type: "ACCEPTED", count: 0 },
    { type: "WAITING", count: 0 },
    { type: "UNASSIGNED", count: 0 },
  ],
};

// 카드 하단 '다음 일정' 줄
export const UPCOMING_SCHEDULE_MOCK = {
  dateTime: "2026-10-02T14:00:00",
  title: "병원 동행",
  assigneeName: "서연",
};

// 지난 상황 목록 (S-00 하단, H-04 지난 상황)
// - isOwner          : 내가 정보 주인(도움받은)인지, 아니면 참여자(도와준)인지
// - ownerName        : 정보 주인 이름 (내 상황이 아닐 때 "OO님의 상황")
// - participantCount : 참여자 수 (내 상황일 때 "참여자 N명")
// - personIds        : 함께한 사람 id (H-04 사람 별 보기 필터용)
export const PAST_SITUATION_LIST_MOCK = [
  {
    id: 11,
    title: "감기 회복",
    startDate: "2026-08-10",
    endDate: "2026-08-17",
    requestCount: 2,
    isOwner: false,
    ownerName: "하은",
    participantCount: 2,
    personIds: [3],
  },
  {
    id: 12,
    title: "출장 부재",
    startDate: "2026-07-01",
    endDate: "2026-07-08",
    requestCount: 1,
    isOwner: true,
    ownerName: "나",
    participantCount: 0,
    personIds: [],
  },
  {
    id: 13,
    title: "무릎 수술 회복",
    startDate: "2026-06-01",
    endDate: "2026-06-20",
    requestCount: 3,
    isOwner: true,
    ownerName: "나",
    participantCount: 1,
    personIds: [1],
  },
  {
    id: 14,
    title: "허리 통증 휴식",
    startDate: "2026-05-04",
    endDate: "2026-05-15",
    requestCount: 1,
    isOwner: false,
    ownerName: "서연",
    participantCount: 2,
    personIds: [1, 2],
  },
];

// H-04 사람 별 보기 - 지난 상황에서 함께한 사람
export const PAST_SITUATION_PERSON_LIST_MOCK = [
  { id: 1, name: "서연", isGuardian: true },
  { id: 2, name: "민재", isGuardian: false },
  { id: 3, name: "하은", isGuardian: false },
];

// H-01 참여할 지인 목록 (내 사람으로 등록한 지인)
export const ACQUAINTANCE_LIST_MOCK = [
  { id: 1, name: "서연", relation: "", isGuardian: true },
  { id: 2, name: "민재", relation: "친구", isGuardian: false },
  { id: 3, name: "하은", relation: "이웃", isGuardian: false },
];

// H-03-05 상황 관리 - 정보 주인 시점 참여자 목록
// relationLabel: 이름 아래 보조 문구 (보호자만 표시)
export const MANAGE_PARTICIPANT_LIST_MOCK = [
  { id: 1, name: "서연", relationLabel: "보호자", isGuardian: true },
  { id: 2, name: "민재", relationLabel: "", isGuardian: false },
  { id: 3, name: "하은", relationLabel: "", isGuardian: false },
];

// H-03-05 참여자 추가 시트 - 활성 관계 지인 전체 (이미 참여 중인 사람은 시트에서 '참여 중'으로 표시)
export const INVITE_CANDIDATE_LIST_MOCK = [
  { id: 1, name: "서연", relationText: "서로의 보호자", isGuardian: true },
  { id: 2, name: "민재", relationText: "나의 사람", isGuardian: false },
  { id: 3, name: "하은", relationText: "나의 사람", isGuardian: false },
  // 아직 참여하지 않은 지인 (체크해서 추가할 수 있음)
  { id: 4, name: "지우", relationText: "나의 사람", isGuardian: false },
  { id: 5, name: "도윤", relationText: "나의 사람", isGuardian: false },
];

// H-03-05 상황 관리 - 참여자 시점에서 보는 상황
export const JOINED_SITUATION_MOCK = {
  id: 21,
  title: "무릎 수술 회복",
  startDate: "2026-10-28",
  endDate: "2026-11-20",
  ownerName: "지우",
};

// H-03-05 상황 종료 시트 - 진행 중인 요청 수
export const ACTIVE_REQUEST_COUNT_MOCK = 2;

// N-09 상황 나가기 시트 - 이 상황에서 내가 담당 중인 요청
export const MY_ASSIGNED_REQUEST_LIST_MOCK = [
  {
    id: 301,
    helpType: "HOSPITAL",
    startDateTime: "2026-11-20T14:00:00",
    status: "ACCEPTED",
  },
];

// H-03 상황 상세 - 정보 주인 시점
// participants: 정보 주인을 뺀 참여자 / requests: 이 상황의 요청 목록
export const SITUATION_DETAIL_MOCK = {
  id: 21,
  title: "무릎 수술 회복",
  startDate: "2026-11-01",
  endDate: "2026-11-24",
  participants: [
    { id: 1, name: "서연", isGuardian: true },
    { id: 2, name: "민재", isGuardian: false },
    { id: 3, name: "하은", isGuardian: false },
  ],
  requests: [
    {
      id: 101,
      helpType: "MEAL",
      targetName: "서연",
      startDateTime: "2026-11-17T18:00:00",
      endDateTime: "2026-11-17T19:00:00",
      status: "REQUESTED",
    },
    {
      id: 102,
      helpType: "HOSPITAL",
      targetName: "민재",
      startDateTime: "2026-11-19T14:00:00",
      endDateTime: "2026-11-19T18:00:00",
      status: "WAITING",
    },
    {
      id: 103,
      helpType: "SHOPPING",
      targetName: "민재",
      startDateTime: "2026-11-21T11:00:00",
      endDateTime: "2026-11-21T12:00:00",
      status: "UNASSIGNED",
    },
    {
      id: 104,
      helpType: "PET_CARE",
      targetName: "하은",
      startDateTime: "2026-11-22T09:00:00",
      endDateTime: "2026-11-23T12:00:00",
      status: "ACCEPTED",
    },
    {
      id: 105,
      helpType: "CONTACT",
      targetName: "하은",
      startDateTime: "2026-11-10T20:00:00",
      endDateTime: "2026-11-10T20:30:00",
      status: "COMPLETED",
    },
    {
      id: 106,
      helpType: "SHOPPING",
      targetName: "서연",
      startDateTime: "2026-11-09T16:00:00",
      endDateTime: "2026-11-09T17:00:00",
      status: "CANCELLED",
    },
  ],
};

// H-03-02 상황 상세 - 참여자 시점 (지우님의 상황에 내가 참여)
// - responseNeededRequests : 응답이 필요한 요청 (내가 대상, 응답 기한 있음)
// - requests               : 수락한 요청 (내가 담당)
export const JOINED_SITUATION_DETAIL_MOCK = {
  id: 21,
  title: "무릎 수술 회복",
  startDate: "2026-11-01",
  endDate: "2026-11-24",
  ownerName: "지우",
  participants: [
    { id: 1, name: "서연", isGuardian: true },
    { id: 2, name: "민재", isGuardian: false },
    { id: 3, name: "하은", isGuardian: false },
  ],
  responseNeededRequests: [
    {
      id: 201,
      helpType: "SHOPPING",
      startDateTime: "2026-11-21T11:00:00",
      responseDeadline: "2026-11-20T18:00:00",
      status: "WAITING",
      myRole: "TARGET",
    },
  ],
  requests: [
    {
      id: 202,
      helpType: "MEAL",
      startDateTime: "2026-11-15T18:00:00",
      endDateTime: "2026-11-15T19:00:00",
      status: "IN_PROGRESS",
      myRole: "ASSIGNEE",
    },
    {
      id: 203,
      helpType: "HOSPITAL",
      startDateTime: "2026-11-19T14:00:00",
      endDateTime: "2026-11-19T18:00:00",
      status: "ACCEPTED",
      myRole: "ASSIGNEE",
    },
    {
      id: 204,
      helpType: "CONTACT",
      startDateTime: "2026-11-10T20:00:00",
      endDateTime: "2026-11-10T20:30:00",
      status: "COMPLETED",
      myRole: "ASSIGNEE",
    },
  ],
};
