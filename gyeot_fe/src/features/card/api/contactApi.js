import { axiosInstance } from "@/shared/api/axiosInstance";
import { CONTACT_RELATIONSHIP_TYPE } from "@/features/card/constants/cardConstants";
import {
  CARD_CONTACT_MOCK,
  DEFAULT_CONTACT_MOCK_SCENARIO,
} from "@/features/card/mocks/cardMockData";

// 백엔드 API 연동 전까지 테스트 데이터를 사용한다. (homeApi.js와 같은 방식)
// TODO: 연동 시 USE_MOCK을 false로 변경
const USE_MOCK = true;

// 목업 저장 응답 지연 시간(ms): 저장 중 드래그 잠금을 확인할 수 있도록 약간 늦게 응답
const MOCK_SAVE_DELAY = 500;

// 비상연락망 API 경로 (API 명세서 F-27 기준)
const EMERGENCY_CONTACT_API_PATH = {
  LIST: "/api/emergency-contacts", // 비상연락망 조회
  MY_PERSON_ORDER: "/api/emergency-contacts/order", // 추가 비상연락 대상(나의 사람) 순서 변경
  GUARDIAN_ORDER: "", // TODO: 보호자 순서 변경 API는 BE에서 추가 예정 (경로 미정이라 비워 둠)
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 비상연락망 조회 → { items: [...] }
// mockScenario: 테스트 데이터 시나리오 키 (USE_MOCK일 때만 사용)
export const getEmergencyContacts = async ({ mockScenario } = {}) => {
  if (USE_MOCK) {
    return (
      CARD_CONTACT_MOCK[mockScenario] ??
      CARD_CONTACT_MOCK[DEFAULT_CONTACT_MOCK_SCENARIO]
    );
  }

  // 공통 응답 형태 { status, code, message, data } 중 data만 반환
  const response = await axiosInstance.get(EMERGENCY_CONTACT_API_PATH.LIST);
  return response.data.data;
};

// 연락 순서 변경 (보호자 / 나의 사람 각각)
// - contactUserIds: 해당 그룹의 사용자 ID를 바뀐 순서대로
// - shouldMockFail: true면 목업에서 저장 실패를 흉내 냄 (USE_MOCK일 때만 사용)
export const updateContactOrder = async ({
  relationshipType,
  contactUserIds,
  shouldMockFail = false,
}) => {
  if (USE_MOCK) {
    await wait(MOCK_SAVE_DELAY);
    if (shouldMockFail) {
      throw new Error("MOCK_SAVE_FAILED");
    }
    return null;
  }

  const path =
    relationshipType === CONTACT_RELATIONSHIP_TYPE.GUARDIAN
      ? EMERGENCY_CONTACT_API_PATH.GUARDIAN_ORDER
      : EMERGENCY_CONTACT_API_PATH.MY_PERSON_ORDER;

  // 경로가 정해지지 않은 요청은 보내지 않고 실패로 처리 (화면은 원래 순서로 되돌아감)
  if (!path) {
    throw new Error("CONTACT_ORDER_API_NOT_READY");
  }

  // TODO: 보호자 순서 변경 API의 Request Body 필드명이 확정되면 맞춰서 수정
  const response = await axiosInstance.put(path, { contactUserIds });
  return response.data.data;
};
