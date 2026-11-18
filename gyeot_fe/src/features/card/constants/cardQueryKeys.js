// 안심카드 TanStack Query key
// - 앞부분만으로 한 번에 무효화할 수 있도록 계층형 배열로 작성
//   예: 항목 작성·수정·삭제 후 CARD_QUERY_KEYS.safetyInfo 무효화 → 메인 조회 + 분류별 조회 모두 갱신
//       공유 철회·다시 허용 후 ["sharings"] 무효화 → 전체 갱신
// - 비상연락망(contacts) key는 해당 API 연동 단계에서 추가

export const CARD_QUERY_KEYS = {
  // 안심카드 전체 (무효화용)
  safetyInfo: ["safetyInfo"],

  // 1. 안심카드 메인 조회 (GET)
  summary: () => ["safetyInfo", "summary"],

  // 2. 분류별 항목 조회 (GET) - category: BASIC / HEALTH / LIFE / ADVANCE_MESSAGE
  items: (category) => ["safetyInfo", "items", category],

  // 3. 공유 중 목록 조회 (GET) - userId: 받는 사람 ID (R-02-01에서만, 전체 목록은 null)
  sharings: (userId = null) => ["sharings", { userId }],
};