import { useMutation } from "@tanstack/react-query";
import {
  postReconfirmAcceptApi,
  postReconfirmRejectApi,
} from "@/features/request/api/postApi";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import { COMMON_ERROR_CODE, REQUEST_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

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
  const { handleGoBack } = useRequestNav();
  const onError = (error) => showToast(getErrorMessage(error));

  const acceptMutation = useMutation({
    mutationFn: postReconfirmAcceptApi,
    onSuccess: onAccepted,
    onError: (error) => {
      onError(error);

      switch (getErrorCode(error)) {
        case COMMON_ERROR_CODE.FORBIDDEN:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PROPOSAL_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PROPOSAL_NOT_PENDING:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PROPOSAL_EXPIRED:
          handleGoBack();
          break;
      }
    },
  });
  const rejectMutation = useMutation({
    mutationFn: postReconfirmRejectApi,
    onSuccess: onRejected,
    onError: (error) => {
      onError(error);

      switch (getErrorCode(error)) {
        case COMMON_ERROR_CODE.FORBIDDEN:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PROPOSAL_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PROPOSAL_NOT_PENDING:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PROPOSAL_EXPIRED:
          handleGoBack();
          break;
      }
    },
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
