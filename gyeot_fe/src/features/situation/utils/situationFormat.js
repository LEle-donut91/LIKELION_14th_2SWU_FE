// 상황 화면 날짜 표시용 유틸리티

const toDate = (value) => (value instanceof Date ? value : new Date(value));

// 8/10
const formatMonthDay = (value) => {
  const date = toDate(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 8/10 ~ 8/17 (지난 상황 목록)
export const formatMonthDayRange = (startValue, endValue) =>
  `${formatMonthDay(startValue)} ~ ${formatMonthDay(endValue)}`;

// 9/1 - 9/20 (H-04 지난 상황 카드)
export const formatMonthDayDashRange = (startValue, endValue) =>
  `${formatMonthDay(startValue)} - ${formatMonthDay(endValue)}`;

// 날짜 선택 시트 값({ year, month, day, ... }) → 9/28 (H-01 시작/종료 칸)
// 날짜가 다 입력되지 않았으면 placeholder 반환
export const formatDateFieldText = (dateTimeValue, placeholder) => {
  const { year, month, day } = dateTimeValue ?? {};
  if (!year || !month || !day) return placeholder;
  return `${Number(month)}/${Number(day)}`;
};
