import { useQuery } from "@tanstack/react-query";
import { getRequestTargetsApi } from "@/features/request/api/getApi";
import { getRequestTargetsService } from "@/features/request/services/requestTargetService";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

const toNumberOrUndefined = (value) =>
  value == null ? undefined : Number(value);

/**
 * 대상 후보 조회
 *  - 요청 작성: { situationId } / 다시 부탁하기: { requestId }
 *  - 둘 중 하나라도 있어야 조회하며, 값이 바뀌면 queryKey가 달라져 자동으로 다시 조회
 */
export const useRequestTargetsQuery = ({ situationId, requestId } = {}) =>
  useQuery({
    queryKey: REQUEST_QUERY_KEYS.targets(situationId, requestId),
    queryFn: () =>
      getRequestTargetsApi({
        situationId: toNumberOrUndefined(situationId),
        requestId: toNumberOrUndefined(requestId),
      }),
    select: getRequestTargetsService,
    enabled: Boolean(situationId || requestId),
  });
