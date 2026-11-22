import { useQuery } from "@tanstack/react-query";
import { getPastSituationsApi } from "@/features/situation/api/situationApi";
import { getPastSituationsService } from "@/features/situation/services/situationListService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";
import { SITUATION_LIST_PAGE_SIZE } from "@/features/situation/constants/situationConstants";

// H-04 지난 상황 전체 목록 (탭 · 사람별 보기 조건에 맞는 상황)
// - 목록을 모두 보여줘야 하므로 다음 페이지가 있는 동안 이어서 조회
// - params: { filter, personId, mockScenario }
// → data: { pastSituations, hasNext }
export const useAllPastSituationsQuery = ({ filter, personId, mockScenario } = {}) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.pastList({ filter, personId, mockScenario, all: true }),
    queryFn: async () => {
      const items = [];
      let page = 0;
      let hasNext;
      do {
        const response = await getPastSituationsApi({
          page,
          size: SITUATION_LIST_PAGE_SIZE,
          filter,
          personId: personId ?? undefined,
          mockScenario,
        });
        items.push(...(response.data?.items ?? []));
        hasNext = response.data?.hasNext ?? false;
        page += 1;
      } while (hasNext);
      return { data: { items, hasNext: false } };
    },
    select: getPastSituationsService,
    // 탭 · 사람을 바꿀 때 새 목록이 오기 전까지 이전 목록 유지 (깜빡임 방지)
    placeholderData: (previousData) => previousData,
  });
