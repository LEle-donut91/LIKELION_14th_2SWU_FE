import { axiosInstance } from "@/shared/api/axiosInstance";
import { INFO_SHARE_API_URLS } from "@/shared/constants/apiUrlConstants";
import { createMockResponse, wait } from "@/features/card/mocks/mockUtils"; // TODO: 목업 공통 함수 shared로 이동 시 경로 변경
import { MOCK_RECEIVED_SHARINGS } from "@/features/relation/mocks/receivedSharingMocks";

// 받은 정보 조회 API (API 명세서 F-30 공유 관리)
// - 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery 쪽에서)

// 서버 배포 전(BE 현황: 명세 확정)이라 명세 예시 응답으로 확인
// TODO: 서버에 API가 올라간 것을 확인한 뒤 false로 변경
const USE_MOCK = true;

// 이 사람이 나에게 공유 중인 정보 (GET /api/sharings/received?userId={userId})
// - userId: 정보 주인(이 사람) ID
// → data: { items: [{ requestId, helpType, startsAt, accessUntil, sharedItems }] }
export const getReceivedSharingsApi = async (userId) => {
  if (USE_MOCK) {
    await wait();
    return createMockResponse(MOCK_RECEIVED_SHARINGS);
  }

  const response = await axiosInstance.get(INFO_SHARE_API_URLS.receivedSharings, {
    params: { userId },
  });
  return response.data;
};
