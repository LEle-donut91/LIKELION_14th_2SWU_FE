import { useQuery } from "@tanstack/react-query";
import { getInProgressSituationsApi } from "@/features/situation/api/situationApi";
import { getMySituationsService } from "@/features/situation/services/situationListService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";
import { SITUATION_LIST_PAGE_SIZE } from "@/features/situation/constants/situationConstants";

// 진행 중 상황 목록 중 내가 주인인 상황 (S-00 상황 목록)
// - 카드를 모두 보여줘야 하므로 다음 페이지가 있는 동안 이어서 조회
// - mockScenario: 목업 시나리오 (USE_MOCK일 때만 사용)
// → data: { mySituations }
export const useMySituationsQuery = ({ mockScenario } = {}) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.inProgressList({ mockScenario }),
    queryFn: async () => {
      const items = [];
      let page = 0;
      let hasNext;
      do {
        const response = await getInProgressSituationsApi({
          page,
          size: SITUATION_LIST_PAGE_SIZE,
          mockScenario,
        });
        items.push(...(response.data?.items ?? []));
        hasNext = response.data?.hasNext ?? false;
        page += 1;
      } while (hasNext);
      return { data: { items } };
    },
    select: getMySituationsService,
  });
