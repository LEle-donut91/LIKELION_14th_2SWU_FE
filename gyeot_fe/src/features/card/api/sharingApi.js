import { axiosInstance } from "@/shared/api/axiosInstance";
import { INFO_SHARE_API_URLS } from "@/shared/constants/apiUrlConstants";
import { SHARING_STATUS } from "@/features/card/constants/cardConstants";
import {
  createMockError,
  createMockResponse,
  wait,
} from "@/features/card/mocks/mockUtils";
import { getSharingMockStore } from "@/features/card/mocks/sharingMockStore";

// 공유 관리 API (API 명세서 F-30: 공유 중 목록 조회, 공유 직접 철회, 공유 다시 허용)
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery / useMutation 쪽에서)

// 서버 연결·인증 처리 전까지 명세 응답 형태의 테스트 데이터를 사용한다.
// TODO: 서버에 API가 올라간 것을 확인한 뒤 USE_MOCK을 false로 변경
const USE_MOCK = true;

/**
 * =====================================================================
 * 목업 (USE_MOCK일 때만 사용)
 * - 데이터: cardMockData.js의 CARD_SHARING_MOCK (시나리오: ?mock=empty, ?mock=revokedOnly)
 * - 철회·다시 허용 결과를 sharingMockStore에 반영해, 다시 조회하면 바뀐 상태가 보이도록 함
 *   (C-00 메인 조회의 공유 중 건수도 같은 저장소 기준)
 * - 실패 테스트: shouldMockFail이 true면 철회 404 / 다시 허용 409 (?mockFail=true)
 * =====================================================================
 */

// 실패 응답 (명세 기준)
const SHARING_MOCK_ERROR = {
  SHARING_NOT_FOUND: { status: 404, code: "SHARING_NOT_FOUND", message: "존재하지 않는 공유입니다." },
  SHARING_REALLOW_NOT_ALLOWED: {
    status: 409,
    code: "SHARING_REALLOW_NOT_ALLOWED",
    message: "다시 허용할 수 없는 공유입니다.",
  },
};

// 성공 응답 message (명세 기준)
const SHARING_MOCK_MESSAGE = {
  REVOKE: "공유를 철회했습니다.",
  REALLOW: "다시 허용했습니다.",
};

const findMockItem = (mockScenario, assignmentId) =>
  getSharingMockStore(mockScenario).find((item) => item.assignmentId === assignmentId);

/**
 * =====================================================================
 * API 함수
 * =====================================================================
 */

// 1. 공유 중 목록 조회 (GET /api/sharings?userId={userId})
// - userId: 받는 사람 ID (R-02-01처럼 한 사람 기준으로 볼 때만 전달)
// - mockScenario: 테스트 데이터 시나리오 키 (USE_MOCK일 때만 사용)
// → data: { items: [{ assignmentId, requestId, receiver, helpType, startsAt, accessUntil, status, canReallow, sharedItems }] }
export const getSharingsApi = async ({ userId, mockScenario } = {}) => {
  if (USE_MOCK) {
    await wait();
    const items = getSharingMockStore(mockScenario).filter(
      (item) => !userId || item.receiver.userId === userId,
    );
    // 화면에서 응답을 바꿔도 저장소에 남지 않도록 복사본 반환
    return createMockResponse({ items: structuredClone(items) });
  }

  const response = await axiosInstance.get(INFO_SHARE_API_URLS.sharings, {
    params: { userId },
  });
  return response.data;
};

// 2. 공유 직접 철회 (POST /api/sharings/{assignmentId}/revoke)
// - shouldMockFail: true면 목업에서 404 SHARING_NOT_FOUND를 흉내 냄 (USE_MOCK일 때만 사용)
// → data: { assignmentId, status: "REVOKED", canReallow }
export const postSharingRevokeApi = async ({
  assignmentId,
  mockScenario,
  shouldMockFail = false,
}) => {
  if (USE_MOCK) {
    await wait();
    const item = findMockItem(mockScenario, assignmentId);
    if (shouldMockFail || !item) {
      throw createMockError(SHARING_MOCK_ERROR.SHARING_NOT_FOUND);
    }

    // 이미 철회된 카드는 바꾸지 않고 성공 (명세 기준)
    if (item.status !== SHARING_STATUS.REVOKED) {
      item.status = SHARING_STATUS.REVOKED;
      item.canReallow = true;
    }
    return createMockResponse(
      { assignmentId, status: item.status, canReallow: item.canReallow },
      SHARING_MOCK_MESSAGE.REVOKE,
    );
  }

  const response = await axiosInstance.post(INFO_SHARE_API_URLS.revoke(assignmentId));
  return response.data;
};

// 3. 공유 다시 허용 (POST /api/sharings/{assignmentId}/reallow)
// - shouldMockFail: true면 목업에서 409 SHARING_REALLOW_NOT_ALLOWED를 흉내 냄 (USE_MOCK일 때만 사용)
// → data: { assignmentId, status: "SHARING", sharedItems }
export const postSharingReallowApi = async ({
  assignmentId,
  mockScenario,
  shouldMockFail = false,
}) => {
  if (USE_MOCK) {
    await wait();
    if (shouldMockFail) {
      throw createMockError(SHARING_MOCK_ERROR.SHARING_REALLOW_NOT_ALLOWED);
    }

    const item = findMockItem(mockScenario, assignmentId);
    if (!item) {
      throw createMockError(SHARING_MOCK_ERROR.SHARING_NOT_FOUND);
    }
    // 직접 철회한 카드가 아니거나 다시 허용할 수 없는 카드 (명세 기준)
    if (item.status !== SHARING_STATUS.REVOKED || !item.canReallow) {
      throw createMockError(SHARING_MOCK_ERROR.SHARING_REALLOW_NOT_ALLOWED);
    }

    item.status = SHARING_STATUS.SHARING;
    item.canReallow = false;
    return createMockResponse(
      { assignmentId, status: item.status, sharedItems: structuredClone(item.sharedItems) },
      SHARING_MOCK_MESSAGE.REALLOW,
    );
  }

  const response = await axiosInstance.post(INFO_SHARE_API_URLS.reallow(assignmentId));
  return response.data;
};