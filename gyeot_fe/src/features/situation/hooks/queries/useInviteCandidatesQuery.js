import { useQuery } from "@tanstack/react-query";
import { getRelationshipsApi } from "@/features/situation/api/relationshipApi";
import { getInviteCandidatesService } from "@/features/situation/services/situationManageService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// H-03-05 참여자 추가 시트의 지인 목록 (활성 관계 목록)
// - enabled: 정보 주인일 때만 조회
// → data: { people: [{ id(userId), name, relationText, isGuardian }] }
export const useInviteCandidatesQuery = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.relationships(),
    queryFn: getRelationshipsApi,
    select: getInviteCandidatesService,
    enabled,
  });
