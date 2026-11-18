import { useMutation } from "@tanstack/react-query";
import { patchEditApi } from "@/features/request/api/patchApi";
import { patchEditService } from "@/features/request/services/editRequestService";
import { NO_CHANGE_TOAST_MESSAGE } from "@/features/request/constants/messageConstants";
import { getErrorMessage } from "@/shared/utils/apiError";

/**
 * [H-03-01-02] 요청 수정 - 변경된 필드만 PATCH
 *  - 기존 요청(requestDetail)/공개 항목(informationOptions)과 비교해 payload를 만들고,
 *    바뀐 게 없으면 API를 호출하지 않고 토스트만 띄움
 */
export function useEditRequestMutation({
  requestId,
  requestDetail,
  informationOptions,
  showToast,
  onSuccess,
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: patchEditApi,
    onSuccess,
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const editRequest = (requestForm) => {
    if (isPending) return;
    const params = patchEditService(
      requestId,
      requestForm,
      requestDetail,
      informationOptions,
    );
    if (Object.keys(params.payload).length === 0) {
      showToast(NO_CHANGE_TOAST_MESSAGE);
      return;
    }
    mutate(params);
  };

  return { editRequest, isEditing: isPending };
}
