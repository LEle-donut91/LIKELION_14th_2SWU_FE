// 공유 관리 API 응답 → 화면용 데이터 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }

// 1. 공유 중 목록 조회 → 공유 카드 목록
// → [{ assignmentId, requestId, receiver, helpType, startsAt, accessUntil, status, canReallow, sharedItems }]
//   - 서버가 자동 회수 시각(accessUntil) 빠른 순으로 내려주므로 순서는 그대로 사용
//   - 빈 배열이면 빈 상태 화면 (에러 아님)
export const getSharingsService = (raw) => raw?.data?.items ?? [];
