import { axiosInstance } from "@/shared/api/axiosInstance";
import {
  CARD_SHARING_MOCK,
  DEFAULT_SHARING_MOCK_SCENARIO,
  findSharingMockItem,
} from "@/features/card/mocks/cardMockData";
import { SHARING_STATUS } from "@/features/card/constants/cardConstants";

// 백엔드 API 연동 전까지 테스트 데이터를 사용한다. (contactApi.js와 같은 방식)
// TODO: 연동 시 USE_MOCK을 false로 변경
const USE_MOCK = true;

// 목업 응답 지연 시간(ms): 처리 중 버튼 잠금을 확인할 수 있도록 약간 늦게 응답
const MOCK_DELAY = 500;

// 공유 관리 API 경로 (API 명세서 F-30 기준)
const SHARING_API_PATH = {
  LIST: "/api/sharings", // 공유 중 목록 조회
  REVOKE: (assignmentId) => `/api/sharings/${assignmentId}/revoke`, // 공유 직접 철회
  REALLOW: (assignmentId) => `/api/sharings/${assignmentId}/reallow`, // 공유 다시 허용
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 목업 실패 응답: axios 에러와 같은 형태 (error.response.data.message)
const createMockError = (status, code, message) => {
  const error = new Error(code);
  error.response = { status, data: { status: "error", code, message, data: null } };
  return error;
};

// 공유 중 목록 조회 → { items: [...] }
// - userId: 받는 사람 ID (R-02-01에서 한 사람 기준으로 조회할 때만 사용)
// - mockScenario: 테스트 데이터 시나리오 키 (USE_MOCK일 때만 사용)
export const getSharings = async ({ userId, mockScenario } = {}) => {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    const data =
      CARD_SHARING_MOCK[mockScenario] ??
      CARD_SHARING_MOCK[DEFAULT_SHARING_MOCK_SCENARIO];
    // 화면에서 바꾼 상태가 원본 목업에 남지 않도록 복사본 반환
    const items = structuredClone(data.items);
    return {
      items: userId
        ? items.filter((item) => item.receiver.userId === userId)
        : items,
    };
  }

  // 공통 응답 형태 { status, code, message, data } 중 data만 반환
  const response = await axiosInstance.get(SHARING_API_PATH.LIST, {
    params: userId ? { userId } : undefined,
  });
  return response.data.data;
};

// 공유 직접 철회
// - 성공 시 공통 응답 전체 { message, data: { assignmentId, status, canReallow } } 반환 (토스트에 message 사용)
// - shouldMockFail: true면 목업에서 404 SHARING_NOT_FOUND를 흉내 냄 (USE_MOCK일 때만 사용)
export const revokeSharing = async (assignmentId, { shouldMockFail = false } = {}) => {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    if (shouldMockFail) {
      throw createMockError(404, "SHARING_NOT_FOUND", "존재하지 않는 공유입니다.");
    }
    return {
      status: "success",
      code: null,
      message: "공유를 철회했습니다.",
      data: { assignmentId, status: SHARING_STATUS.REVOKED, canReallow: true },
    };
  }

  const response = await axiosInstance.post(SHARING_API_PATH.REVOKE(assignmentId));
  return response.data;
};

// 공유 다시 허용
// - 성공 시 공통 응답 전체 { message, data: { assignmentId, status, sharedItems } } 반환
// - shouldMockFail: true면 목업에서 409 SHARING_REALLOW_NOT_ALLOWED를 흉내 냄 (USE_MOCK일 때만 사용)
export const reallowSharing = async (assignmentId, { shouldMockFail = false } = {}) => {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    if (shouldMockFail) {
      throw createMockError(
        409,
        "SHARING_REALLOW_NOT_ALLOWED",
        "다시 허용할 수 없는 공유입니다.",
      );
    }
    return {
      status: "success",
      code: null,
      message: "다시 허용했습니다.",
      data: {
        assignmentId,
        status: SHARING_STATUS.SHARING,
        sharedItems: structuredClone(findSharingMockItem(assignmentId)?.sharedItems ?? []),
      },
    };
  }

  const response = await axiosInstance.post(SHARING_API_PATH.REALLOW(assignmentId));
  return response.data;
};
