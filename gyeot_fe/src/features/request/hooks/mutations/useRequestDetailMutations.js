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
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { COMMON_ERROR_CODE, REQUEST_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";

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
  const { handleGoBack } = useRequestNav();
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
    onError: (error) => {
      onError(error);

      switch (getErrorCode(error)) {
        case COMMON_ERROR_CODE.FORBIDDEN:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_WITHDRAWABLE:
          return refreshDetail();
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_ENDED:
          return refreshDetail();
      }
    },
  });
  const withdrawProposalMutation = useMutation({
    mutationFn: postEditWithdrawApi,
    onSuccess: refreshDetail,
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
          return refreshDetail();
        case REQUEST_ERROR_CODE.REQUEST_PROPOSAL_NOT_PENDING:
          return refreshDetail();
      }
    },
  });
  const startMutation = useMutation({
    mutationFn: postStartApi,
    onSuccess: refreshDetail,
    onError: (error) => {
      onError(error);

      switch (getErrorCode(error)) {
        case COMMON_ERROR_CODE.FORBIDDEN:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_STARTED:
          return refreshDetail();
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_ENDED:
          return refreshDetail();
      }
    },
  });
  const doneMutation = useMutation({
    mutationFn: postDoneApi,
    onSuccess: refreshDetail,
    onError: (error) => {
      onError(error);

      switch (getErrorCode(error)) {
        case COMMON_ERROR_CODE.FORBIDDEN:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_STARTED:
          return refreshDetail();
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_ENDED:
          return refreshDetail();
      }
    },
  });
  const respondMutation = useMutation({
    mutationFn: postResponseApi,
    onSuccess: refreshDetail,
    onError: (error) => {
      onError(error);

      switch (getErrorCode(error)) {
        case COMMON_ERROR_CODE.FORBIDDEN:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_ASSIGNMENT_CLOSED:
          return refreshDetail();
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_ACCEPTED:
          return refreshDetail();
        case REQUEST_ERROR_CODE.REQUEST_RESPONSE_NOT_CHANGEABLE:
          return refreshDetail();
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_ENDED:
          return refreshDetail();
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_STARTED:
          return refreshDetail();
      }
    },
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
