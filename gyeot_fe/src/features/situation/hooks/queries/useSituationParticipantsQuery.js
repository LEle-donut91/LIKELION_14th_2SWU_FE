import { useQuery } from "@tanstack/react-query";
import { getSituationParticipantsApi } from "@/features/situation/api/situationApi";
import { getSituationParticipantsService } from "@/features/situation/services/situationDetailService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// 상황 참여자 목록 (H-03 상황 상세 상단 카드 · 참여자 태그, H-03-05 상황 관리 참여자 목록)
// - situationId가 없으면 요청하지 않음
// - mockScenario: 목업 시나리오 (USE_MOCK일 때만 사용)
// → data: { ownerName, participants }
export const useSituationParticipantsQuery = (situationId, { mockScenario } = {}) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.participants(situationId, { mockScenario }),
    queryFn: () => getSituationParticipantsApi(situationId, { mockScenario }),
    select: getSituationParticipantsService,
    enabled: Boolean(situationId),
  });
