import { axiosInstance } from "@/shared/api/axiosInstance";
import { SITUATION_API_URLS } from "@/shared/constants/apiUrlConstants";
import {
  createMockResponse,
  paginateMockItems,
  wait,
} from "@/features/situation/mocks/situationMockUtils";
import {
  IN_PROGRESS_SITUATION_ITEMS_MOCK,
  PAST_SITUATION_ITEMS_MOCK,
} from "@/features/situation/mocks/situationApiMockData";

// 상황 API (API 명세서 F-04 상황, F-22 지난 상황)
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery / useMutation 쪽에서)

// B 영역은 명세 확정 상태이고 서버 배포 전이라 명세 응답 형태의 목업을 사용
// TODO: 서버 배포 확인 후 USE_MOCK을 false로 변경
const USE_MOCK = true;

// 목업 시나리오 (USE_MOCK일 때만 사용)
// - "empty": 진행 중·지난 상황이 하나도 없는 계정 (S-00-2 빈 상태 확인용, /situation?state=empty)
export const SITUATION_MOCK_SCENARIO = {
  EMPTY: "empty",
};

// 1. 진행 중 상황 목록 조회 (GET /api/situations?page&size)
// → data: { items: [{ situationId, name, situationType, startAt, endAt, status,
//                     participantCount, isOwner, role, requestCounts, nextSchedule, remainingScheduleCount }],
//           page, size, hasNext }
export const getInProgressSituationsApi = async ({ page = 0, size = 20, mockScenario } = {}) => {
  if (USE_MOCK) {
    await wait();
    const items =
      mockScenario === SITUATION_MOCK_SCENARIO.EMPTY ? [] : IN_PROGRESS_SITUATION_ITEMS_MOCK;
    return createMockResponse(structuredClone(paginateMockItems(items, { page, size })));
  }

  const response = await axiosInstance.get(SITUATION_API_URLS.inProgressList, {
    params: { page, size },
  });
  return response.data;
};

// 2. 지난 상황 목록 조회 (GET /api/situations/history?page&size&filter&personId)
// - filter: ALL / HELPED / RECEIVED (기본 ALL), personId: 사람별 보기 (선택)
// → data: { items: [{ situationId, name, situationType, startAt, endAt, endedAt,
//                     isOwner, ownerName, participantCount }], page, size, hasNext }
export const getPastSituationsApi = async ({
  page = 0,
  size = 20,
  filter,
  personId,
  mockScenario,
} = {}) => {
  if (USE_MOCK) {
    await wait();
    const items =
      mockScenario === SITUATION_MOCK_SCENARIO.EMPTY ? [] : PAST_SITUATION_ITEMS_MOCK;
    return createMockResponse(structuredClone(paginateMockItems(items, { page, size })));
  }

  const response = await axiosInstance.get(SITUATION_API_URLS.pastList, {
    params: { page, size, filter, personId },
  });
  return response.data;
};

// 3. 상황 생성 (POST /api/situations)
// - body: { situationType, customSituationType, name, participantIds, startAt, endAt }
// → data: { situationId, creatorId, status }
export const createSituationApi = async (body) => {
  if (USE_MOCK) {
    await wait();
    return createMockResponse({ situationId: 100, creatorId: 10, status: "ACTIVE" });
  }

  const response = await axiosInstance.post(SITUATION_API_URLS.create, body);
  return response.data;
};
