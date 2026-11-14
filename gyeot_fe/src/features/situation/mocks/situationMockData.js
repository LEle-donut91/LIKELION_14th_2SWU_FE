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

// 지난 상황 목록
export const PAST_SITUATION_LIST_MOCK = [
  {
    id: 11,
    title: "감기 회복",
    startDate: "2026-08-10",
    endDate: "2026-08-17",
    requestCount: 2,
  },
  {
    id: 12,
    title: "출장 부재",
    startDate: "2026-07-01",
    endDate: "2026-07-08",
    requestCount: 1,
  },
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
      helpType: "HOSPITAL",
      targetName: "민재",
      startDateTime: "2026-11-14T10:00:00",
      endDateTime: "2026-11-14T13:00:00",
      status: "REQUESTED",
    },
    {
      id: 102,
      helpType: "SHOPPING",
      targetName: "민재",
      startDateTime: "2026-11-16T15:00:00",
      endDateTime: "2026-11-16T17:00:00",
      status: "UNASSIGNED",
    },
    {
      id: 103,
      helpType: "MEAL",
      targetName: "하은",
      startDateTime: "2026-11-18T12:00:00",
      endDateTime: "2026-11-18T13:00:00",
      status: "ACCEPTED",
    },
  ],
};
