import { useMutation } from "@tanstack/react-query";
import {
  postReconfirmAcceptApi,
  postReconfirmRejectApi,
} from "@/features/request/api/postApi";
import { getErrorMessage } from "@/shared/utils/apiError";

/**
 * [N-05] 변경 내용 확인 - 담당자의 수정안 수락 / 거절
 *  - proposalId가 없거나 처리 중이면 호출되지 않음
 */
export function useReconfirmMutations({
  requestId,
  proposalId,
  showToast,
  onAccepted,
  onRejected,
}) {
  const onError = (error) => showToast(getErrorMessage(error));

  const acceptMutation = useMutation({
    mutationFn: postReconfirmAcceptApi,
    onSuccess: onAccepted,
    onError,
  });
  const rejectMutation = useMutation({
    mutationFn: postReconfirmRejectApi,
    onSuccess: onRejected,
    onError,
  });

  const isProcessing = acceptMutation.isPending || rejectMutation.isPending;

  return {
    acceptReconfirmation: () => {
      if (!proposalId || isProcessing) return;
      acceptMutation.mutate({ requestId, proposalId });
    },
    rejectReconfirmation: () => {
      if (!proposalId || isProcessing) return;
      rejectMutation.mutate({ requestId, proposalId });
    },
  };
}
