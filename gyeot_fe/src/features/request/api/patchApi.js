import patchRequestCancelMock from "@/features/request/mock/RequestEdit/patchRequestCancelMock";

// TODO: API 연동 로직 수정 필요
// 요청 취소
export const patchRequestCancelApi = (requestId) => {
  console.log("요청 취소:", requestId);
  return patchRequestCancelMock;
};

