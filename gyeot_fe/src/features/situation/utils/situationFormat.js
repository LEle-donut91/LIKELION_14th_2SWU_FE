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

// 14:00
const formatTime = (value) => {
  const date = toDate(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
};

// 9/30(화) 18:00 (H-03-02 참여자뷰 요청 카드)
export const formatDateWithTime = (value) =>
  `${formatDate(value)} ${formatTime(value)}`;

// 요청 일정 (H-03-01 정보주인뷰 요청 카드)
// - 하루 안: 9/30(화) 18:00 - 19:00
// - 여러 날: 10/5(일) 09:00 - 10/6(월) 12:00
export const formatRequestSchedule = (startValue, endValue) => {
  const isSameDay =
    toDate(startValue).toDateString() === toDate(endValue).toDateString();
  return isSameDay
    ? `${formatDateWithTime(startValue)} - ${formatTime(endValue)}`
    : `${formatDateWithTime(startValue)} - ${formatDateWithTime(endValue)}`;
};

// 요청 기간: 9/28(일) - 10/12(일), 하루 안에 끝나면 9/28(일)만 (H-03 요청 목록)
export const formatRequestPeriod = (startValue, endValue) => {
  const isSameDay =
    toDate(startValue).toDateString() === toDate(endValue).toDateString();
  return isSameDay ? formatDate(startValue) : formatDateRange(startValue, endValue);
};

// 요일 없는 짧은 일시: 10/2 14:00 (N-09 상황 나가기 시트)
export const formatMonthDayTime = (value) => {
  const date = toDate(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
};
