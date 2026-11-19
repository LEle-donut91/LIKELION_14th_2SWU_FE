import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getReceivedInfoApi } from "@/features/request/api/getApi";
import { getReceivedInfoService } from "@/features/request/services/receivedInfoService";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { INFO_SHARE_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { getErrorCode } from "@/shared/utils/apiError";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// 전달받은 정보 조회 (조회 이력이 남으므로 화면 진입 시에만 새로 조회)
export const useReceivedInfoQuery = (requestId) => {
  const { handleGoBack } = useRequestNav();
  const handledError = useRef(null);
  const query = useQuery({
    queryKey: REQUEST_QUERY_KEYS.receivedInfo(requestId),
    queryFn: () => getReceivedInfoApi(requestId),
    select: getReceivedInfoService,
    enabled: Boolean(requestId),
    refetchOnWindowFocus: false, // 다른 탭/창으로 갔다가 돌아와도 자동 재조회 X
    refetchOnReconnect: false, // 끊겼던 네트워크가 복구됐을 때 자동 재조회 X
    retry: false, // 요청이 실패해도 자동으로 재시도 X
  });

  useEffect(() => {
    if (!query.error) {
      handledError.current = null;
      return;
    }
    if (query.isFetching) return;
    if (
      handledError.current?.error === query.error &&
      handledError.current?.updatedAt === query.errorUpdatedAt
    ) return;

    handledError.current = { error: query.error, updatedAt: query.errorUpdatedAt };

    switch (getErrorCode(query.error)) {
      case INFO_SHARE_ERROR_CODE.SHARED_INFO_NOT_FOUND:
        handleGoBack();
        break;
    }
  }, [query.error, query.errorUpdatedAt, query.isFetching, handleGoBack]);

  return query;
};
