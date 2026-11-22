import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postStartApi,
  postDoneApi,
  postAcceptWithdrawApi,
  postEditWithdrawApi,
  postResponseApi,
} from "@/features/request/api/postApi";
import { invalidateRequestQueries } from "@/features/request/hooks/queries/invalidateRequestQueries";
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

  // 상세와 해당 요청의 공개 항목 선택지를 함께 갱신한다.
  const refreshDetail = () => invalidateRequestQueries(queryClient, requestId);

  // 에러 메시지를 토스트로 출력
  const onError = (error) => showToast(getErrorMessage(error));

  // 요청 취소 API
  const cancelMutation = useCancelRequestMutation(requestId, {
    showToast,
    onSuccess: refreshDetail, // 요청 상세 화면에서 호출하므로, 성공 시 요청 상세 재조회
  });

  // 수락 철회 API
  const withdrawAcceptanceMutation = useMutation({
    mutationFn: postAcceptWithdrawApi,

    // API 호출 성공 시
    onSuccess: async (result) => {
      // null이 아닐 때만 성공 응답 메시지 출력
      if (result.message) {
        showToast(result.message);
      }
      await refreshDetail();
      onAcceptanceWithdrawn(); // 인자로 받은 함수 실행 (홈으로 이동)
    },

    // API 호출 실패 시
    onError: (error) => {
      onError(error); // 에러 메시지를 토스트로 출력

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

  // 수정안 철회 API
  const withdrawProposalMutation = useMutation({
    mutationFn: postEditWithdrawApi,
    // API 호출 성공 시
    onSuccess: (result) => {
      // null이 아닐 때만 성공 응답 메시지 출력
      if (result.message) {
        showToast(result.message);
      }
      return refreshDetail();
    },

    // API 호출 실패 시
    onError: (error) => {
      onError(error); // 에러 메시지를 토스트로 출력

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

  // 돌봄 시작 API
  const startMutation = useMutation({
    mutationFn: postStartApi,

    // API 호출 성공 시
    onSuccess: (result) => {
      // null이 아닐 때만 성공 응답 메시지 출력
      if (result.message) {
        showToast(result.message);
      }
      return refreshDetail();
    },

    // API 호출 실패 시
    onError: (error) => {
      onError(error); // 에러 메시지를 토스트로 출력

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

  // 돌봄 완료 API
  const doneMutation = useMutation({
    mutationFn: postDoneApi,

    // API 호출 성공 시
    onSuccess: (result) => {
      // null이 아닐 때만 성공 응답 메시지 출력
      if (result.message) {
        showToast(result.message);
      }
      return refreshDetail();
    },

    // API 호출 실패 시
    onError: (error) => {
      onError(error); // 에러 메시지를 토스트로 출력

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

  // 요청 응답 API
  const respondMutation = useMutation({
    mutationFn: postResponseApi,
    // API 호출 성공 시
    onSuccess: (result) => {
      if (result.message) {
        // null이 아닐 때만 토스트 메시지 출력 (어려움·확인 후 답변이면 null로 오기 때문에)
        showToast(result.message);
      }
      return refreshDetail(); // "도움 요청 상세 조회" 다시 호출
    },
    // API 호출 에러 발생 시
    onError: (error) => {
      onError(error); // 에러 메시지를 토스트로 출력

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
    // 요청 취소
    cancelRequest: () => {
      if (cancelMutation.isPending) return;
      cancelMutation.mutate(requestId);
    },

    // 수락 철회
    withdrawAcceptance: () => {
      if (withdrawAcceptanceMutation.isPending) return; // 수락 철회 요청 처리 중이면 무시
      withdrawAcceptanceMutation.mutate(requestId); // 수락 철회 API
    },

    // 수정안 철회
    withdrawProposal: (proposalId) => {
      if (!proposalId || withdrawProposalMutation.isPending) return; // proposalId가 없거나 수정안 철회 중이면 무시
      withdrawProposalMutation.mutate({ requestId, proposalId }); // 수정안 철회 API
    },

    // 시작/완료는 서로의 진행 중에도 누를 수 없음
    // 돌봄 시작
    startCare: () => {
      if (startMutation.isPending || doneMutation.isPending) return; // 시작/완료 진행 중에는 무시
      startMutation.mutate(requestId); // 돌봄 시작 API
    },

    // 돌봄 완료
    completeCare: () => {
      if (startMutation.isPending || doneMutation.isPending) return; // 시작/완료 진행 중에는 무시
      doneMutation.mutate(requestId); // 돌봄 완료 API
    },

    // 요청 응답 API
    // response: RESPONSE_STATUS (보류 / 어려움 / 가능)
    respondToRequest: (response) => {
      if (respondMutation.isPending) return; // 응답 요청이 진행 중이면 추가 호출을 막음
      respondMutation.mutate({ requestId, response });
    },
  };
}
