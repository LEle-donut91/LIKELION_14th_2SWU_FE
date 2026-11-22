import { formatDateRange } from "@/shared/utils/dateFormat";

// 홈 통합 조회 API 관련 (요청 작성 시 상황 목록을 가져오기 위함)
export const getSituationService = (raw) => ({
  situation: (raw?.data?.situationCards?.my ?? [])
    .map((item) => ({
      id: String(item.situationId),
      title: item.name,
      startDate: item.startAt,
      endDate: item.endAt,
      dateRangeText: formatDateRange(item.startAt, item.endAt),
      joinCount: item.participantCount,
    })),
});
