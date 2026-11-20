import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchPath, useLocation } from "react-router-dom";
import { postCancelApi } from "@/features/request/api/postApi";
import { COMMON_ERROR_CODE, REQUEST_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";

// 요청 취소 (요청자 뷰) - 요청 상세 / 요청 수정 화면 공용
export function useCancelRequestMutation(requestId, { showToast, onSuccess }) {
  const { pathname } = useLocation();
  const { handleGoBack } = useRequestNav();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCancelApi,

    // API 호출 성공 시
    onSuccess: (result, ...args) => {
      if (result.message) {
        // null이 아닐 때만 성공 토스트 메시지 출력
        showToast(result.message);
      }

      // 성공 콜백이 있다면 실행 (요청 상세는 요청 상세 재조회, 요청 수정은 뒤로 가기)
      return onSuccess?.(result, ...args);
    },

    // API 호출 실패 시
    onError: (error) => {
      showToast(getErrorMessage(error)); // 토스트 에러 메시지 출력

      switch (getErrorCode(error)) {
        case COMMON_ERROR_CODE.FORBIDDEN:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
          handleGoBack();
          break;
        case REQUEST_ERROR_CODE.REQUEST_ALREADY_ENDED:
          if (matchPath(REQUEST_ROUTES.editForm(":id"), pathname)) {
            handleGoBack();
          } else if (matchPath(REQUEST_ROUTES.detail(":id"), pathname)) {
            return queryClient.invalidateQueries({
              queryKey: REQUEST_QUERY_KEYS.detail(requestId),
            });
          }
          break;
      }
    },
  });
}
