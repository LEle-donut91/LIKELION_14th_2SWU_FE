import { formatDateRange } from "@/shared/utils/dateFormat";
import {
  SITUATION_STATUS,
  SITUATION_ROLE,
} from "@/features/request/constants/enumConstants";


// 진행 중 상황 목록 조회 - 응답 데이터 가공
export const getSituationService = (raw) => ({
  situation: (raw?.data?.items ?? [])
    .filter((item) =>
      item.status === SITUATION_STATUS.ACTIVE &&
      // 역할 필드가 제공될 때만 소유자 여부를 판별한다.
      (item.role != null ? item.role === SITUATION_ROLE.OWNER : item.isOwner !== false),
    )
    .map((item) => ({
      id: String(item.situationId),
      title: item.name,
      startDate: item.startAt,
      endDate: item.endAt,
      dateRangeText: formatDateRange(item.startAt, item.endAt),
      joinCount: item.participantCount ?? null,
    })),
});
