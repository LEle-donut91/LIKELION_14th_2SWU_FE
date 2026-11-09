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
