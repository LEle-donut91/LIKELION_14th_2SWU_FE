// 상황 TanStack Query key
// - 앞부분만으로 한 번에 무효화할 수 있도록 계층형 배열로 작성
//   예: 상황 생성·종료 후 SITUATION_QUERY_KEYS.all() 무효화 → 상황 관련 조회 전부 다시 요청

export const SITUATION_QUERY_KEYS = {
  all: () => ["situation"],

  // 1. 진행 중 상황 목록 (GET /api/situations) — S-00 상황 목록
  inProgressList: (params) => ["situation", "inProgressList", params],

  // 2. 지난 상황 목록 (GET /api/situations/history) — S-00 하단, H-04 지난 상황
  pastList: (params) => ["situation", "pastList", params],
};
