/**
 * @file API URL 상수 정의
 * @description API 요청 시 사용되는 URL 상수를 정의합니다.
 */
// A. 회원·인증·관계
export const AUTH_API_URLS = {
  // 여기에 회원·인증·관계 관련 API URL 상수를 정의합니다.
  signup: "/api/auth/signup", // 회원가입 (POST)
  login: "/api/auth/login", // 로그인 (POST)
  refresh: "/api/auth/refresh", // Access Token 재발급 (POST)
  logout: "/api/auth/logout", // 로그아웃 (POST)
  csrf: "/api/auth/csrf", // CSRF 토큰 조회 (GET)
  relationships: "/api/relationships", // 활성 관계 조회 (GET)
  relationship: (relationshipId) => `/api/relationships/${relationshipId}`, // 관계 해제 (DELETE)\
    invitations: "/api/invitations", // 초대 링크 생성 (POST) — 나의 사람·보호자 공통
  invitation: (token) => `/api/invitations/${token}`, // 초대 링크 정보 조회 (GET)
  invitationAccept: (token) => `/api/invitations/${token}/accept`, // 초대 수락 (POST)
  invitationReject: (token) => `/api/invitations/${token}/reject`, // 초대 거절 (POST)
  invitationReciprocal: (token) => `/api/invitations/${token}/reciprocal`, // 반대 방향 나의 사람 추가 (POST)
  invitationEligibility: (token) => `/api/invitations/${token}/eligibility`, // 보호자 요청 수락 가능 여부 (POST)
  invitationCancel: (invitationId) => `/api/invitations/${invitationId}`, // 발신 초대 취소 (DELETE)
  emergencyContacts: "/api/emergency-contacts", // 비상연락망 조회 (GET)
  emergencyContactsOrder: "/api/emergency-contacts/order", // 연락 순서 변경 (PATCH)
}

// B. 상황
export const SITUATION_API_URLS = {
  // 여기에 상황 관련 API URL 상수를 정의합니다.
  inProgressList: "/api/situations", // 진행 중 상황 목록 조회 (GET)
  home: "/api/home", // 홈 통합 조회 (GET)
  create: "/api/situations", // 상황 생성 (POST)
  detail: (situationId) => `/api/situations/${situationId}`, // 상황 상세 조회 (GET)
  end: (situationId) => `/api/situations/${situationId}/end`, // 상황 직접 종료 (POST)
  leave: (situationId) => `/api/situations/${situationId}/leave`, // 상황 나가기 (POST)
  participants: (situationId) => `/api/situations/${situationId}/participants`, // 참여자 목록 조회 (GET) / 참여자 추가 (POST)
  participant: (situationId, participantId) =>
    `/api/situations/${situationId}/participants/${participantId}`, // 참여자 제외 (DELETE)
  pastList: "/api/situations/history", // 지난 상황 목록 조회 (GET)
  pastDetail: (situationId) => `/api/situations/${situationId}/history`, // 지난 상황 상세 조회 (GET)
}

// C. 도움 요청
export const REQUEST_API_URLS = {
  create: "/api/care-requests", // 도움 요청 생성
  assignments: (requestId) => `/api/care-requests/${requestId}/assignments`, // 다시 부탁하기
  targetCandidates: "/api/care-requests/target-candidates", // 대상 후보 조회
  detail: (requestId) => `/api/care-requests/${requestId}`, // 도움 요청 상세 조회
  withdraw: (requestId) => `/api/care-requests/${requestId}/withdraw`, // 수락 철회
  editWithdraw: (requestId, proposalId) => `/api/care-requests/${requestId}/change-proposals/${proposalId}/withdraw`, // 수정안 철회
  reconfirmAccept: (requestId, proposalId) => `/api/care-requests/${requestId}/change-proposals/${proposalId}/accept`, // 재확인 수락
  reconfirmReject: (requestId, proposalId) => `/api/care-requests/${requestId}/change-proposals/${proposalId}/reject`, // 재확인 거절
  cancel: (requestId) => `/api/care-requests/${requestId}/cancel`, // 요청 취소
  respond: (requestId) => `/api/care-requests/${requestId}/respond`, // 요청 응답
  start: (requestId) => `/api/care-requests/${requestId}/start`, // 돌봄 시작
  complete: (requestId) => `/api/care-requests/${requestId}/complete`, // 돌봄 완료
  noAssigneeNotices: "/api/care-requests/no-assignee-notices", // 담당자 없음 안내 목록 (GET)
  noAssigneeNoticeDismiss: (requestId) =>
    `/api/care-requests/${requestId}/no-assignee-notice/dismiss`, // 담당자 없음 안내 닫기 (POST)
};

// D. 안심카드·정보 공유
export const INFO_SHARE_API_URLS = {
  sharingOptions: "/api/safety-information/sharing-options", // 공개 항목 선택지 조회
  sharedInformation: (requestId) => `/api/care-requests/${requestId}/shared-information`, // 전달받은 정보 조회
  summary: "/api/safety-information/summary", // 안심카드 메인 조회 (GET)
  items: "/api/safety-information", // 분류별 항목 조회 (GET ?category) / 항목 작성 (POST)
  item: (informationId) => `/api/safety-information/${informationId}`, // 항목 수정 (PATCH) / 항목 삭제 (DELETE)
  sharings: "/api/sharings", // 공유 중 목록 조회 (GET ?userId)
  revoke: (assignmentId) => `/api/sharings/${assignmentId}/revoke`, // 공유 직접 철회 (POST)
  reallow: (assignmentId) => `/api/sharings/${assignmentId}/reallow`, // 공유 다시 허용 (POST)
    receivedSharings: "/api/sharings/received", // 받은 정보 조회 (GET ?userId) — R-02-01
}