// 날짜·시간 입력값(DateTimeOption) ↔ API 날짜시각 변환

const padTwo = (value) => String(value).padStart(2, "0");

// 날짜·시간을 모두 입력했는지
// - value: { year, month, day, hour, minute } (문자열 숫자)
export const isDateTimeFilled = (value) => {
  const { year, month, day, hour, minute } = value ?? {};
  return [year, month, day, hour, minute].every(
    (part) => part !== undefined && part !== null && part !== "",
  );
};

// 입력값 → API 날짜시각 문자열 (Asia/Seoul 기준, 오프셋 없음)
// 예: { year: "2026", month: "11", day: "20", hour: "9", minute: "0" } → "2026-11-20T09:00:00"
export const toApiDateTime = (value) => {
  if (!isDateTimeFilled(value)) return null;
  const { year, month, day, hour, minute } = value;
  return `${year}-${padTwo(month)}-${padTwo(day)}T${padTwo(hour)}:${padTwo(minute)}:00`;
};
