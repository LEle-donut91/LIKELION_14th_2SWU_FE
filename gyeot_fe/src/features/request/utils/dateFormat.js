const toDate = (value) => (value instanceof Date ? value : new Date(value));
const padTwo = (number) => String(number).padStart(2, "0");

// 날짜/시간 입력 객체를 로컬 Date로 변환. 미완성 입력은 null을 반환
export const toDateFromInput = (value) => {
  const keys = ["year", "month", "day", "hour", "minute"];
  if (!value || !keys.every((key) => value[key] != null && value[key] !== "")) return null;
  return new Date(+value.year, +value.month - 1, +value.day, +value.hour, +value.minute);
};

// 로컬 일시를 시간대 접미사 없는 ISO 문자열(YYYY-MM-DDTHH:mm:ss)로 변환
export const formatLocalDateTime = (value) => {
  const date = toDate(value);
  return `${String(date.getFullYear()).padStart(4, "0")}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}T${padTwo(date.getHours())}:${padTwo(date.getMinutes())}:${padTwo(date.getSeconds())}`;
};

// ISO 날짜(YYYY-MM-DD)를 로컬 날짜의 시작 또는 끝 시각으로 변환(YYYY-MM-DDT23:59:59.999 or YYYY-MM-DDT00:00:00)
export const formatDateToLocalDayBoundary = (value, endOfDay = false) =>
  value ? new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`) : null;
