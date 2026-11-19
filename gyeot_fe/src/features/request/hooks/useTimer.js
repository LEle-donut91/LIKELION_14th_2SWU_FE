import { useEffect, useState } from "react";
import { formatSecondsToTime } from "@/features/request/utils/getTimer";

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
export function useTimer(initialSeconds = 0, enabled = true, deadline = null) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (deadline) {
        const currentTime = Date.now();
        setNow(currentTime);
        if (currentTime >= Date.parse(deadline)) clearInterval(interval);
        return;
      }
      setRemaining((prev) => {
        if (prev <= 1) clearInterval(interval); // 0초가 되면 타이머 삭제
        return Math.max(prev - 1, 0);
      });
    }, 1000);

    // 언마운트 시 타이머 삭제
    return () => clearInterval(interval);
  }, [enabled, deadline]);

  const deadlineSeconds = Math.floor((Date.parse(deadline) - now) / 1000);
  return formatSecondsToTime(
    deadline
      ? Math.max(Number.isFinite(deadlineSeconds) ? deadlineSeconds : 0, 0)
      : remaining,
  );
}
