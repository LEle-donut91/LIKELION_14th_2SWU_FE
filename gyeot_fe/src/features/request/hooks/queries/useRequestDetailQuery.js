import { useQuery } from "@tanstack/react-query";
import { getRequestDetailApi } from "@/features/request/api/getApi";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

/**
 * 요청 상세 조회 (같은 queryKey를 쓰는 화면끼리 캐시 공유, 화면별 가공은 select로)
 *
 * 사용 예:
 *   useRequestDetailQuery(paramId, { select: getRequestDetailService });
 */
export const useRequestDetailQuery = (requestId, { select } = {}) =>
  useQuery({
    queryKey: REQUEST_QUERY_KEYS.detail(requestId),
    queryFn: () => getRequestDetailApi(requestId),
    select,
    enabled: Boolean(requestId),
  });
