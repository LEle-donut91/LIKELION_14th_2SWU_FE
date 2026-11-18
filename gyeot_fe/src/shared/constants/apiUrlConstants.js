/**
 * @file API URL 상수 정의
 * @description API 요청 시 사용되는 URL 상수를 정의합니다.
 */
// A. 회원·인증·관계
export const AUTH_API_URLS = {
  // 여기에 회원·인증·관계 관련 API URL 상수를 정의합니다.
  emergencyContacts: "/api/emergency-contacts", // 비상연락망 조회 (GET)
  emergencyContactsOrder: "/api/emergency-contacts/order", // 연락 순서 변경 (PATCH)
}

// B. 상황
export const SITUATION_API_URLS = {
  // 여기에 상황 관련 API URL 상수를 정의합니다.
  home: "/api/home", // 홈 통합 조회 (GET)
}

// C. 도움 요청
export const REQUEST_API_URLS = {
  targetCandidates: "/api/care-requests/target-candidates", // 대상 후보 조회
};

// D. 안심카드·정보 공유
export const INFO_SHARE_API_URLS = {
  sharingOptions: "/api/safety-information/sharing-options", // 공개 항목 선택지 조회
  summary: "/api/safety-information/summary", // 안심카드 메인 조회 (GET)
  items: "/api/safety-information", // 분류별 항목 조회 (GET ?category) / 항목 작성 (POST)
  item: (informationId) => `/api/safety-information/${informationId}`, // 항목 수정 (PATCH) / 항목 삭제 (DELETE)
  sharings: "/api/sharings", // 공유 중 목록 조회 (GET ?userId)
  revoke: (assignmentId) => `/api/sharings/${assignmentId}/revoke`, // 공유 직접 철회 (POST)
  reallow: (assignmentId) => `/api/sharings/${assignmentId}/reallow`, // 공유 다시 허용 (POST)
}