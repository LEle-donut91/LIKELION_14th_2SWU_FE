import { useQuery } from "@tanstack/react-query";
import { getSituationParticipantsApi } from "@/features/situation/api/situationApi";
import { getSituationParticipantsService } from "@/features/situation/services/situationDetailService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// 상황 참여자 목록 (H-03 상황 상세 상단 카드 · 참여자 태그)
// - situationId가 없으면 요청하지 않음
// → data: { ownerName, participants }
export const useSituationParticipantsQuery = (situationId) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.participants(situationId),
    queryFn: () => getSituationParticipantsApi(situationId),
    select: getSituationParticipantsService,
    enabled: Boolean(situationId),
  });
