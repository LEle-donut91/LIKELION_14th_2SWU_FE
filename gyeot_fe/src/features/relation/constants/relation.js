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

// 받은 초대 상태별 결과 화면 문구 (R-03)
export const RECEIVED_INVITE_RESULT = {
  CANCELED: {
    badge: "취소됨",
    title: "취소된 초대예요",
    description: "보낸 분이 초대를 취소했어요.",
  },
  EXPIRED: {
    badge: "만료",
    title: "초대 링크가 만료됐어요",
    description: "초대 링크는 7일 동안만 쓸 수 있어요.\n보낸 분께 다시 초대해달라고 해 주세요.",
  },
  ACCEPTED: {
    badge: "수락",
    title: "이미 수락한 초대예요",
    description: "관계 탭에서만 확인할 수 있어요.",
  },
  REJECTED: {
    badge: "거절",
    title: "이미 거절한 초대예요",
    description: "다시 연결하려면 보낸 분께 새 초대를 받아 주세요.",
  },
};

// 받은 초대 임시 데이터 (R-03)
// status를 PENDING / CANCELED / EXPIRED / ACCEPTED / REJECTED 로 바꿔서 화면 확인
export const MOCK_RECEIVED_INVITE = {
  id: 1,
  inviterName: "서연",
  message: "함께 해요",
  relationLabel: "나의 사람",
  status: "PENDING",
};