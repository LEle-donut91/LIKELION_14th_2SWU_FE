// 상황 TanStack Query key
// - 앞부분만으로 한 번에 무효화할 수 있도록 계층형 배열로 작성
//   예: 상황 생성·종료 후 SITUATION_QUERY_KEYS.all() 무효화 → 상황 관련 조회 전부 다시 요청

export const SITUATION_QUERY_KEYS = {
  all: () => ["situation"],

  // 1. 진행 중 상황 목록 (GET /api/situations) — S-00 상황 목록
  inProgressList: (params) => ["situation", "inProgressList", params],

  // 2. 지난 상황 목록 (GET /api/situations/history) — S-00 하단, H-04 지난 상황
  pastList: (params) => ["situation", "pastList", params],

  // 3. 활성 관계 목록 (GET /api/relationships) — H-01 참여할 지인
  // - relation 영역과 같은 key를 써서 캐시를 함께 사용 (관계 해제·초대 수락 후 함께 갱신)
  relationships: () => ["relationships"],

  // 4. 상황 상세 (GET /api/situations/{situationId}) — H-03 상황 상세
  detail: (situationId, params) => ["situation", "detail", String(situationId), params],

  // 5. 참여자 목록 (GET /api/situations/{situationId}/participants) — H-03 상황 상세, H-03-05 상황 관리
  // 6. 지난 상황 상세 (GET /api/situations/{situationId}/history) — N-04 지난 상황 상세
  pastDetail: (situationId) => ["situation", "pastDetail", String(situationId)],

  participants: (situationId, params) => [
    "situation",
    "participants",
    String(situationId),
    params,
  ],
};
