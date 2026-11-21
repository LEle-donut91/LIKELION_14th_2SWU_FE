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
