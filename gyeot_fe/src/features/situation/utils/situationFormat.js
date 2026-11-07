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
