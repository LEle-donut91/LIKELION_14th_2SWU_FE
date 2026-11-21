import {
  HOME_HELP_TYPE_LABELS,
  REQUEST_DISPLAY_STATUS,
  RESPONSE_NEEDED_TYPE,
  SENT_REQUEST_VISIBLE_STATUS_LIST,
  SITUATION_REQUEST_COUNT_TAG_LIST,
  SITUATION_TAB,
} from "@/features/home/constants/homeConstants";

// 홈 API 응답 → 화면용 데이터 변환 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }
// - 응답 필드는 BE PR #133(홈 통합 조회) 기준. 필드명이 바뀌면 이 파일만 수정한다 (API_CONVENTIONS 7-1)
//   화면 컴포넌트는 이 파일이 만든 값만 사용한다.
// - 서버 반영 대기 필드(requesterName · targetUserName · counterpartName · 보낸 요청 responseDeadline)는
//   응답에 없으면 null로 받는다 (필드 없음과 null을 같은 값으로 처리)

// 도움 종류 표시 문구 (helpType 라벨)
const toTypeName = (helpType) => HOME_HELP_TYPE_LABELS[helpType] ?? "";

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
// - isReconfirmation: 수정 후 재확인 요청 (deadline은 재확인 기한)
// - dateTime · location: 급한 요청 등은 null일 수 있음 (화면에서 숨김)
// - requesterName: 서버 반영 대기 (탈퇴 시 "탈퇴한 사용자", 표시할 이름이 없으면 null)
const toReceivedRequest = (item) => ({
  id: item.requestId,
  isReconfirmation: item.type === RESPONSE_NEEDED_TYPE.RECONFIRMATION,
  requesterName: item.requesterName ?? null,
  typeName: toTypeName(item.helpType),
  dateTime: item.startsAt ?? null,
  location: item.place ?? null,
  deadline: item.deadline ?? null,
});

// 보낸 요청 1개 → SentRequestItem 데이터
// - isNoAssignee: 담당자 없음 여부. 이름이 null인지가 아니라 displayStatus로 판단한다
// - receiverName: 요청 대상 이름 (서버 반영 대기. 담당자 없음이면 서버가 null로 내려줌)
// - deadline: 응답 대기일 때의 응답 기한 (서버 제공 여부 미확정, 없으면 남은 시간 태그 숨김)
const toSentRequest = (item) => ({
  id: item.requestId,
  isNoAssignee: item.displayStatus === REQUEST_DISPLAY_STATUS.NO_ASSIGNEE,
  receiverName: item.targetUserName ?? null,
  typeName: toTypeName(item.helpType),
  dateTime: item.startsAt ?? null,
  deadline: item.responseDeadline ?? null,
});

// 예정 일정 1개 → ScheduleItem 데이터
// - assigneeName: counterpartName(내가 부탁했으면 담당자, 내가 맡았으면 요청자 이름. 서버 반영 대기)
//   없으면 화면에서 "담당자 없음"
const toUpcomingSchedule = (item) => ({
  id: item.requestId,
  dateTime: item.startsAt ?? null,
  typeName: toTypeName(item.helpType),
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
//   - 목록 순서는 서버 정렬을 그대로 사용 (응답 필요: 기한 빠른 순, 보낸 요청·일정: 시작 시각 순)
//   - 보낸 요청은 응답 대기 · 담당자 없음만 남김 (수락됨 · 진행 중은 다가오는 일정에서 확인, 디자인 합의)
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
    sentRequests: (data?.sentOpenItems ?? [])
      .filter((item) =>
        SENT_REQUEST_VISIBLE_STATUS_LIST.includes(item.displayStatus),
      )
      .map(toSentRequest),
    upcomingSchedules: (data?.upcomingSchedules ?? []).map(toUpcomingSchedule),
  };
};