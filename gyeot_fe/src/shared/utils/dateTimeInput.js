// 날짜/시간 입력(DateTimeOption) 값 검증
// features/request/utils/requestUtils.js의 함수를 shared용으로 복사 (요청 쪽 원본은 그대로 유지)
import {
  DATE_TIME_MAX_LIMITS,
  DATE_TIME_MIN_LIMITS,
} from "@/shared/constants/dateTimeConstants";

// 입력값에서 숫자만 남기고, 필드(key)별 최소/최대값을 벗어나면 "" 반환
export const getValidatedNumericValue = (key, rawValue) => {
  const val = rawValue.replace(/[^0-9]/g, ""); // 숫자만 입력 가능
  if (val === "") return "";

  const num = parseInt(val, 10);

  const minLimit = DATE_TIME_MIN_LIMITS[key];
  const maxLimit = DATE_TIME_MAX_LIMITS[key];
  if (num < minLimit || num > maxLimit) return "";

  return String(num);
};
