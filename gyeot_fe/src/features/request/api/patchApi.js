import patchRequestCancelMock from "@/features/request/mock/RequestEdit/patchRequestCancelMock";
import patchEditWithdrawMock from "@/features/request/mock/RequestDetail/patchEditWithdrawMock";
import patchRequestDoneMock from "@/features/request/mock/RequestDetail/patchRequestDoneMock";
import patchTargetHoldMock from "@/features/request/mock/RequestDetail/patchTargetHoldMock";
import patchTargetRefuseMock from "@/features/request/mock/RequestDetail/patchTargetRefuseMock";
import patchTargetAcceptMock from "@/features/request/mock/RequestDetail/patchTargetAcceptMock";
import patchTargetChangeRefuseMock from "@/features/request/mock/RequestDetail/patchTargetChangeRefuseMock";
import patchTargetChangeAcceptMock from "@/features/request/mock/RequestDetail/patchTargetChangeAcceptMock";


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

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(요청자 뷰) - 요청 완료
export const patchRequestDoneApi = (requestId) => {
  console.log("완료 요청:", requestId);
  return patchRequestDoneMock;
};

// TODO: API 연동 로직 수정 필요
// 요청 상세(대상자 뷰) - 보류
export const patchTargetHoldApi = (requestId) => {
  console.log("보류:", requestId);
  return patchTargetHoldMock;
};

// TODO: API 연동 로직 수정 필요
// 요청 상세(대상자 뷰) - 거절
export const patchTargetRefuseApi = (requestId) => {
  console.log("거절:", requestId);
  return patchTargetRefuseMock;
};

// TODO: API 연동 로직 수정 필요
// 요청 상세(대상자 뷰) - 수락
export const patchTargetAcceptApi = (requestId) => {
  console.log("수락:", requestId);
  return patchTargetAcceptMock;
};

// TODO: API 연동 로직 수정 필요
// 요청 상세(대상자 뷰) - 거절로 변경 (보류 -> 거절)
export const patchTargetChangeRefuseApi = (requestId) => {
  console.log("거절로 변경:", requestId);
  return patchTargetChangeRefuseMock;
};

// TODO: API 연동 로직 수정 필요
// 요청 상세(대상자 뷰) - 수락으로 변경 (보류/거절 -> 수락)
export const patchTargetChangeAcceptApi = (requestId) => {
  console.log("수락으로 변경:", requestId);
  return patchTargetChangeAcceptMock;
};
