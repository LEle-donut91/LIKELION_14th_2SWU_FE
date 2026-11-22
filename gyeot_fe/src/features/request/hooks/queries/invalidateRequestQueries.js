import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

// 비활성 수정 화면의 선택지도 갱신해 다음 진입 시 이전 기본값을 쓰지 않도록 한다.
export const invalidateRequestQueries = (queryClient, requestId) =>
  Promise.all([
    queryClient.invalidateQueries({
      queryKey: REQUEST_QUERY_KEYS.detail(requestId),
      refetchType: "all",
    }),
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) =>
        queryKey[0] === "requestInformationOptions" &&
        queryKey[1]?.requestId != null &&
        String(queryKey[1].requestId) === String(requestId),
      refetchType: "all",
    }),
  ]);
