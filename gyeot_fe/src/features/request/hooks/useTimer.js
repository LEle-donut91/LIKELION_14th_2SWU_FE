import { useEffect, useState } from "react";
import { formatSecondsToTime } from "@/features/request/utils/requestUtils";

/**
 * =====================================================================
 * [request/ 공통] 카운트다운 타이머 커스텀 훅
 *  - initialSeconds부터 1초씩 감소, 0이 되면 정지
 *  - enabled가 false면 타이머를 돌리지 않음
 *  - 반환: { hour, minute, second } (각각 2자리 문자열)
 *
 * 사용 예:
 *   const { hour, minute, second } = useTimer(parseTimeToSeconds("12:00:00"));
 * =====================================================================
 */
export function useTimer(initialSeconds = 0, enabled = true) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) clearInterval(interval); // 0초가 되면 타이머 삭제
        return Math.max(prev - 1, 0);
      });
    }, 1000);

    // 언마운트 시 타이머 삭제
    return () => clearInterval(interval);
  }, [enabled]);

  return formatSecondsToTime(remaining);
}
