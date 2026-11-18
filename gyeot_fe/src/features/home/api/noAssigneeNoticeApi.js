import { axiosInstance } from "@/shared/api/axiosInstance";
import { REQUEST_API_URLS } from "@/shared/constants/apiUrlConstants";
// TODO: mock 공통 함수를 card에서 가져와 씀 (home → card 의존, homeApi.js와 같은 TODO)
import {
  createMockError,
  createMockResponse,
  wait,
} from "@/features/card/mocks/mockUtils";
import {
  getNoAssigneeNoticeMockStore,
  removeNoAssigneeNoticeMockItem,
} from "@/features/home/mocks/noAssigneeNoticeMockData";

// 담당자 없음 안내 API (API 명세서 F-14: 담당자 없음 안내 목록, 담당자 없음 안내 닫기)
// - URL은 C 영역(REQUEST_API_URLS). 홈 진입 시 부르므로 파일은 home에 둔다 (API_CONVENTIONS 9-5)
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery / useMutation 쪽에서)

// 서버 연결·인증 처리 전까지 명세 응답 형태의 테스트 데이터를 사용한다.
// TODO: 인증 처리 후 서버 응답 확인되면 USE_MOCK을 false로 변경 (BE "개발 완료")
const USE_MOCK = true;

// 실패 응답 (명세 기준: 요청이 없거나 관련 없는 요청)
const NOTICE_MOCK_ERROR = {
  REQUEST_NOT_FOUND: {
    status: 404,
    code: "REQUEST_NOT_FOUND",
    message: "존재하지 않는 요청입니다.",
  },
};

// 1. 담당자 없음 안내 목록 (GET /api/care-requests/no-assignee-notices)
// - mockScenario: 테스트 데이터 시나리오 키 (USE_MOCK일 때만 사용, ?noticeMock=none·single·multi·all)
// → data: { items: [{ requestId, requestType, helpType, startsAt, place, target: { userId, name }, reason }] }
//   급한 요청 먼저(지정 시각 빠른 순), 그다음 일반 요청(시작 시각 빠른 순). 없으면 빈 배열
export const getNoAssigneeNoticesApi = async ({ mockScenario } = {}) => {
  if (USE_MOCK) {
    await wait();
    // 화면에서 응답을 바꿔도 저장소에 남지 않도록 복사본 반환
    const items = structuredClone(getNoAssigneeNoticeMockStore(mockScenario));
    return createMockResponse({ items });
  }

  const response = await axiosInstance.get(REQUEST_API_URLS.noAssigneeNotices);
  return response.data;
};

// 2. 담당자 없음 안내 닫기 (POST /api/care-requests/{requestId}/no-assignee-notice/dismiss)
// - reason: 모달에 표시한 사유 (안내 목록의 reason을 그대로 보냄)
// - shouldMockFail: true면 목업에서 404 REQUEST_NOT_FOUND를 흉내 냄 (USE_MOCK일 때만, ?noticeMockFail=true)
// → data: null (그사이 담당자 없음이 아니게 됐어도 서버는 기록 없이 200)
export const postNoAssigneeNoticeDismissApi = async ({
  requestId,
  reason,
  mockScenario,
  shouldMockFail = false,
}) => {
  if (USE_MOCK) {
    await wait();
    if (shouldMockFail) {
      throw createMockError(NOTICE_MOCK_ERROR.REQUEST_NOT_FOUND);
    }
    removeNoAssigneeNoticeMockItem(mockScenario, requestId);
    return createMockResponse(null);
  }

  const response = await axiosInstance.post(
    REQUEST_API_URLS.noAssigneeNoticeDismiss(requestId),
    { reason },
  );
  return response.data;
};
