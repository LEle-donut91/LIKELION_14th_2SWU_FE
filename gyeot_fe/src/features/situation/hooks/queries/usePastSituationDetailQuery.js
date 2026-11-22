import { useQuery } from "@tanstack/react-query";
import { getPastSituationDetailApi } from "@/features/situation/api/situationApi";
import { getPastSituationDetailService } from "@/features/situation/services/pastSituationDetailService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// N-04 지난 상황 상세
// - situationId가 없으면 요청하지 않음
// → data: getPastSituationDetailService 결과
export const usePastSituationDetailQuery = (situationId) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.pastDetail(situationId),
    queryFn: () => getPastSituationDetailApi(situationId),
    select: getPastSituationDetailService,
    enabled: Boolean(situationId),
  });
