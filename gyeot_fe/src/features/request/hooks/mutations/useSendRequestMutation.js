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
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import { REQUEST_ERROR_CODE, INFO_SHARE_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { REQUEST_SHEET, REQUEST_FORM_FIELD_KEY } from "@/features/request/constants/requestFormConstants";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";

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
  onRefreshInformation,
}) {
  const { handleGoBack, handleGoNextWithState } = useRequestNav();
  const setCreationError = useRequestFormStore((state) => state.setCreationError);

  const returnFromCreation = (error, correction) => {
    setCreationError({ ...correction, message: getErrorMessage(error) });
    handleGoBack();
  };

  return useMutation({
    mutationFn: (form) =>
      reassignRequestId
        ? postAskAgainApi(postAskAgainService(Number(reassignRequestId), form))
        : postCareRequestApi(postCareRequestService(form)),
    onSuccess: (data) => onSuccess(postCareRequestResultService(data)),
    onError: (error) => {
      showToast(getErrorMessage(error));
      if (reassignRequestId) return;

      switch (getErrorCode(error)) {
        case REQUEST_ERROR_CODE.REQUEST_SITUATION_INVALID:
          returnFromCreation(error, { sheet: REQUEST_SHEET.SITUATION });
          break;
        case REQUEST_ERROR_CODE.REQUEST_SITUATION_ENDED:
          handleGoNextWithState(REQUEST_ROUTES.home, { requestErrorMessage: getErrorMessage(error) }, true);
          break;
        case REQUEST_ERROR_CODE.REQUEST_TARGET_INVALID:
          returnFromCreation(error, { sheet: REQUEST_SHEET.USER });
          break;
        case REQUEST_ERROR_CODE.REQUEST_START_TOO_SOON:
          returnFromCreation(error, { sheet: REQUEST_SHEET.START });
          break;
        case REQUEST_ERROR_CODE.REQUEST_SCHEDULE_INVALID:
          returnFromCreation(error, { sheet: REQUEST_SHEET.START });
          break;
        case REQUEST_ERROR_CODE.REQUEST_DEADLINE_INVALID:
          returnFromCreation(error, { sheet: REQUEST_SHEET.DUE_DATE });
          break;
        case INFO_SHARE_ERROR_CODE.SAFETY_INFO_INVALID_SELECTION:
          onRefreshInformation();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PLACE_TOO_LONG:
          returnFromCreation(error, { field: REQUEST_FORM_FIELD_KEY.LOCATION });
          break;
        case REQUEST_ERROR_CODE.REQUEST_DESCRIPTION_TOO_LONG:
          returnFromCreation(error, { field: REQUEST_FORM_FIELD_KEY.CONTENT });
          break;
      }
    },
  });
}
