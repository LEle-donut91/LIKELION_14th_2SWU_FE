import { useMutation } from "@tanstack/react-query";
import { postCancelApi } from "@/features/request/api/postApi";
import { getErrorMessage } from "@/shared/utils/apiError";

// 요청 취소 (요청자 뷰) - 요청 상세 / 요청 수정 화면 공용
export function useCancelRequestMutation(requestId, { showToast, onSuccess }) {
  const { mutate, isPending } = useMutation({
    mutationFn: postCancelApi,
    onSuccess,
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const cancelRequest = () => {
    if (isPending) return;
    mutate(requestId);
  };

  return { cancelRequest, isCanceling: isPending };
}
