import { axiosInstance } from "@/shared/api/axiosInstance";
import { AUTH_API_URLS } from "@/shared/constants/apiUrlConstants";
import { createMockResponse, wait } from "@/features/card/mocks/mockUtils"; // TODO: 목업 공통 함수 shared로 이동 시 경로 변경
import { MOCK_RELATIONSHIPS } from "@/features/relation/mocks/relationshipMocks";

// 관계 조회·해제 API (API 명세서 F-28 관계 해제)
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery / useMutation 쪽에서)

// A 영역은 명세 확정 + 서버 배포 완료라 실제 서버로 요청
// - 관계가 하나도 없는 계정으로 화면을 확인하고 싶을 때만 true로 바꿔서 확인
const USE_MOCK = false; 

// 1. 활성 관계 목록 조회 (GET /api/relationships)
// → data: { items: [{ relationshipId, userId, name, relationshipType, personalLabel, guardianPriority }] }
export const getRelationshipsApi = async () => {
  if (USE_MOCK) {
    await wait();
    return createMockResponse(MOCK_RELATIONSHIPS);
  }

  const response = await axiosInstance.get(AUTH_API_URLS.relationships);
  return response.data;
};

// 2. 관계 해제 (DELETE /api/relationships/{relationshipId})
// - MY_PERSON: 내가 등록한 방향만 종료 / GUARDIAN: 양방향 모두 종료
// → data: { relationshipId, relationshipType, endedAt }
export const deleteRelationshipApi = async (relationshipId) => {
  if (USE_MOCK) {
    await wait();
    return createMockResponse({ relationshipId, relationshipType: null, endedAt: null }, "관계를 해제했습니다.");
  }

  const response = await axiosInstance.delete(AUTH_API_URLS.relationship(relationshipId));
  return response.data;
};