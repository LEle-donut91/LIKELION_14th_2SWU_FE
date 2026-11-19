import { axiosInstance } from "@/shared/api/axiosInstance";
import { AUTH_API_URLS } from "@/shared/constants/apiUrlConstants";
import { CONTACT_RELATIONSHIP_TYPE } from "@/features/card/constants/cardConstants";
import {
  CARD_CONTACT_MOCK,
  DEFAULT_CONTACT_MOCK_SCENARIO,
} from "@/features/card/mocks/cardMockData";
import {
  createMockError,
  createMockResponse,
  wait,
} from "@/features/card/mocks/mockUtils";

// 비상연락망 API (API 명세서 F-27: 비상연락망 조회, 추가 비상연락 대상 순서 변경)
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery / useMutation 쪽에서)
// - 비상연락 대상 등록·삭제 API는 없음 (관계 생성·해제 흐름에서 반영, API_CONVENTIONS 9-3)

// 서버 연결·인증 처리 전까지 명세 응답 형태의 테스트 데이터를 사용한다.
// TODO: 서버에 API가 올라간 것을 확인한 뒤 USE_MOCK을 false로 변경
const USE_MOCK = true;

/**
 * =====================================================================
 * 목업 (USE_MOCK일 때만 사용)
 * - 데이터: cardMockData.js의 CARD_CONTACT_MOCK
 *   (시나리오: ?mock=noGuardian / guardianOnly / empty / withdrawn)
 * - 순서 변경 결과를 시나리오별 저장소에 반영해, 다시 조회하면 바뀐 순서가 보이도록 함 (새로고침하면 초기화)
 * - 실패 테스트(mockFail): "true"면 400 INVALID_INPUT, "changed"면 409 CONTACT_ORDER_CHANGED
 * =====================================================================
 */

const { GUARDIAN, MY_PERSON } = CONTACT_RELATIONSHIP_TYPE;

// 실패 응답 (명세 기준)
const CONTACT_MOCK_ERROR = {
  INVALID_INPUT: { status: 400, code: "INVALID_INPUT", message: "입력값이 올바르지 않습니다." },
  CONTACT_ORDER_CHANGED: {
    status: 409,
    code: "CONTACT_ORDER_CHANGED",
    message: "연락 대상 목록이 변경되었습니다. 목록을 다시 확인해 주세요.",
  },
};

// 실패 흉내 값 (?mockFail=)
const CONTACT_MOCK_FAIL_TYPE = {
  INVALID_INPUT: "true",
  ORDER_CHANGED: "changed",
};

// 성공 응답 message (명세 기준, 화면에서는 FE 고정 문구 사용)
const CONTACT_MOCK_ORDER_MESSAGE = "연락 순서를 변경했습니다.";

const storeByScenario = {};

// 시나리오의 연락 대상 목록 (없는 시나리오면 기본 시나리오)
const getMockStore = (scenario = DEFAULT_CONTACT_MOCK_SCENARIO) => {
  const key = CARD_CONTACT_MOCK[scenario] ? scenario : DEFAULT_CONTACT_MOCK_SCENARIO;
  if (!storeByScenario[key]) {
    storeByScenario[key] = structuredClone(CARD_CONTACT_MOCK[key].items);
  }
  return storeByScenario[key];
};

// 두 ID 목록이 순서와 관계없이 같은 대상인지
const isSameIdSet = (ids, otherIds) =>
  ids.length === otherIds.length && ids.every((id) => otherIds.includes(id));

/**
 * =====================================================================
 * API 함수
 * =====================================================================
 */

// 1. 비상연락망 조회 (GET /api/emergency-contacts)
// - mockScenario: 테스트 데이터 시나리오 키 (USE_MOCK일 때만 사용)
// → data: { items: [{ userId, name, relationshipType, personalLabel, priority, guardianPriority }] }
//   (보호자를 guardianPriority 순으로 먼저, 추가 비상연락 대상은 그 뒤 / name은 탈퇴 시 null)
export const getEmergencyContactsApi = async ({ mockScenario } = {}) => {
  if (USE_MOCK) {
    await wait();
    const items = [...getMockStore(mockScenario)].sort((a, b) => a.priority - b.priority);
    // 화면에서 응답을 바꿔도 저장소에 남지 않도록 복사본 반환
    return createMockResponse({ items: structuredClone(items) });
  }

  const response = await axiosInstance.get(AUTH_API_URLS.emergencyContacts);
  return response.data;
};

// 2. 연락 순서 변경 (PATCH /api/emergency-contacts/order)
// - guardianUserIds: 보호자 ID 전체를 원하는 순서대로 (없으면 빈 배열)
// - emergencyContactUserIds: 추가 비상연락 대상(나의 사람) ID 전체를 원하는 순서대로 (없으면 빈 배열)
//   바꾸지 않은 그룹도 현재 순서 그대로 함께 보냄
// - mockFail: 실패 흉내 값 (USE_MOCK일 때만 사용, 위 CONTACT_MOCK_FAIL_TYPE)
// → data: { items: [{ contactUserId, relationshipType, priority }] }
//   (조회 응답과 ID 필드명이 달라 화면은 응답으로 덮어쓰지 않고 다시 조회함)
export const patchEmergencyContactsOrderApi = async ({
  guardianUserIds,
  emergencyContactUserIds,
  mockScenario,
  mockFail,
}) => {
  if (USE_MOCK) {
    await wait();
    if (mockFail === CONTACT_MOCK_FAIL_TYPE.INVALID_INPUT) {
      throw createMockError(CONTACT_MOCK_ERROR.INVALID_INPUT);
    }
    if (mockFail === CONTACT_MOCK_FAIL_TYPE.ORDER_CHANGED) {
      throw createMockError(CONTACT_MOCK_ERROR.CONTACT_ORDER_CHANGED);
    }

    // 중복 ID (한 목록 안 또는 두 목록 사이) → 400
    const allIds = [...guardianUserIds, ...emergencyContactUserIds];
    if (new Set(allIds).size !== allIds.length) {
      throw createMockError(CONTACT_MOCK_ERROR.INVALID_INPUT);
    }

    // 현재 목록과 대상이 다르면 (화면을 연 뒤 관계가 추가·해제됨) → 409
    const store = getMockStore(mockScenario);
    const findIdsByType = (type) =>
      store.filter((item) => item.relationshipType === type).map((item) => item.userId);
    if (
      !isSameIdSet(guardianUserIds, findIdsByType(GUARDIAN)) ||
      !isSameIdSet(emergencyContactUserIds, findIdsByType(MY_PERSON))
    ) {
      throw createMockError(CONTACT_MOCK_ERROR.CONTACT_ORDER_CHANGED);
    }

    // 보호자 → 나의 사람 순으로 전체 순위 다시 매김
    const findItem = (userId) => store.find((item) => item.userId === userId);
    const nextItems = [
      ...guardianUserIds.map((userId, index) => ({
        ...findItem(userId),
        guardianPriority: index + 1,
      })),
      ...emergencyContactUserIds.map((userId) => ({
        ...findItem(userId),
        guardianPriority: null,
      })),
    ].map((item, index) => ({ ...item, priority: index + 1 }));
    store.splice(0, store.length, ...nextItems);

    return createMockResponse(
      {
        items: nextItems.map(({ userId, relationshipType, priority }) => ({
          contactUserId: userId,
          relationshipType,
          priority,
        })),
      },
      CONTACT_MOCK_ORDER_MESSAGE,
    );
  }

  const response = await axiosInstance.patch(AUTH_API_URLS.emergencyContactsOrder, {
    guardianUserIds,
    emergencyContactUserIds,
  });
  return response.data;
};