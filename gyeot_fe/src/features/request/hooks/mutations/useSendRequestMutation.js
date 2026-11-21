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
import { COMMON_ERROR_CODE, REQUEST_ERROR_CODE, INFO_SHARE_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { REQUEST_SHEET, REQUEST_FORM_FIELD_KEY } from "@/features/request/constants/requestFormConstants";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_ERROR_TARGET_PAGE } from "@/features/request/constants/requestErrorConstants";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestErrorStore } from "@/features/request/stores/useRequestErrorStore";

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
  const { handleGoBack, handleGoNext } = useRequestNav();
  const setError = useRequestErrorStore((state) => state.setError);

  const returnFromCreation = (correction) => {
    setError({ ...correction, targetPage: REQUEST_ERROR_TARGET_PAGE.REQUEST });
    handleGoBack();
  };

  const returnFromReassignment = (correction, targetPage = REQUEST_ERROR_TARGET_PAGE.ASK_AGAIN) => {
    setError({
      ...correction,
      targetPage,
      requestId: String(reassignRequestId),
    });
    handleGoBack();
  };

  return useMutation({
    mutationFn: (form) => {
      if (reassignRequestId) {
        const { message, ...request } = postAskAgainService(Number(reassignRequestId), form);
        if (message) showToast(message);
        return postAskAgainApi(request);
      }
      const { payload, message } = postCareRequestService(form);
      if (message) showToast(message);
      return postCareRequestApi(payload);
    },
    onSuccess: (data) => onSuccess(postCareRequestResultService(data)),
    onError: (error) => {
      showToast(getErrorMessage(error));
      if (reassignRequestId) {
        switch (getErrorCode(error)) {
          case COMMON_ERROR_CODE.FORBIDDEN:
            handleGoBack();
            break;
          case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
            handleGoNext(REQUEST_ROUTES.home, true);
            break;
          case REQUEST_ERROR_CODE.REQUEST_NOT_REASSIGNABLE:
            returnFromReassignment({}, REQUEST_ERROR_TARGET_PAGE.REQUEST_DETAIL);
            break;
          case REQUEST_ERROR_CODE.REQUEST_ALREADY_STARTED:
            returnFromReassignment({}, REQUEST_ERROR_TARGET_PAGE.REQUEST_DETAIL);
            break;
          case REQUEST_ERROR_CODE.REQUEST_ALREADY_ENDED:
            returnFromReassignment({}, REQUEST_ERROR_TARGET_PAGE.REQUEST_DETAIL);
            break;
          case REQUEST_ERROR_CODE.REQUEST_TARGET_INVALID:
            returnFromReassignment({ sheet: REQUEST_SHEET.USER, clearSelectedUser: true });
            break;
          case REQUEST_ERROR_CODE.REQUEST_TARGET_ALREADY_ASSIGNED:
            returnFromReassignment({ sheet: REQUEST_SHEET.USER, clearSelectedUser: true });
            break;
          case REQUEST_ERROR_CODE.REQUEST_DEADLINE_INVALID:
            returnFromReassignment({ sheet: REQUEST_SHEET.DUE_DATE });
            break;
          case INFO_SHARE_ERROR_CODE.SAFETY_INFO_INVALID_SELECTION:
            onRefreshInformation();
            break;
        }
        return;
      }

      switch (getErrorCode(error)) {
        case REQUEST_ERROR_CODE.REQUEST_SITUATION_INVALID:
          returnFromCreation({ sheet: REQUEST_SHEET.SITUATION });
          break;
        case REQUEST_ERROR_CODE.REQUEST_SITUATION_ENDED:
          handleGoNext(REQUEST_ROUTES.home, true);
          break;
        case REQUEST_ERROR_CODE.REQUEST_TARGET_INVALID:
          returnFromCreation({ sheet: REQUEST_SHEET.USER });
          break;
        case REQUEST_ERROR_CODE.REQUEST_START_TOO_SOON:
          returnFromCreation({ sheet: REQUEST_SHEET.START });
          break;
        case REQUEST_ERROR_CODE.REQUEST_SCHEDULE_INVALID:
          returnFromCreation({ sheet: REQUEST_SHEET.START });
          break;
        case REQUEST_ERROR_CODE.REQUEST_DEADLINE_INVALID:
          returnFromCreation({ sheet: REQUEST_SHEET.DUE_DATE });
          break;
        case INFO_SHARE_ERROR_CODE.SAFETY_INFO_INVALID_SELECTION:
          onRefreshInformation();
          break;
        case REQUEST_ERROR_CODE.REQUEST_PLACE_TOO_LONG:
          returnFromCreation({ field: REQUEST_FORM_FIELD_KEY.LOCATION });
          break;
        case REQUEST_ERROR_CODE.REQUEST_DESCRIPTION_TOO_LONG:
          returnFromCreation({ field: REQUEST_FORM_FIELD_KEY.CONTENT });
          break;
      }
    },
  });
}
