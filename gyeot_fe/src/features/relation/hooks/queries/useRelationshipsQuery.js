import { useQuery } from "@tanstack/react-query";
import { getRelationshipsApi } from "@/features/relation/api/relationshipApi";
import { getRelationshipsService } from "@/features/relation/services/relationshipService";
import { RELATION_QUERY_KEYS } from "@/features/relation/constants/relationQueryKeys";

// 활성 관계 목록 (R-00 관계, R-02 지인 상세)
// → data: { guardians, myPeople }
export const useRelationshipsQuery = () =>
  useQuery({
    queryKey: RELATION_QUERY_KEYS.relationships(),
    queryFn: getRelationshipsApi,
    select: getRelationshipsService,
  });