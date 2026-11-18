import {
  HOME_HELP_TYPE_LABELS,
  SITUATION_REQUEST_COUNT_TAG_LIST,
  SITUATION_TAB,
} from "@/features/home/constants/homeConstants";

// 홈 API 응답 → 화면용 데이터 변환 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }
// - 명세 초안(임시 계약)이라 응답 필드명이 바뀌면 이 파일만 수정한다 (API_CONVENTIONS 7-1)
//   화면 컴포넌트는 이 파일이 만든 값만 사용한다.

// 도움 종류 표시 문구: helpType 라벨 → 없으면 현행 초안의 title
const toTypeName = (helpType, title) =>
  HOME_HELP_TYPE_LABELS[helpType] ?? title ?? "";

// requestCounts → 상황 카드 태그 [{ type, count }]
// - 응답에 있는 key만 태그로 그림 (requestCounts가 없으면 태그 없음)
const toSituationTags = (requestCounts, tabKey) => {
  if (!requestCounts) return [];

  return SITUATION_REQUEST_COUNT_TAG_LIST[tabKey]
    .filter(({ countKey }) => typeof requestCounts[countKey] === "number")
    .map(({ countKey, tagType }) => ({
      type: tagType,
      count: requestCounts[countKey],
    }));
};

// 상황 카드 1개 → SituationCard 데이터
// - participantCount는 나의 상황에서만 표시 (참여 상황은 undefined로 넘겨 메타에서 숨김)
// - D-day·진행 바는 SituationCard에서 startDate/endDate로 계산 (종료 여부는 서버가 ACTIVE만 내려줌)
const toSituation = (card, tabKey) => ({
  id: card.situationId,
  title: card.name ?? "",
  startDate: card.startAt,
  endDate: card.endAt,
  participantCount:
    tabKey === SITUATION_TAB.MY ? card.participantCount : undefined,
  nextSchedule: card.nextSchedule
    ? {
        dateTime: card.nextSchedule.startsAt,
        assigneeName: card.nextSchedule.assigneeName ?? null,
        typeName: toTypeName(card.nextSchedule.helpType),
      }
    : null,
  extraScheduleCount: card.remainingScheduleCount ?? 0,
  tags: toSituationTags(card.requestCounts, tabKey),
});

// 응답이 필요한 요청 1개 → ReceivedRequestItem 데이터
const toReceivedRequest = (item) => ({
  id: item.requestId,
  requester: {
    name: item.requester?.name ?? "",
    profileImageUrl: item.requester?.profileImageUrl ?? null,
  },
  typeName: toTypeName(item.helpType, item.title),
  dateTime: item.startsAt,
  location: item.place ?? null,
  deadline: item.responseDeadline ?? null,
  displayStatus: item.displayStatus ?? null, // 화면 표시 상태 (지금 화면에서는 미사용)
});

// 보낸 요청 1개 → SentRequestItem 데이터
// - receiverName: 요청 대상(target) 이름. "To. 이름"으로 표시하며 실제 담당자와 구분됨
// - hasAssignee: 실제 담당자 배정 여부 (지금 화면에서는 미사용)
const toSentRequest = (item) => ({
  id: item.requestId,
  receiverName: item.target?.name ?? "",
  typeName: toTypeName(item.helpType, item.title),
  dateTime: item.startsAt,
  deadline: item.responseDeadline ?? null,
  hasAssignee: item.hasAssignee ?? false,
  displayStatus: item.displayStatus ?? null,
});

// 예정 일정 1개 → ScheduleItem 데이터
// - 일시: startsAt(변경 제안) → 없으면 scheduledAt(현행 초안)
// - assigneeName: counterpartName(일정에 표시할 상대 이름). 없으면 화면에서 "담당자 없음"
const toUpcomingSchedule = (item) => ({
  id: item.requestId,
  dateTime: item.startsAt ?? item.scheduledAt,
  typeName: toTypeName(item.helpType, item.title),
  assigneeName: item.counterpartName ?? null,
});

// 1. 홈 통합 조회 → 홈 화면 데이터
// → {
//     isNewUser,
//     summary: { requestCount, unassignedCount, scheduledCount, sharingCount },  // 상단 상태 카드
//     situations: { my: Situation[], participating: Situation[] },             // 탭별 상황 카드
//     receivedRequests, sentRequests, upcomingSchedules,                        // 탭 밖 공통 영역
//   }
//   - 빈 배열은 에러가 아니라 빈 상태 화면
export const getHomeService = (raw) => {
  const data = raw?.data;
  const counts = data?.counts;
  const situationCards = data?.situationCards;

  return {
    isNewUser: data?.isNewUser ?? false,
    summary: {
      requestCount: counts?.responseNeeded ?? 0,
      unassignedCount: counts?.unassigned ?? 0,
      // 이름 변경 제안(upcomingScheduleCount) 대비. 최상위 upcomingSchedules 배열과 섞지 않음
      scheduledCount:
        counts?.upcomingScheduleCount ?? counts?.upcomingSchedules ?? 0,
      // D sharingCount와 이름 통일 협의 중. 바뀌면 여기만 수정
      sharingCount: counts?.activeSharings ?? 0,
    },
    situations: {
      [SITUATION_TAB.MY]: (situationCards?.my ?? []).map((card) =>
        toSituation(card, SITUATION_TAB.MY),
      ),
      [SITUATION_TAB.PARTICIPATING]: (situationCards?.participating ?? []).map(
        (card) => toSituation(card, SITUATION_TAB.PARTICIPATING),
      ),
    },
    receivedRequests: (data?.responseNeededItems ?? []).map(toReceivedRequest),
    sentRequests: (data?.sentOpenItems ?? []).map(toSentRequest),
    upcomingSchedules: (data?.upcomingSchedules ?? []).map(toUpcomingSchedule),
  };
};