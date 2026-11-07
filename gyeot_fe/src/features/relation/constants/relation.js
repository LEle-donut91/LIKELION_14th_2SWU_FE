// 서로의 보호자 최대 인원
export const MAX_GUARDIANS = 3;

// 보낸 초대 상태별 라벨
export const INVITE_STATUS = {
  PENDING: { label: "대기", type: "pending" },
  ACCEPTED: { label: "수락", type: "accepted" },
  REJECTED: { label: "거절", type: "rejected" },
  EXPIRED: { label: "만료", type: "expired" },
};

// API 연결 전 임시 데이터 (빈 화면 확인 시 배열을 []로 변경)
export const MOCK_RELATION = {
  guardians: [
    { id: 1, name: "서연", priority: 1 },
    { id: 2, name: "지우", priority: 2 },
    { id: 3, name: "영철", priority: 3 },
  ],
  myPeople: [
    { id: 11, name: "민재", relation: "친구" },
    { id: 12, name: "하은", relation: "이웃" },
  ],
  registeredMe: [
    { id: 21, name: "도윤" },
    { id: 22, name: "지호" },
  ],
  sentInvites: [
    { id: 31, name: "수아", status: "PENDING", remainDays: 7 },
    { id: 32, name: "현우", status: "ACCEPTED" },
    { id: 33, name: "다온", status: "REJECTED" },
    { id: 34, name: "유진", status: "EXPIRED" },
  ],
};

// 관계 형태 빠른 선택 칩 (R-01)
export const RELATION_TYPE_CHIPS = ["친구", "연인", "이웃"];

// 초대 메시지 기본 멘트 (R-01)
export const DEFAULT_INVITE_MESSAGE = "함께 해요";

// 초대 링크 유효 기간(일) (R-01)
export const INVITE_VALID_DAYS = 7;