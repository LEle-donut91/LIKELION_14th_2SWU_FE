import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSituationApi } from "@/features/situation/api/situationApi";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";
import { getErrorMessage } from "@/shared/utils/apiError";

// H-01 상황 만들기
// - 성공: 상황 관련 조회를 모두 무효화(S-00 목록 갱신) 후 onSuccess(situationId)
// - 실패: 서버 안내 문구로 토스트
export function useCreateSituationMutation({ showToast, onSuccess }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createSituationApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: SITUATION_QUERY_KEYS.all() });
      onSuccess?.(response.data?.situationId);
    },
    onError: (error) => {
      showToast(getErrorMessage(error));
    },
  });

  const createSituation = (body) => {
    if (isPending) return; // 중복 클릭 방지
    mutate(body);
  };

  return { createSituation, isCreating: isPending };
}
