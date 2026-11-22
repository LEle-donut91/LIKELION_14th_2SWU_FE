import { useQuery } from "@tanstack/react-query";
import { getRelationshipsApi } from "@/features/situation/api/relationshipApi";
import { getPastSituationPeopleService } from "@/features/situation/services/situationListService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// H-04 사람 선택 시트의 사람 목록 (현재 활성 관계 목록을 임시 사용)
// → data: { people: [{ id(userId), name, isGuardian }] }
export const usePastSituationPeopleQuery = () =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.relationships(),
    queryFn: getRelationshipsApi,
    select: getPastSituationPeopleService,
  });
