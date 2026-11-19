// 나의 사람 및 보호자 TanStack Query key
// - 앞부분만으로 한 번에 무효화할 수 있도록 계층형 배열로 작성

export const RELATION_QUERY_KEYS = {
  // 1. 활성 관계 목록 (GET /api/relationships) — R-00 관계, R-02 지인 상세
  // - 관계 해제·초대 수락 후 무효화 → 목록 다시 조회
  relationships: () => ["relationships"],
};