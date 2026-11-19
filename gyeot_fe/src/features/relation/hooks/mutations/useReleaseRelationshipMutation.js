import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRelationshipApi } from "@/features/relation/api/relationshipApi";
import { RELATION_QUERY_KEYS } from "@/features/relation/constants/relationQueryKeys";
import { getErrorMessage } from "@/shared/utils/apiError";

// 관계 해제 (N-08)
// - 성공·실패 모두 관계 목록을 다시 조회 (실패 404·409도 명세상 "목록을 다시 조회")
export function useReleaseRelationshipMutation({ showToast, onSuccess }) {
  const queryClient = useQueryClient();

  const refetchRelationships = () =>
    queryClient.invalidateQueries({ queryKey: RELATION_QUERY_KEYS.relationships() });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteRelationshipApi,
    onSuccess: () => {
      refetchRelationships();
      onSuccess?.();
    },
    onError: (error) => {
      showToast(getErrorMessage(error));
      refetchRelationships();
    },
  });

  const release = (relationshipId) => {
    if (isPending) return; // 중복 클릭 방지
    mutate(relationshipId);
  };

  return { release, isReleasing: isPending };
}