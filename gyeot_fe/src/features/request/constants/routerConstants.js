/**
 * =====================================================================
 * [request/ 공통] 요청 도메인 라우트
 * - App.jsx의 <Route path> 와 반드시 일치시킬 것
 * - id: 상황 ID or 임시 ID or 요청 ID
 * - TODO: Request.jsx의 mock/api/services/페이지 컴포넌트 수정 필요 (InfoPreview 경로 관련)
 *
 * =====================================================================
 */

export const REQUEST_ROUTES = {
  // 홈 (TODO: 추후 shared/로 이동)
  home: () => `/home`,

  // 상황 ID
  request: (id) => `/request/${id}`,

  // 임시 ID
  infoPreview: (id) => `/request/info-preview/${id}`,

  // 요청 ID
  send: (id) => `/request/send/${id}`,
  assignee: (id) => `/request/assignee/${id}`,
  requester: (id) => `/request/requester/${id}`,
  target: (id) => `/request/target/${id}`,
  receivedInfo: (id) => `/request/received-info/${id}`,
  editForm: (id) => `/request/edit-form/${id}`,
  editCheck: (id) => `/request/edit-check/${id}`,
  assigneeReconfirm: (id) => `/request/assignee-reconfirm/${id}`,
  askAgain: (id) => `/request/ask-again/${id}`,
};
