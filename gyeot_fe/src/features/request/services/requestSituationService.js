import { formatDateRange } from "@/shared/utils/dateFormat";
import { SITUATION_STATUS } from "@/features/request/constants/enumConstants";


// 진행 중 상황 목록 조회 - 응답 데이터 가공
export const getSituationService = (raw) => ({
  situation: (raw?.data?.items ?? [])
    .filter((item) => item.status === SITUATION_STATUS.ACTIVE)
    .map((item) => ({
      id: String(item.situationId),
      title: item.name,
      startDate: item.startAt,
      endDate: item.endAt,
      dateRangeText: formatDateRange(item.startAt, item.endAt),
      joinCount: item.participantCount,
    })),
});
