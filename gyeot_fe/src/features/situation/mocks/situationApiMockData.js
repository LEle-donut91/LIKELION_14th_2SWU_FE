// 상황 API 목업 응답 (API 명세서 F-04 · F-22 응답 형태 그대로)
// - USE_MOCK일 때 api 파일에서만 사용
// - 화면용 목업(situationMockData.js)과 달리 서버 필드명을 그대로 사용

// 진행 중 상황 목록 조회 (GET /api/situations) → data.items
export const IN_PROGRESS_SITUATION_ITEMS_MOCK = [
  {
    situationId: 1,
    name: "출장 부재",
    situationType: "ABSENCE",
    startAt: "2026-11-10T09:00:00",
    endAt: "2026-12-10T18:00:00",
    status: "ACTIVE",
    participantCount: 4,
    isOwner: true,
    role: "OWNER",
    requestCounts: { acceptedCount: 1, waitingCount: 1, noAssigneeCount: 0 },
    nextSchedule: {
      startsAt: "2026-11-25T15:00:00",
      helpType: "GROCERY",
      assigneeName: "하음",
    },
    remainingScheduleCount: 1,
  },
  {
    situationId: 21,
    name: "무릎 수술 회복",
    situationType: "RECOVERY",
    startAt: "2026-11-01T09:00:00",
    endAt: "2026-11-30T18:00:00",
    status: "ACTIVE",
    participantCount: 3,
    isOwner: false,
    role: "PARTICIPANT",
    requestCounts: { acceptedCount: 1, waitingCount: 0, noAssigneeCount: 0 },
    nextSchedule: null,
    remainingScheduleCount: 0,
  },
];

// 지난 상황 목록 조회 (GET /api/situations/history) → data.items
// - requestCount(요청 수)는 명세에 아직 없는 값 (BE 확인 필요)
export const PAST_SITUATION_ITEMS_MOCK = [
  {
    situationId: 11,
    name: "감기 회복",
    situationType: "RECOVERY",
    startAt: "2026-08-10T09:00:00",
    endAt: "2026-08-17T18:00:00",
    endedAt: "2026-08-17T18:00:00",
    isOwner: false,
    ownerName: "하은",
    participantCount: 2,
  },
  {
    situationId: 12,
    name: "출장 부재",
    situationType: "ABSENCE",
    startAt: "2026-07-01T09:00:00",
    endAt: "2026-07-08T18:00:00",
    endedAt: "2026-07-08T18:00:00",
    isOwner: true,
    ownerName: "나",
    participantCount: 0,
  },
  {
    situationId: 13,
    name: "무릎 수술 회복",
    situationType: "RECOVERY",
    startAt: "2026-06-01T09:00:00",
    endAt: "2026-06-20T18:00:00",
    endedAt: "2026-06-18T10:30:00",
    isOwner: true,
    ownerName: "나",
    participantCount: 3,
  },
  {
    situationId: 14,
    name: "병원 검사",
    situationType: "HOSPITAL_VISIT",
    startAt: "2026-05-03T09:00:00",
    endAt: "2026-05-04T18:00:00",
    endedAt: "2026-05-04T18:00:00",
    isOwner: false,
    ownerName: "서연",
    participantCount: 1,
  },
];
