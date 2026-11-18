/**
 * [request/ 공통] 타이머용 시간 문자열 처리
 */

// 1자리 숫자 앞에 0 붙이기 (예: 1 -> "01")
export const padTimeUnit = (num) => String(num).padStart(2, "0");

// "HH:MM:SS" -> 초 단위 총합 (비어있거나 숫자가 아니면 0 취급)
export const parseTimeToSeconds = (timeStr = "") => {
  const [h, m, s] = String(timeStr)
    .split(":")
    .map((v) => parseInt(v, 10) || 0);
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
};

// 초 단위 총합 -> { hour, minute, second } (각각 2자리 문자열)
export const formatSecondsToTime = (totalSeconds) => ({
  hour: padTimeUnit(Math.floor(totalSeconds / 3600)),
  minute: padTimeUnit(Math.floor((totalSeconds % 3600) / 60)),
  second: padTimeUnit(totalSeconds % 60),
});
