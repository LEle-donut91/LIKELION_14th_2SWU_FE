// 상황 화면 날짜 표시용 유틸리티
import { formatDate, formatDateRange } from "@/shared/utils/dateFormat";

const toDate = (value) => (value instanceof Date ? value : new Date(value));

// 8/10
const formatMonthDay = (value) => {
  const date = toDate(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 8/10 ~ 8/17 (지난 상황 목록)
export const formatMonthDayRange = (startValue, endValue) =>
  `${formatMonthDay(startValue)} ~ ${formatMonthDay(endValue)}`;

// 날짜 선택 시트 값({ year, month, day, ... }) → 9/28 (H-01 시작/종료 칸)
// 날짜가 다 입력되지 않았으면 placeholder 반환
export const formatDateFieldText = (dateTimeValue, placeholder) => {
  const { year, month, day } = dateTimeValue ?? {};
  if (!year || !month || !day) return placeholder;
  return `${Number(month)}/${Number(day)}`;
};

// 요청 기간: 9/28(일) - 10/12(일), 하루 안에 끝나면 9/28(일)만 (H-03 요청 목록)
export const formatRequestPeriod = (startValue, endValue) => {
  const isSameDay =
    toDate(startValue).toDateString() === toDate(endValue).toDateString();
  return isSameDay ? formatDate(startValue) : formatDateRange(startValue, endValue);
};
