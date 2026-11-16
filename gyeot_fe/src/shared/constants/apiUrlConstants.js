/**
 * @file API URL 상수 정의
 * @description API 요청 시 사용되는 URL 상수를 정의합니다.
 */
// A. 회원·인증·관계
export const AUTH_API_URLS = {
  // 여기에 회원·인증·관계 관련 API URL 상수를 정의합니다.
}

// B. 상황
export const SITUATION_API_URLS = {
  // 여기에 상황 관련 API URL 상수를 정의합니다.
}

// C. 도움 요청
export const REQUEST_API_URLS = {
  create: "/api/care-requests", // 도움 요청 생성
  targetCandidates: "/api/care-requests/target-candidates", // 대상 후보 조회
};

// D. 안심카드·정보 공유
export const INFO_SHARE_API_URLS = {
  sharingOptions: "/api/safety-information/sharing-options", // 공개 항목 선택지 조회
}
