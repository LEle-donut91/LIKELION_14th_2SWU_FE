// 홈 화면 날짜/시간 표시용 유틸리티
// 모든 함수는 Date 객체 또는 ISO 문자열을 받는다.

const WEEKDAY_LIST = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (value) => (value instanceof Date ? value : new Date(value));

// 시각을 제거한 날짜(자정 기준)
const toDateOnly = (value) => {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const padTwo = (number) => String(number).padStart(2, "0");

// 9/28(월)
export const formatDate = (value) => {
  const date = toDate(value);
  return `${date.getMonth() + 1}/${date.getDate()}(${WEEKDAY_LIST[date.getDay()]})`;
};

// 10/1(목) 22:00
export const formatDateTime = (value) => {
  const date = toDate(value);
  return `${formatDate(date)} ${padTwo(date.getHours())}:${padTwo(date.getMinutes())}`;
};

// 9/28(월) - 10/10(토)
export const formatDateRange = (startValue, endValue) =>
  `${formatDate(startValue)} - ${formatDate(endValue)}`;

// D-9 / D-day / D+1
export const getDdayText = (endValue, baseValue = new Date()) => {
  const diffDays = Math.round(
    (toDateOnly(endValue) - toDateOnly(baseValue)) / DAY_MS,
  );
  if (diffDays === 0) return "D-day";
  return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
};

// 기간 경과율(0~100)
export const getProgressRate = (startValue, endValue, baseValue = new Date()) => {
  const start = toDateOnly(startValue);
  const end = toDateOnly(endValue);
  const base = toDateOnly(baseValue);
  const totalDays = (end - start) / DAY_MS;

  if (totalDays <= 0) return 100;

  const rate = ((base - start) / DAY_MS / totalDays) * 100;
  return Math.min(100, Math.max(0, Math.round(rate)));
};

// 응답 기한까지 남은 시간: 3일 2시간 남음 / 4시간 3분 남음 / 12분 남음
export const getRemainingText = (deadlineValue, baseValue = new Date()) => {
  const diffMinutes = Math.floor((toDate(deadlineValue) - toDate(baseValue)) / 60000);

  if (diffMinutes <= 0) return "기한 만료";

  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
};
