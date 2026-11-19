import { useQuery } from "@tanstack/react-query";
import { getSafetyInfoSummaryApi } from "@/features/card/api/safetyInfoApi";
import { CARD_QUERY_KEYS } from "@/features/card/constants/cardQueryKeys";
import { getSafetyInfoSummaryService } from "@/features/card/services/safetyInfoService";

/**
 * [C-00] 안심카드 메인 조회 Hook
 * - 분류별 최근 갱신일과 공유 중 건수를 조회
 * - 항목 작성·수정·삭제 후 CARD_QUERY_KEYS.safetyInfo를 무효화하면 함께 다시 조회됨
 *
 * @returns {{
 *   cardSummary: { lastUpdatedAt: Object, sharingCount: number } | undefined, // 조회 전·실패 시 undefined
 *   isPending: boolean, // 첫 조회 중
 *   error: Error | null, // 조회 실패 시 에러 (화면에서 토스트로 안내)
 * }}
 */
export const useCardSummary = () => {
  const { data: cardSummary, isPending, error } = useQuery({
    queryKey: CARD_QUERY_KEYS.summary(),
    queryFn: getSafetyInfoSummaryApi,
    select: getSafetyInfoSummaryService,
  });

  return { cardSummary, isPending, error };
};
