import { useQuery } from "@tanstack/react-query";
import { getPastSituationsApi } from "@/features/situation/api/situationApi";
import { getPastSituationsService } from "@/features/situation/services/situationListService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// 지난 상황 목록 한 페이지 (S-00 하단 미리보기)
// - params: { page, size, filter, personId, mockScenario }
// → data: { pastSituations, hasNext }
export const usePastSituationsQuery = (params = {}) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.pastList(params),
    queryFn: () => getPastSituationsApi(params),
    select: getPastSituationsService,
  });
