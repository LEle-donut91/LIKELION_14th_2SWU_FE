// 상황 관련 공통 상수 (홈 H-00, 상황 S-00에서 함께 사용)

// 상황 카드 하단 태그
// isActive: 강조 태그(테두리/배경 olive-300) 여부
export const SITUATION_TAG = {
  ACCEPTED: { label: "수락", isActive: false },
  WAITING: { label: "응답대기", isActive: false },
  UNASSIGNED: { label: "담당없음", isActive: true },
  REQUESTED: { label: "응답요청", isActive: true },
};
