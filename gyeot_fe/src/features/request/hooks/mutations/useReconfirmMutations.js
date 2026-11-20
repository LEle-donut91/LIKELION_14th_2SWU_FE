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
  onRejectError,
}) {
  const { handleGoBack } = useRequestNav();
  const onError = (error) => showToast(getErrorMessage(error)); // 에러 토스트 메시지 출력

  // 재확인 수락 API
  const acceptMutation = useMutation({
    mutationFn: postReconfirmAcceptApi,

    // API 호출 성공 시
    onSuccess: (result) => {
      if (result.message) {
        // null이 아닐 때만 토스트 메시지 출력
        showToast(result.message);
      }
      onAccepted(); // 콜백 실행 (이전 페이지로 이동)
    },

    // API 호출 실패 시
    onError: (error) => {
      onError(error); // 에러 토스트 메시지 출력

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

  // 재확인 거절 API
  const rejectMutation = useMutation({
    mutationFn: postReconfirmRejectApi,

    // API 호출 성공 시
    onSuccess: (result) => {
      // null이 아닐 때만 토스트 메시지 출력
      if (result.message) {
        showToast(result.message);
      }
      onRejected(); // 콜백 실행 (모달 닫고 홈으로 이동)
    },

    // API 호출 실패 시
    onError: (error) => {
      onRejectError?.(); // 콜백 실행 (모달을 닫아 에러 토스트가 가려지지 않도록 처리)
      onError(error); // 에러 토스트 메시지 출력

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

  return {
    // 재확인 수락
    acceptReconfirmation: () => {
      // 이미 처리 중이거나 proposalId가 없으면 무시
      if (!proposalId || acceptMutation.isPending || rejectMutation.isPending) return;
      acceptMutation.mutate({ requestId, proposalId }); // 재확인 수락 API
    },

    // 재확인 거절
    rejectReconfirmation: () => {
      // 이미 처리 중이거나 proposalId가 없으면 무시
      if (!proposalId || acceptMutation.isPending || rejectMutation.isPending) return;
      rejectMutation.mutate({ requestId, proposalId }); // 재확인 거절 API
    },
  };
}
