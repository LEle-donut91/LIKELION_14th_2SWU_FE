import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchEditApi } from "@/features/request/api/patchApi";
import { patchEditService } from "@/features/request/services/editRequestService";
import { NO_CHANGE_TOAST_MESSAGE } from "@/features/request/constants/messageConstants";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import { COMMON_ERROR_CODE, REQUEST_ERROR_CODE, INFO_SHARE_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { REQUEST_ERROR_TARGET_PAGE } from "@/features/request/constants/requestErrorConstants";
import { REQUEST_SHEET } from "@/features/request/constants/requestFormConstants";
import { useRequestErrorStore } from "@/features/request/stores/useRequestErrorStore";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

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
  onRefreshInformation,
}) {
  const { handleGoBack, handleGoBackTwice } = useRequestNav();
  const setError = useRequestErrorStore((state) => state.setError);
  const resetForm = useRequestFormStore((state) => state.resetForm);
  // main.jsx의 QueryClientProvider에 등록된 같은 클라이언트를 가져온다.
  const queryClient = useQueryClient();

  const returnToStartTimeSheet = () => {
    setError({
      targetPage: REQUEST_ERROR_TARGET_PAGE.EDIT_FORM,
      requestId: String(requestId),
      sheet: REQUEST_SHEET.START,
    });
    handleGoBack();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: patchEditApi,
    onSuccess: async (response) => {
      showToast(response.message);
      // 수정 전 캐시가 다음 수정 폼의 초기값으로 쓰이지 않도록 재조회한다.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: REQUEST_QUERY_KEYS.detail(requestId),
        }),
        queryClient.invalidateQueries({
          queryKey: REQUEST_QUERY_KEYS.informationOptions(
            requestDetail?.data?.helpType,
            requestId,
          ),
        }),
      ]);
      resetForm();
      onSuccess?.(response);
    },
    onError: (error) => {
      showToast(getErrorMessage(error));

      switch (getErrorCode(error)) {
        case COMMON_ERROR_CODE.FORBIDDEN:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_EDITABLE:
          handleGoBackTwice();
          break;
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_ENDED:
          handleGoBackTwice();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NO_CHANGES:
          handleGoBackTwice();
          break;
        case REQUEST_ERROR_CODE.REQUEST_START_TOO_SOON:
          returnToStartTimeSheet();
          break;
        case REQUEST_ERROR_CODE.REQUEST_SCHEDULE_INVALID:
          returnToStartTimeSheet();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PROPOSAL_NO_TIME:
          returnToStartTimeSheet();
          break;
        case INFO_SHARE_ERROR_CODE.SAFETY_INFO_INVALID_SELECTION:
          return onRefreshInformation();
      }
    },
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
