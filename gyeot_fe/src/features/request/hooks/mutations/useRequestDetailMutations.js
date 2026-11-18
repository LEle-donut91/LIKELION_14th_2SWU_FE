import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postStartApi,
  postDoneApi,
  postAcceptWithdrawApi,
  postEditWithdrawApi,
  postResponseApi,
} from "@/features/request/api/postApi";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { useCancelRequestMutation } from "@/features/request/hooks/mutations/useCancelRequestMutation";
import { getErrorMessage } from "@/shared/utils/apiError";

/**
 * [H-03-01] 요청 상세 - 역할별 액션(취소/수락 철회/수정안 철회/시작/완료/응답) 모음
 *  - requestId는 훅이 들고 있으므로 화면에서는 액션만 호출하면 됨
 *  - 중복 클릭 방지(isPending 체크)도 훅 안에서 처리
 *  - 성공하면 요청 상세 쿼리를 무효화해 최신 상태로 다시 조회
 *  - 수락 철회만 화면 이동이 필요하므로 onAcceptanceWithdrawn으로 받음
 */
export function useRequestDetailMutations(
  requestId,
  { showToast, onAcceptanceWithdrawn },
) {
  const queryClient = useQueryClient();
  const refreshDetail = () =>
    queryClient.invalidateQueries({
      queryKey: REQUEST_QUERY_KEYS.detail(requestId),
    });
  const onError = (error) => showToast(getErrorMessage(error));

  const { cancelRequest } = useCancelRequestMutation(requestId, {
    showToast,
    onSuccess: refreshDetail,
  });

  const withdrawAcceptanceMutation = useMutation({
    mutationFn: postAcceptWithdrawApi,
    onSuccess: onAcceptanceWithdrawn,
    onError,
  });
  const withdrawProposalMutation = useMutation({
    mutationFn: postEditWithdrawApi,
    onSuccess: refreshDetail,
    onError,
  });
  const startMutation = useMutation({
    mutationFn: postStartApi,
    onSuccess: refreshDetail,
    onError,
  });
  const doneMutation = useMutation({
    mutationFn: postDoneApi,
    onSuccess: refreshDetail,
    onError,
  });
  const respondMutation = useMutation({
    mutationFn: postResponseApi,
    onSuccess: refreshDetail,
    onError,
  });

  return {
    cancelRequest,

    withdrawAcceptance: () => {
      if (withdrawAcceptanceMutation.isPending) return;
      withdrawAcceptanceMutation.mutate(requestId);
    },

    withdrawProposal: (proposalId) => {
      if (!proposalId || withdrawProposalMutation.isPending) return;
      withdrawProposalMutation.mutate({ requestId, proposalId });
    },

    // 시작/완료는 서로의 진행 중에도 누를 수 없음
    startCare: () => {
      if (startMutation.isPending || doneMutation.isPending) return;
      startMutation.mutate(requestId);
    },
    completeCare: () => {
      if (startMutation.isPending || doneMutation.isPending) return;
      doneMutation.mutate(requestId);
    },

    // response: RESPONSE_STATUS (보류 / 어려움 / 가능)
    respondToRequest: (response) => {
      if (respondMutation.isPending) return;
      respondMutation.mutate({ requestId, response });
    },
  };
}
