import patchRequestCancelMock from "@/features/request/mock/RequestEdit/patchRequestCancelMock";
import patchEditWithdrawMock from "@/features/request/mock/RequestDetail/patchEditWithdrawMock";


// TODO: API 연동 로직 수정 필요
// 요청 취소
export const patchRequestCancelApi = (requestId) => {
  console.log("요청 취소:", requestId);
  return patchRequestCancelMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(요청자 뷰) - 수정 철회
export const patchEditWithdrawApi = (requestId) => {
  console.log("수정 철회:", requestId);
  return patchEditWithdrawMock;
};
