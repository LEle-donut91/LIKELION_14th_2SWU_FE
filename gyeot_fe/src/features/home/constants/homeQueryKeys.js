// 홈 TanStack Query key
// - 앞부분만으로 한 번에 무효화할 수 있도록 계층형 배열로 작성
//   예: 공유 철회·다시 허용 후 HOME_QUERY_KEYS.home() 무효화 → 홈 상단 '공유중' 건수 갱신

export const HOME_QUERY_KEYS = {
  // 1. 홈 통합 조회 (GET)
  home: () => ["home"],

  // 2. 담당자 없음 안내 목록 (GET, M-01)
  // - ["home"] 아래에 두지 않음: 공유 철회 등으로 홈 key를 무효화할 때 안내 목록까지 다시 조회되지 않도록 분리
  noAssigneeNotices: () => ["noAssigneeNotices"],
};
