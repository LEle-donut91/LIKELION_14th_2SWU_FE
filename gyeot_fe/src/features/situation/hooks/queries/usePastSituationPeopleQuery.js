import { useQuery } from "@tanstack/react-query";
import { getPastSituationPeopleApi } from "@/features/situation/api/situationApi";
import { getPastSituationPeopleService } from "@/features/situation/services/situationListService";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";

// H-04 사람 선택 시트의 사람 목록 (지난 요청 이력에 등장한 상대)
// - filter: 선택한 탭 (탭마다 사람 목록이 달라짐)
// - mockScenario: 목업 시나리오 (USE_MOCK일 때만 사용)
// → data: { people: [{ id(userId), name, isGuardian }] }
export const usePastSituationPeopleQuery = ({ filter, mockScenario } = {}) =>
  useQuery({
    queryKey: SITUATION_QUERY_KEYS.pastPeople({ filter, mockScenario }),
    queryFn: () => getPastSituationPeopleApi({ filter, mockScenario }),
    select: getPastSituationPeopleService,
    // 탭을 바꿀 때 새 목록이 오기 전까지 이전 목록 유지
    placeholderData: (previousData) => previousData,
  });
