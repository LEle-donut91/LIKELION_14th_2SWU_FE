import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHome } from "@/features/home/api/homeApi";
import { MOCK_QUERY_KEY } from "@/features/home/mocks/homeMockData";

// 홈 화면 데이터 조회 Hook
export const useHome = () => {
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  // 값이 바뀌면 재조회 (refetch)
  const [requestKey, setRequestKey] = useState(0);

  // 테스트 시나리오 (?mock=...) - 바뀌면 재조회. 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const mockScenario = searchParams.get(MOCK_QUERY_KEY) ?? undefined;

  useEffect(() => {
    let isUnmounted = false; // 언마운트·재조회 이후 도착한 이전 응답 무시

    getHome({ mockScenario })
      .then((data) => {
        if (isUnmounted) return;
        setHomeData(data);
        setHasError(false);
      })
      .catch(() => {
        if (!isUnmounted) setHasError(true);
      })
      .finally(() => {
        if (!isUnmounted) setIsLoading(false);
      });

    return () => {
      isUnmounted = true;
    };
  }, [requestKey, mockScenario]);

  // 재조회 (예: 에러 화면 "다시 시도")
  const refetch = useCallback(() => {
    setIsLoading(true);
    setRequestKey((prevKey) => prevKey + 1);
  }, []);

  return { homeData, isLoading, hasError, refetch };
};
