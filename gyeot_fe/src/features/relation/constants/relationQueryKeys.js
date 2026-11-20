// 나의 사람 및 보호자 TanStack Query key
// - 앞부분만으로 한 번에 무효화할 수 있도록 계층형 배열로 작성

export const RELATION_QUERY_KEYS = {
  // 1. 활성 관계 목록 (GET /api/relationships) — R-00 관계, R-02 지인 상세
  // - 관계 해제·초대 수락 후 무효화 → 목록 다시 조회
  relationships: () => ["relationships"],

  // 2. 초대 링크 정보 (GET /api/invitations/{token}) — R-03 받은 초대, A-01 초대 진입, 초대 링크 진입
  // - 수락·거절 후 무효화 → 바뀐 상태(수락됨·거절됨) 다시 조회
  invitation: (token) => ["invitation", token],

  // 3. 이 사람에게 받은 정보 (GET /api/sharings/received?userId) — R-02-01 받은 정보
  receivedSharings: (userId) => ["receivedSharings", userId],
};