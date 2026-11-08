import getTargetMock from "@/features/request/mock/RequestTarget/getTargetMock";
import patchTargetHoldMock from "@/features/request/mock/RequestTarget/patchTargetHoldMock";
import patchTargetRefuseMock from "@/features/request/mock/RequestTarget/patchTargetRefuseMock";
import patchTargetAcceptMock from "@/features/request/mock/RequestTarget/patchTargetAcceptMock";
import patchTargetChangeRefuseMock from "@/features/request/mock/RequestTarget/patchTargetChangeRefuseMock";
import patchTargetChangeAcceptMock from "@/features/request/mock/RequestTarget/patchTargetChangeAcceptMock";

/**
 * =====================================================================
 * [H-03-01-B] 요청 상세 · 대상자 뷰
 * - 데이터 조회 & 보류 / 거절 / 수락 & 거절·수락으로 변경
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// 요청 상세(대상자 뷰) - 데이터 조회
export const getTargetApi = (requestId) => {
  console.log("대상자 데이터 조회:", requestId);
  return getTargetMock;
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
