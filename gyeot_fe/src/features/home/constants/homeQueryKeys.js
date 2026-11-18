// 홈 TanStack Query key
//   예: 공유 철회·다시 허용 후 HOME_QUERY_KEYS.home() 무효화 → 홈 상단 '공유중' 건수 갱신

export const HOME_QUERY_KEYS = {
  // 1. 홈 통합 조회 (GET)
  home: () => ["home"],
};