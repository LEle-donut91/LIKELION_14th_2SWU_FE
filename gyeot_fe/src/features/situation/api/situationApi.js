import { axiosInstance } from "@/shared/api/axiosInstance";
import { SITUATION_API_URLS } from "@/shared/constants/apiUrlConstants";
import {
  createMockError,
  createMockResponse,
  paginateMockItems,
  wait,
} from "@/features/situation/mocks/situationMockUtils";
import {
  IN_PROGRESS_SITUATION_ITEMS_MOCK,
  PAST_SITUATION_DETAIL_MOCK_BY_ID,
  PAST_SITUATION_ITEMS_MOCK,
  PAST_SITUATION_PERSON_IDS_MOCK,
  RELATIONSHIP_ITEMS_MOCK,
  SITUATION_DETAIL_MOCK_BY_ID,
  SITUATION_PARTICIPANTS_MOCK_BY_ID,
} from "@/features/situation/mocks/situationApiMockData";

// 상황 API (API 명세서 F-04 상황, F-22 지난 상황)
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery / useMutation 쪽에서)

// B 영역은 명세 확정 상태이고 서버 배포 전이라 명세 응답 형태의 목업을 사용
// TODO: 서버 배포 확인 후 USE_MOCK을 false로 변경
const USE_MOCK = true;

// 목업 시나리오 (USE_MOCK일 때만 사용)
// - "empty": 진행 중·지난 상황이 하나도 없는 계정 (S-00-2 빈 상태 확인용, /situation?state=empty)
//            상황 상세에서는 요청이 하나도 없는 상황 (/situation/detail?situationId=1&state=empty)
//            상황 관리에서는 정보 주인 말고 참여자가 모두 나간 상황 (/situation/manage?situationId=1&state=empty)
// - "no-accepted": 상황 상세에서 응답 대기 요청만 있는 상황
//                  (참여자 뷰 '수락한 요청' 빈 상태 확인용, /situation/detail?situationId=21&state=no-accepted)
export const SITUATION_MOCK_SCENARIO = {
  EMPTY: "empty",
  NO_ACCEPTED: "no-accepted",
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
      mockScenario === SITUATION_MOCK_SCENARIO.EMPTY
        ? []
        : PAST_SITUATION_ITEMS_MOCK.filter((item) => {
            // filter: 도와준(HELPED) = 내가 참여자, 도움받은(RECEIVED) = 내가 정보 주인
            if (filter === "HELPED" && item.isOwner) return false;
            if (filter === "RECEIVED" && !item.isOwner) return false;
            if (personId == null) return true;
            return (PAST_SITUATION_PERSON_IDS_MOCK[item.situationId] ?? []).includes(
              Number(personId),
            );
          });
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

// 목업에 없는 상황 ID → 404 SITUATION_NOT_FOUND (상황이 없거나 접근 불가)
const SITUATION_NOT_FOUND_MOCK_ERROR = {
  status: 404,
  code: "SITUATION_NOT_FOUND",
  message: "상황을 찾을 수 없습니다.",
};

// 4. 상황 상세 조회 (GET /api/situations/{situationId})
// → data: { situationId, creatorId, isOwner, viewerId, name, situationType, customSituationType,
//           startAt, endAt, status, endedAt, activeRequestCount,
//           requests: [{ requestId, requestType, helpType, startsAt, endsAt,
//                        requesterId, targetUserId, displayStatus, targetUserName }] }
export const getSituationDetailApi = async (situationId, { mockScenario } = {}) => {
  if (USE_MOCK) {
    await wait();
    const data = SITUATION_DETAIL_MOCK_BY_ID[situationId];
    if (!data) throw createMockError(SITUATION_NOT_FOUND_MOCK_ERROR);

    const responseData = structuredClone(data);
    if (mockScenario === SITUATION_MOCK_SCENARIO.EMPTY) {
      responseData.requests = [];
      responseData.activeRequestCount = 0;
    }
    if (mockScenario === SITUATION_MOCK_SCENARIO.NO_ACCEPTED) {
      responseData.requests = responseData.requests.filter(
        (request) => request.displayStatus === "WAITING",
      );
      responseData.activeRequestCount = responseData.requests.length;
    }
    return createMockResponse(responseData);
  }

  const response = await axiosInstance.get(SITUATION_API_URLS.detail(situationId));
  return response.data;
};

// 참여자 목업 저장소: 참여자 추가·제외 결과가 새로고침 전까지 목록에 반영되도록 복사본을 수정
const mockParticipantsById = structuredClone(SITUATION_PARTICIPANTS_MOCK_BY_ID);
let nextMockParticipantId = 1000; // 목업으로 추가한 참여자의 participantId
// 처음부터 목업에 있던 참여자 ID ("empty" 시나리오에서 나간 상태로 바꿀 대상)
const INITIAL_MOCK_PARTICIPANT_IDS = new Set(
  Object.values(SITUATION_PARTICIPANTS_MOCK_BY_ID)
    .flat()
    .map(({ participantId }) => participantId),
);

// 5. 참여자 목록 조회 (GET /api/situations/{situationId}/participants)
// → data: { items: [{ participantId, userId, role, status, joinedAt, leftAt,
//                     displayName, relationshipLabel }] }
export const getSituationParticipantsApi = async (situationId, { mockScenario } = {}) => {
  if (USE_MOCK) {
    await wait();
    const items = mockParticipantsById[situationId];
    if (!items) throw createMockError(SITUATION_NOT_FOUND_MOCK_ERROR);

    // "empty": 처음부터 있던 참여자를 '나간 상태(LEFT)'로 바꿔서 정보 주인만 남김
    // - 나간 사람도 참여자 추가 시트에서 다시 추가할 수 있음
    if (mockScenario === SITUATION_MOCK_SCENARIO.EMPTY) {
      items
        .filter(
          (item) =>
            item.role !== "OWNER" &&
            INITIAL_MOCK_PARTICIPANT_IDS.has(item.participantId),
        )
        .forEach((item) => {
          item.status = "LEFT";
        });
    }
    const responseItems = items.filter((item) => item.status === "ACTIVE");
    return createMockResponse(structuredClone({ items: responseItems }));
  }

  const response = await axiosInstance.get(SITUATION_API_URLS.participants(situationId));
  return response.data;
};

// 6. 참여자 추가 (POST /api/situations/{situationId}/participants)
// - body: { userId } — 한 번에 한 명 (여러 명은 호출하는 쪽에서 반복)
// → data: { participantId, situationId, userId, role, status, joinedAt }
// - 이미 참여 중: 409 SITUATION_PARTICIPANT_ALREADY_EXISTS
export const addSituationParticipantApi = async (situationId, { userId }) => {
  if (USE_MOCK) {
    await wait();
    const items = mockParticipantsById[situationId];
    if (!items) throw createMockError(SITUATION_NOT_FOUND_MOCK_ERROR);

    const isJoined = items.some(
      (item) => item.userId === userId && item.status === "ACTIVE",
    );
    if (isJoined) {
      throw createMockError({
        status: 409,
        code: "SITUATION_PARTICIPANT_ALREADY_EXISTS",
        message: "이미 참여 중인 사용자입니다.",
      });
    }

    const relationship = RELATIONSHIP_ITEMS_MOCK.find(
      (item) => item.userId === userId,
    );
    const participant = {
      participantId: nextMockParticipantId++,
      userId,
      role: "PARTICIPANT",
      status: "ACTIVE",
      joinedAt: new Date().toISOString().slice(0, 19),
      leftAt: null,
      // 관계 목업에 없는 사용자(실제 관계 API로 고른 경우)는 임시 이름
      displayName: relationship?.name ?? `사용자 ${userId}`,
      relationshipLabel:
        relationship?.relationshipType === "GUARDIAN" ? "보호자" : null,
    };
    items.push(participant);

    const { participantId, role, status, joinedAt } = participant;
    return createMockResponse({
      participantId,
      situationId: Number(situationId),
      userId,
      role,
      status,
      joinedAt,
    });
  }

  const response = await axiosInstance.post(
    SITUATION_API_URLS.participants(situationId),
    { userId },
  );
  return response.data;
};

// 7. 참여자 제외 (DELETE /api/situations/{situationId}/participants/{participantId})
// - 정보 주인만 가능, 정보 주인(OWNER)은 제외 불가
export const removeSituationParticipantApi = async (situationId, participantId) => {
  if (USE_MOCK) {
    await wait();
    const items = mockParticipantsById[situationId];
    if (!items) throw createMockError(SITUATION_NOT_FOUND_MOCK_ERROR);

    const participant = items.find(
      (item) => item.participantId === participantId,
    );
    if (participant) {
      participant.status = "REMOVED";
      participant.leftAt = new Date().toISOString().slice(0, 19);
    }
    return createMockResponse(null);
  }

  const response = await axiosInstance.delete(
    SITUATION_API_URLS.participant(situationId, participantId),
  );
  return response.data;
};

// 8. 상황 직접 종료 (POST /api/situations/{situationId}/end)
// - 정보 주인만 가능
// → data: { situationId, status, endedAt }
// - 이미 종료된 상황: 409 SITUATION_ALREADY_ENDED
export const endSituationApi = async (situationId) => {
  if (USE_MOCK) {
    await wait();
    return createMockResponse({
      situationId: Number(situationId),
      status: "ENDED",
      endedAt: new Date().toISOString().slice(0, 19),
    });
  }

  const response = await axiosInstance.post(SITUATION_API_URLS.end(situationId));
  return response.data;
};

// 9. 상황 나가기 (POST /api/situations/{situationId}/leave)
// - 일반 참여자 본인만 가능 (정보 주인은 불가)
export const leaveSituationApi = async (situationId) => {
  if (USE_MOCK) {
    await wait();
    return createMockResponse(null);
  }

  const response = await axiosInstance.post(SITUATION_API_URLS.leave(situationId));
  return response.data;
};

// 10. 지난 상황 상세 조회 (GET /api/situations/{situationId}/history)
// → data: { situation: { situationId, name, status, startAt, endAt, endedAt, isOwner, participantCount },
//           requests: [{ requestId, helpType, status, startsAt, assigneeId, assigneeName,
//                        assigneeWithdrawn, hasThankYouMessage }] }
// - 참여자에게는 본인이 담당했던 요청만 내려옴
export const getPastSituationDetailApi = async (situationId) => {
  if (USE_MOCK) {
    await wait();
    const data = PAST_SITUATION_DETAIL_MOCK_BY_ID[situationId];
    if (!data) throw createMockError(SITUATION_NOT_FOUND_MOCK_ERROR);
    return createMockResponse(structuredClone(data));
  }

  const response = await axiosInstance.get(SITUATION_API_URLS.pastDetail(situationId));
  return response.data;
};
