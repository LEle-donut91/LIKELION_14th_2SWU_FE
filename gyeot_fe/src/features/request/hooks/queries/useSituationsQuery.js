import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getErrorMessage } from "@/shared/utils/apiError";
import { getSituationApi } from "@/features/request/api/getApi";
import { getSituationService } from "@/features/request/services/requestSituationService";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

// 선택 시트에는 전체 목록이 필요하므로 다음 페이지가 있는 동안 조회한다.
export const useSituationsQuery = ({ size = 20, showToast } = {}) => {
  const handledError = useRef(null);
  const query = useQuery({
    queryKey: REQUEST_QUERY_KEYS.situations(size),
    queryFn: async () => {
      const items = [];
      let page = 0;
      let hasNext;
      do {
        const response = await getSituationApi({ page, size });
        items.push(...response.data.items);
        hasNext = response.data.hasNext;
        page += 1;
      } while (hasNext);
      return { data: { items } };
    },
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
