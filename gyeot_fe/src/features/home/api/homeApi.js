import { axiosInstance } from "@/shared/api/axiosInstance";
import { SITUATION_API_URLS } from "@/shared/constants/apiUrlConstants";
// TODO: mock 공통 함수(wait, createMockResponse)를 card에서 가져와 씀 (home → card 의존)
//       다른 영역에서도 쓰게 되면 shared로 옮길지 팀과 결정 (옮기면 card api 파일 import도 함께 수정)
import { createMockResponse, wait } from "@/features/card/mocks/mockUtils";
// 홈 '공유중' 건수를 C-06 공유 목업 저장소와 맞추기 위해 사용 (home → card 의존, USE_MOCK일 때만)
import { countSharingMockItems } from "@/features/card/mocks/sharingMockStore";
import {
  DEFAULT_MOCK_SCENARIO,
  HOME_MOCK_DATA,
} from "@/features/home/mocks/homeMockData";

// 홈 API (API 명세서 F-34: 홈 통합 조회)
// - 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery 쪽에서)

// 명세 초안(임시 계약) 상태라 명세 응답 형태의 테스트 데이터를 사용한다.
// TODO: 최종 DTO 확정 + 서버 구현 완료 확인 후 USE_MOCK을 false로 변경
const USE_MOCK = true;

// 1. 홈 통합 조회 (GET /api/home)
// - mockScenario: 테스트 데이터 시나리오 키 (USE_MOCK일 때만 사용, ?mock=new·empty·single·default)
// → data: { counts, situationCards, isNewUser, responseNeededItems, sentOpenItems, upcomingSchedules }
export const getHomeApi = async ({ mockScenario } = {}) => {
  if (USE_MOCK) {
    await wait();
    const data =
      HOME_MOCK_DATA[mockScenario] ?? HOME_MOCK_DATA[DEFAULT_MOCK_SCENARIO];
    // 화면에서 응답을 바꿔도 테스트 데이터에 남지 않도록 복사본 반환
    const responseData = structuredClone(data);

    // 공유 중 건수: 공유가 있는 시나리오(activeSharings > 0)만 공유 목업 저장소 기준으로 바꿈
    // → C-06에서 철회·다시 허용하면 홈 '공유중' 건수도 함께 바뀜 (C-00 메인 조회와 같은 방식)
    // → 신규·상황 0개 시나리오는 0건 유지
    if (responseData.counts.activeSharings > 0) {
      responseData.counts.activeSharings = countSharingMockItems();
    }
    return createMockResponse(responseData);
  }

  const response = await axiosInstance.get(SITUATION_API_URLS.home);
  return response.data;
};