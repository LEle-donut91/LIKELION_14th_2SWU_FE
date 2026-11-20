import { axiosInstance } from "@/shared/api/axiosInstance";
import { AUTH_API_URLS } from "@/shared/constants/apiUrlConstants";
import {
  createMockResponse,
  wait,
} from "@/features/situation/mocks/situationMockUtils";
import { RELATIONSHIP_ITEMS_MOCK } from "@/features/situation/mocks/situationApiMockData";

// 관계 API 중 상황 화면에서 쓰는 조회 (API 명세서 F-28 활성 관계 목록 조회)
// - H-01 상황 만들기의 '참여할 지인' 목록
// - 공통 응답 전체 { status, code, message, data }를 반환, 에러는 그대로 던짐

// A 영역은 서버 배포 완료라 실제 서버로 요청 (로그인 필요)
// - 로그인 없이 화면만 확인하고 싶을 때만 로컬에서 true로 바꿔서 확인 (커밋은 false로)
const USE_MOCK = true;

// 1. 활성 관계 목록 조회 (GET /api/relationships)
// → data: { items: [{ relationshipId, userId, name, relationshipType, personalLabel, guardianPriority }] }
export const getRelationshipsApi = async () => {
  if (USE_MOCK) {
    await wait();
    return createMockResponse(structuredClone({ items: RELATIONSHIP_ITEMS_MOCK }));
  }

  const response = await axiosInstance.get(AUTH_API_URLS.relationships);
  return response.data;
};
