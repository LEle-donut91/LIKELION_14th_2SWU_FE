import { axiosInstance } from "@/shared/api/axiosInstance";
import {
  DEFAULT_MOCK_SCENARIO,
  HOME_MOCK_DATA,
} from "@/features/home/mocks/homeMockData";

// 백엔드 API 연동 전까지 테스트 데이터를 사용한다.
// TODO: API 경로·응답 스키마 확정 후 USE_MOCK을 false로 변경하고 HOME_API_PATH를 채운다.
const USE_MOCK = true;
const HOME_API_PATH = ""; // 미확정 (예시 경로를 임의로 넣지 않음)

// 홈 화면 데이터 조회
// mockScenario: 테스트 데이터 시나리오 키 (USE_MOCK일 때만 사용, 실제 API 호출 시 무시)
export const getHome = async ({ mockScenario } = {}) => {
  if (USE_MOCK) {
    return (
      HOME_MOCK_DATA[mockScenario] ?? HOME_MOCK_DATA[DEFAULT_MOCK_SCENARIO]
    );
  }

  const response = await axiosInstance.get(HOME_API_PATH);
  return response.data;
};
