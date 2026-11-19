// 안심카드 API 목업 공통 함수 (각 api 파일의 USE_MOCK 분기에서만 사용)

// 목업 응답 지연 시간(ms): 로딩·처리 중 버튼 잠금을 확인할 수 있도록 약간 늦게 응답
export const MOCK_DELAY = 500;

export const wait = (ms = MOCK_DELAY) => new Promise((resolve) => setTimeout(resolve, ms));

// 목업 성공 응답: 공통 응답 형태 { status, code, message, data }
export const createMockResponse = (data, message = null) => ({
  status: "success",
  code: null,
  message,
  data,
});

// 목업 실패 응답: axios 에러와 같은 형태 (error.response.status, error.response.data)
// - { status, code, message }: HTTP 상태코드, 에러 코드, 에러 문구
export const createMockError = ({ status, code, message }) => {
  const error = new Error(code);
  error.response = { status, data: { status: "error", code, message, data: null } };
  return error;
};
