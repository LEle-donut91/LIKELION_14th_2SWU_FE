import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchPath, useLocation } from "react-router-dom";
import { postCancelApi } from "@/features/request/api/postApi";
import { REQUEST_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";

// 요청 취소 (요청자 뷰) - 요청 상세 / 요청 수정 화면 공용
export function useCancelRequestMutation(requestId, { showToast, onSuccess }) {
  const { pathname } = useLocation();
  const { handleGoBack } = useRequestNav();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postCancelApi,
    onSuccess,
    onError: (error) => {
      showToast(getErrorMessage(error));

      switch (getErrorCode(error)) {
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

  const cancelRequest = () => {
    if (isPending) return;
    mutate(requestId);
  };

  return { cancelRequest, isCanceling: isPending };
}
