import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getErrorMessage } from "@/shared/utils/apiError";
import { getHomeApi } from "@/features/request/api/getApi";
import { getSituationService } from "@/features/request/services/requestSituationService";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

// 홈 통합 조회 API (요청 작성 시 상황 목록을 가져오기 위함)
export const useHomeQuery = ({ showToast } = {}) => {
  const handledError = useRef(null);
  const query = useQuery({
    queryKey: REQUEST_QUERY_KEYS.home(),
    queryFn: getHomeApi,
    select: getSituationService,
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
  }, [query.error, query.errorUpdatedAt, query.isFetching, showToast]);

  return query;
};
