import { useQuery } from "@tanstack/react-query";
import { getReceivedSharingsApi } from "@/features/relation/api/receivedSharingApi";
import { getReceivedSharingsService } from "@/features/relation/services/sharedInfoService";
import { RELATION_QUERY_KEYS } from "@/features/relation/constants/relationQueryKeys";

// 이 사람에게 받은 정보 (R-02-01 받은 정보)
// - userId가 없으면 요청하지 않음
// → data: [{ id, requestId, title, startAt, endAt, items }]
export const useReceivedSharingsQuery = (userId) =>
  useQuery({
    queryKey: RELATION_QUERY_KEYS.receivedSharings(userId),
    queryFn: () => getReceivedSharingsApi(userId),
    select: getReceivedSharingsService,
    enabled: Boolean(userId),
  });
