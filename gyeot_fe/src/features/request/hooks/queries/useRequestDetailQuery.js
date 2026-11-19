import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getRequestDetailApi } from "@/features/request/api/getApi";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { REQUEST_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { getErrorCode } from "@/shared/utils/apiError";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

/**
 * 요청 상세 조회 (같은 queryKey를 쓰는 화면끼리 캐시 공유, 화면별 가공은 select로)
 *
 * 사용 예:
 *   useRequestDetailQuery(paramId, { select: getRequestDetailService });
 */
export const useRequestDetailQuery = (requestId, { select } = {}) => {
  const { handleGoBack } = useRequestNav();
  const handledError = useRef(null);
  const query = useQuery({
    queryKey: REQUEST_QUERY_KEYS.detail(requestId),
    queryFn: () => getRequestDetailApi(requestId),
    select,
    enabled: Boolean(requestId),
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
      case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
        handleGoBack();
        break;
    }
  }, [query.error, query.errorUpdatedAt, query.isFetching, handleGoBack]);

  return query;
};
