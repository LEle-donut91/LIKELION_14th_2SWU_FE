import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getHomeApi } from "@/features/home/api/homeApi";
import { getHomeService } from "@/features/home/services/homeService";
import { HOME_QUERY_KEYS } from "@/features/home/constants/homeQueryKeys";
import { MOCK_QUERY_KEY } from "@/features/home/mocks/homeMockData";

/**
 * [H-00] 홈 통합 조회 Hook
 * - 홈 통합 조회 → 상단 건수 · 탭별 상황 카드 · 요청 · 일정 (homeService에서 화면용으로 변환)
 * - 조회 실패 시 hasError로 홈 에러 화면 유지 (토스트 없음, API_CONVENTIONS 6-3)
 * - 공유 철회·다시 허용 후 HOME_QUERY_KEYS.home()이 무효화되면 다시 조회됨
 * - 테스트: ?mock=new·empty·single·default (USE_MOCK일 때만, 바뀌면 다시 조회)
 *
 * @returns {{
 *   homeData: ReturnType<typeof getHomeService> | null, // 조회 전·실패 시 null
 *   isLoading: boolean, // 첫 조회 중
 *   hasError: boolean,  // 조회 실패
 *   refetch: Function,  // 다시 조회
 * }}
 */
export const useHome = () => {
  // 테스트 시나리오 (?mock=...) - 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const mockScenario = searchParams.get(MOCK_QUERY_KEY) ?? undefined;

  const {
    data: homeData = null,
    isPending: isLoading,
    isError: hasError,
    refetch,
  } = useQuery({
    // 시나리오를 바꾸면 다시 조회되도록 key 뒤에 붙임 (앞부분 ["home"]으로 무효화 가능)
    queryKey: [...HOME_QUERY_KEYS.home(), { mockScenario }],
    queryFn: () => getHomeApi({ mockScenario }),
    select: getHomeService,
  });

  return { homeData, isLoading, hasError, refetch };
};