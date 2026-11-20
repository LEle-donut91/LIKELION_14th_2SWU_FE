import { useQuery } from "@tanstack/react-query";
import { getRelationshipsApi } from "@/features/situation/api/relationshipApi";
import { getParticipantCandidatesService } from "@/features/situation/services/situationCreateService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// H-01 '참여할 지인' 후보 (활성 관계 목록)
// → data: { people: [{ id(userId), name, relation, isGuardian }] }
export const useParticipantCandidatesQuery = () =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.relationships(),
    queryFn: getRelationshipsApi,
    select: getParticipantCandidatesService,
  });
