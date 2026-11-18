import { useMutation } from "@tanstack/react-query";
import {
  postCareRequestApi,
  postAskAgainApi,
} from "@/features/request/api/postApi";
import {
  postCareRequestService,
  postCareRequestResultService,
} from "@/features/request/services/createRequestService";
import { postAskAgainService } from "@/features/request/services/askAgainService";
import { getErrorMessage } from "@/shared/utils/apiError";

/**
 * [H-03-02-01] 요청 보내기 (새 요청 / 다시 부탁하기)
 *  - reassignRequestId가 있으면 다시 부탁하기 API, 없으면 새 요청 API 호출
 *  - onSuccess에는 생성 결과({ requestId })가 전달됨
 *
 * 사용 예:
 *   const { mutate: sendRequest, isPending } = useSendRequestMutation({ ... });
 *   sendRequest(requestForm);
 */
export function useSendRequestMutation({
  reassignRequestId,
  showToast,
  onSuccess,
}) {
  return useMutation({
    mutationFn: (form) =>
      reassignRequestId
        ? postAskAgainApi(postAskAgainService(Number(reassignRequestId), form))
        : postCareRequestApi(postCareRequestService(form)),
    onSuccess: (data) => onSuccess(postCareRequestResultService(data)),
    onError: (error) => showToast(getErrorMessage(error)),
  });
}
