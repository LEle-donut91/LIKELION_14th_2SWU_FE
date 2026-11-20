// 상황 API 목업 공통 함수 (각 api 파일의 USE_MOCK 분기에서만 사용)

// 목업 응답 지연 시간(ms): 로딩 상태를 확인할 수 있도록 약간 늦게 응답
export const MOCK_DELAY = 500;

export const wait = (ms = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 목업 성공 응답: 공통 응답 형태 { status, code, message, data }
export const createMockResponse = (data, message = null) => ({
  status: "success",
  code: null,
  message,
  data,
});

// 목업 목록을 page·size로 잘라 { items, page, size, hasNext } 형태로 반환
export const paginateMockItems = (items, { page = 0, size = 20 } = {}) => {
  const start = page * size;
  return {
    items: items.slice(start, start + size),
    page,
    size,
    hasNext: start + size < items.length,
  };
};
