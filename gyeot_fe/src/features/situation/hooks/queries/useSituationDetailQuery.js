import { useQuery } from "@tanstack/react-query";
import { getSituationDetailApi } from "@/features/situation/api/situationApi";
import { getSituationDetailService } from "@/features/situation/services/situationDetailService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// H-03 상황 상세
// - situationId가 없으면 요청하지 않음
// - mockScenario: 목업 시나리오 (USE_MOCK일 때만 사용)
// → data: getSituationDetailService 결과
export const useSituationDetailQuery = (situationId, { mockScenario } = {}) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.detail(situationId, { mockScenario }),
    queryFn: () => getSituationDetailApi(situationId, { mockScenario }),
    select: getSituationDetailService,
    enabled: Boolean(situationId),
  });
