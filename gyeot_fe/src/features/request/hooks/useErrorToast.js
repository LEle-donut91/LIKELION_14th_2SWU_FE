import { useEffect } from "react";
import { getErrorMessage } from "@/shared/utils/apiError";

/**
 * [request/ 공통] 조회(useQuery) 에러를 토스트로 알려주는 훅
 *  - 여러 쿼리의 error를 한 번에 넘길 수 있음 (토스트는 하나라서 가장 먼저 발생한 에러만 표시)
 *
 * 사용 예:
 *   useErrorToast(showToast, targetsError, informationError);
 */
export function useErrorToast(showToast, ...errors) {
  const error = errors.find(Boolean);

  useEffect(() => {
    if (error) showToast(getErrorMessage(error));
  }, [error, showToast]);
}
