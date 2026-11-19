import { useQuery } from "@tanstack/react-query";
import { getInvitationApi } from "@/features/relation/api/invitationApi";
import { getInvitationService } from "@/features/relation/services/invitationService";
import { RELATION_QUERY_KEYS } from "@/features/relation/constants/relationQueryKeys";

// 초대 링크 정보 (R-03 받은 초대, A-01 초대 진입, 초대 링크 진입)
// - token이 없으면 요청하지 않음
// → data: { type, inviterId, inviterName, message, status, expiresAt }
export const useInvitationQuery = (token) =>
  useQuery({
    queryKey: RELATION_QUERY_KEYS.invitation(token),
    queryFn: () => getInvitationApi(token),
    select: getInvitationService,
    enabled: Boolean(token),
  });
