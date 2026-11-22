import {
  GUARDIAN_RELATIONSHIP_LABEL,
  PARTICIPANT_STATUS,
  REQUEST_DISPLAY_STATUS,
  SITUATION_ROLE,
} from "@/features/situation/constants/situationConstants";

// H-03 상황 상세: API 응답 → 화면용 데이터 변환 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }
// - 응답 필드명이 바뀌면 이 파일만 수정한다. 화면 컴포넌트는 이 파일이 만든 값만 사용한다.

// 요청 1개 → 요청 카드 데이터 (SituationRequestList, ResponseNeededRequestList)
// - targetName: 요청 대상·담당자 이름 (담당자 없음·취소·만료는 서버가 null로 내려줌)
// - responseDeadline: 응답 기한 (명세에 아직 없는 값이라 없으면 null)
const toRequest = (item, myRole) => ({
  id: item.requestId,
  helpType: item.helpType,
  targetName: item.targetUserName ?? null,
  startDateTime: item.startsAt,
  endDateTime: item.endsAt,
  status: item.displayStatus,
  responseDeadline: item.responseDeadline ?? null,
  ...(myRole && { myRole }),
});

// 참여자 시점: 요청마다 내가 대상인지 담당자인지 구분 (BE 답변 기준)
// - viewerId와 targetUserId가 같은 요청만 내 요청
// - WAITING → 응답이 필요한 요청(TARGET), 나머지 → 수락한 요청(ASSIGNEE)
const splitParticipantRequests = (requests, viewerId) => {
  // viewerId가 아직 응답에 없으면 서버가 이미 내 요청만 걸러서 주므로 전체 사용
  const myRequests =
    viewerId == null
      ? requests
      : requests.filter((item) => item.targetUserId === viewerId);

  return {
    responseNeededRequests: myRequests
      .filter((item) => item.displayStatus === REQUEST_DISPLAY_STATUS.WAITING)
      .map((item) => toRequest(item, "TARGET")),
    assignedRequests: myRequests
      .filter((item) => item.displayStatus !== REQUEST_DISPLAY_STATUS.WAITING)
      .map((item) => toRequest(item, "ASSIGNEE")),
  };
};

// 1. 상황 상세 조회 → H-03 화면 데이터
// → {
//     id, title, startDate, endDate, isOwner, viewerId, activeRequestCount,
//     requests,               // 정보 주인: 상황의 전체 요청 (참여자는 빈 배열)
//     responseNeededRequests, // 참여자: 응답이 필요한 요청
//     assignedRequests,       // 참여자: 수락한 요청
//   }
export const getSituationDetailService = (raw) => {
  const data = raw?.data ?? {};
  const requests = data.requests ?? [];
  const isOwner = data.isOwner ?? false;
  const viewerId = data.viewerId ?? null;

  return {
    id: data.situationId,
    title: data.name ?? "",
    startDate: data.startAt,
    endDate: data.endAt,
    isOwner,
    viewerId,
    activeRequestCount: data.activeRequestCount ?? 0,
    requests: isOwner ? requests.map((item) => toRequest(item)) : [],
    ...(isOwner
      ? { responseNeededRequests: [], assignedRequests: [] }
      : splitParticipantRequests(requests, viewerId)),
  };
};

// 2. 참여자 목록 조회 → 상단 카드 · 참여자 태그 데이터
// - OWNER는 태그에서 빼고 이름만 ownerName으로 (참여자 시점 "OO님의 상황")
// - 현재 참여 중(ACTIVE)인 사람만 표시
// → { ownerName, participants: [{ id(participantId), userId, name, relationLabel, isGuardian }] }
export const getSituationParticipantsService = (raw) => {
  const items = (raw?.data?.items ?? []).filter(
    (item) => item.status === PARTICIPANT_STATUS.ACTIVE,
  );
  const owner = items.find((item) => item.role === SITUATION_ROLE.OWNER);

  return {
    ownerName: owner?.displayName ?? "",
    participants: items
      .filter((item) => item.role !== SITUATION_ROLE.OWNER)
      .map((item) => ({
        id: item.participantId,
        userId: item.userId,
        name: item.displayName ?? "",
        relationLabel: item.relationshipLabel ?? "", // 로그인 사용자 기준 관계 (예: 보호자)
        isGuardian: item.relationshipLabel === GUARDIAN_RELATIONSHIP_LABEL,
      })),
  };
};
