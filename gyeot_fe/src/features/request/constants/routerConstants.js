/**
 * =====================================================================
 * [request/ 공통] 요청 도메인 라우트
 * - App.jsx의 <Route path> 와 반드시 일치시킬 것
 * - id: 요청 ID
 * 
 * =====================================================================
 */

export const REQUEST_ROUTES = {
  infoPreview: (id) => `/request/info-preview/${id}`,
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
