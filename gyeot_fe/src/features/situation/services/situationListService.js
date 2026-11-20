import {
  HELP_TYPE_LABEL,
  SITUATION_REQUEST_COUNT_TAGS,
  SITUATION_ROLE,
} from "@/features/situation/constants/situationConstants";

// 상황 목록 API 응답 → 화면용 데이터 변환 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }
// - 응답 필드명이 바뀌면 이 파일만 수정한다. 화면 컴포넌트는 이 파일이 만든 값만 사용한다.

// 조회자가 상황 주인(OWNER)인지
// - role → isOwner 순으로 확인, 둘 다 아직 응답에 없으면 주인으로 간주 (제안 필드라 구현 전일 수 있음)
const isOwnerSituation = (item) => {
  if (item.role != null) return item.role === SITUATION_ROLE.OWNER;
  return item.isOwner !== false;
};

// requestCounts → 상황 카드 태그 [{ type, count }] (응답에 있는 key만)
const toSituationTags = (requestCounts) => {
  if (!requestCounts) return [];

  return SITUATION_REQUEST_COUNT_TAGS.filter(
    ({ countKey }) => typeof requestCounts[countKey] === "number",
  ).map(({ countKey, tagType }) => ({
    type: tagType,
    count: requestCounts[countKey],
  }));
};

// 진행 중 상황 1개 → SituationCard 데이터
const toSituationCard = (item) => ({
  id: item.situationId,
  title: item.name ?? "",
  startDate: item.startAt,
  endDate: item.endAt,
  participantCount: item.participantCount, // 없으면 SituationCard가 메타에서 숨김
  nextSchedule: item.nextSchedule
    ? {
        dateTime: item.nextSchedule.startsAt,
        assigneeName: item.nextSchedule.assigneeName ?? null,
        typeName: HELP_TYPE_LABEL[item.nextSchedule.helpType] ?? "",
      }
    : null,
  extraScheduleCount: item.remainingScheduleCount ?? 0,
  tags: toSituationTags(item.requestCounts),
});

// 지난 상황 1개 → PastSituationItem 데이터
// - requestCount: 명세에 아직 없는 값이라 없으면 null (화면에서 '요청 N건' 숨김)
const toPastSituation = (item) => ({
  id: item.situationId,
  title: item.name ?? "",
  startDate: item.startAt,
  endDate: item.endAt,
  endedAt: item.endedAt,
  requestCount: item.requestCount ?? null,
  isOwner: item.isOwner ?? null,
  ownerName: item.ownerName ?? null,
  participantCount: item.participantCount ?? null,
});

// 1. 진행 중 상황 목록 → S-00 '진행 중인 상황' 카드 (내가 주인인 상황만)
// → { mySituations: SituationCard 데이터[] } (빈 배열이면 S-00-2 빈 상태)
export const getMySituationsService = (raw) => ({
  mySituations: (raw?.data?.items ?? [])
    .filter(isOwnerSituation)
    .map(toSituationCard),
});

// 2. 지난 상황 목록 → 지난 상황 목록 데이터
// → { pastSituations: PastSituationItem 데이터[], hasNext }
export const getPastSituationsService = (raw) => ({
  pastSituations: (raw?.data?.items ?? []).map(toPastSituation),
  hasNext: raw?.data?.hasNext ?? false,
});
