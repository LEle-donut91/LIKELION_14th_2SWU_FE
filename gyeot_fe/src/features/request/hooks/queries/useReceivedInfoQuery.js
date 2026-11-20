import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getReceivedInfoApi } from "@/features/request/api/getApi";
import { getReceivedInfoService } from "@/features/request/services/receivedInfoService";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { INFO_SHARE_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// 전달받은 정보 조회 (조회 이력이 남으므로 화면 진입 시에만 새로 조회)
export const useReceivedInfoQuery = (requestId, { showToast } = {}) => {
  const { handleGoBack } = useRequestNav();
  const handledError = useRef(null);
  const query = useQuery({
    queryKey: REQUEST_QUERY_KEYS.receivedInfo(requestId),
    queryFn: () => getReceivedInfoApi(requestId),
    select: getReceivedInfoService,
    enabled: Boolean(requestId),
    // 재진입 시, 즉, 해당 화면에 들어와 컴포넌트가 새로 마운트될 때 현재 접근 권한을 반드시 다시 조회 O
    // 이미 접근이 종료된 이전 캐시 정보가 보이는 것을 방지하기 위함
    refetchOnMount: "always",

    // 다른 탭/창으로 갔다가 돌아와도 자동 재조회 X
    refetchOnWindowFocus: false, 

    // 인터넷이 끊겼다가 다시 연결될 때, API 요청이 실패했을 때 -> 자동 재조회 O
  });

  useEffect(() => {
    if (!query.error) {
      handledError.current = null;
      return;
    }
    if (query.isFetching || !showToast) return;
    if (
      handledError.current?.error === query.error &&
      handledError.current?.updatedAt === query.errorUpdatedAt
    ) return;

    handledError.current = { error: query.error, updatedAt: query.errorUpdatedAt };
    showToast(getErrorMessage(query.error));

    switch (getErrorCode(query.error)) {
      case INFO_SHARE_ERROR_CODE.SHARED_INFO_NOT_FOUND:
        handleGoBack();
        break;
    }
  }, [query.error, query.errorUpdatedAt, query.isFetching, handleGoBack, showToast]);

  return query;
};
