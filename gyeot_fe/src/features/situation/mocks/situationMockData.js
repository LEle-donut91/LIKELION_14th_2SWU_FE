


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

// N-04 지난 상황 상세 - 요청자(정보 주인) 시점
// - requests: 요청 기록 (assigneeName이 null이면 탈퇴한 사용자)
// - canWriteThanks: 감사 메시지를 쓸 수 있는 요청이 있는지
export const PAST_SITUATION_DETAIL_MOCK = {
  id: 13,
  title: "무릎 수술 회복",
  startDate: "2026-09-01",
  endDate: "2026-09-20",
  isOwner: true,
  ownerName: "나",
  participantCount: 0,
  canWriteThanks: true,
  requests: [
    {
      id: 401,
      helpType: "HOSPITAL",
      assigneeName: "민재",
      startDateTime: "2026-09-03T11:00:00",
      endDateTime: "2026-09-03T20:00:00",
      status: "COMPLETED",
    },
    {
      id: 402,
      helpType: "MEAL",
      assigneeName: "하은",
      startDateTime: "2026-09-05T12:00:00",
      endDateTime: "2026-09-05T13:00:00",
      status: "COMPLETED",
    },
    {
      id: 403,
      helpType: "GROCERY",
      assigneeName: null,
      startDateTime: "2026-09-05T10:00:00",
      endDateTime: "2026-09-05T12:00:00",
      status: "CANCELLED",
    },
  ],
};

// N-04 지난 상황 상세 - 담당자(참여자) 시점: 내가 담당했던 요청만
// - thanksFromName: 받은 감사 메시지를 보낸 사람 (없으면 null)
export const JOINED_PAST_SITUATION_DETAIL_MOCK = {
  id: 14,
  title: "무릎 수술 회복",
  startDate: "2026-09-01",
  endDate: "2026-09-20",
  isOwner: false,
  ownerName: "지우",
  participantCount: 2,
  thanksFromName: "지우",
  requests: [
    {
      id: 501,
      helpType: "HOSPITAL",
      startDateTime: "2026-09-01T11:00:00",
      endDateTime: "2026-09-01T20:00:00",
      status: "COMPLETED",
    },
    {
      id: 502,
      helpType: "GROCERY",
      startDateTime: "2026-09-03T10:00:00",
      endDateTime: "2026-09-03T12:00:00",
      status: "CANCELLED",
    },
  ],
};
