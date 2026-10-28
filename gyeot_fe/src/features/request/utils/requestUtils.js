import { SENSITIVE_KEYS } from "@/features/request/constants/requestConstants.js";
import { DATE_TIME_MAX_LIMITS, DATE_TIME_MIN_LIMITS, DUE_DATE_MAX_LIMITS, DUE_DATE_MIN_LIMITS } from "../constants/requestConstants";

// 선택된 상황 찾기
export const getSelectedSituation = (situation, situationId) => {
  const selectedSituation = situation?.find((item) => item.id === situationId);
  return selectedSituation
};

// 선택된 요청 대상 찾기
export const getSelectUser = (user, userId) => {
  const selectedUser = user?.find((item) => item.id === userId);
  return selectedUser
}

// 입력된 시간, 날짜 값에서 숫자만 남기고, 필드(key)별 최대값/유효성에 맞게 값을 보정
export const getValidatedNumericValue = (key, rawValue) => {
  let val = rawValue.replace(/[^0-9]/g, ""); // 숫자만 입력 가능
  if (val === "") return "";

  let num = parseInt(val, 10);

  // 최소값 미만 또는 최대값 초과 시 "" 반환
  const minLimit = DUE_DATE_MIN_LIMITS[key] || DATE_TIME_MIN_LIMITS[key];
  const maxLimit = DUE_DATE_MAX_LIMITS[key] || DATE_TIME_MAX_LIMITS[key];
  if (num < minLimit || num > maxLimit) return "";

  return String(num);
};

// 선택된 ID 목록(checkedList)과 원본 데이터 목록(dataList)을 받아서,
// 선택된 항목들의 title을 쉼표(,)로 연결하여 반환
export const getSelectedTitles = (checkedList, dataList) => {
  if (!checkedList || checkedList.length === 0) return "해당 없음";

  return dataList
    .filter((item) => checkedList.includes(item.id))
    .map((item) => item.label)
    .join(", ");
};

// 사용자가 체크한 항목 중 민감정보가 포함되어 있으면 true 반환 (아니라면 false)
export const checkSensitiveIncluded = (healthList = [], lifeList = []) => {
  const isHealthSensitiveSelected = healthList.some((id) =>
    SENSITIVE_KEYS.includes(id),
  );
  const isLifeSensitiveSelected = lifeList.some((id) =>
    SENSITIVE_KEYS.includes(id),
  );

  return isHealthSensitiveSelected || isLifeSensitiveSelected;
};

// 날짜/시간 객체를 화면 표시용 문자열(YYYY.MM.DD HH:mm)로 가공
export const getDateTimeText = (dateTimeObj) => {
  if (!dateTimeObj) return "선택";
  const { year, month, day, hour, minute } = dateTimeObj;

  // 월, 일, 시, 분이 한 자리일 때 앞에 '0'을 붙여줌 (예: "1" -> "01")
  const pad = (value) => String(value).padStart(2, "0");

  if (!year || !month || !day || !hour || !minute) return "선택";

  const datePart = `${year}.${pad(month)}.${pad(day)}`;
  const timePart = `${pad(hour)}.${pad(minute)}`;
  return `${datePart} ${timePart}`;
};

// (요청 대상 리스트, 선택된 요청 대상의 ID)를 인자로 받아, 요청 대상 텍스트 가공
export const getSelectedUserId = (userLst, userId) => {
  const selectedUser = userLst?.find((item) => item.id === userId);
  return selectedUser?.userName || "한 명 선택";
};

// 화면에 보여줄 응답 기한 텍스트 가공
export const getDueDateText = (dueDate) => {
  if (!dueDate) return "선택";
  const days = parseInt(dueDate.days, 10) || 0;
  const hours = parseInt(dueDate.hours, 10) || 0;
  const minutes = parseInt(dueDate.minutes, 10) || 0;

  // 정확히 1일 0시간 0분일 때만 "24시간 (기본)" 출력
  if (days === 1 && hours === 0 && minutes === 0) {
    return "24시간 (기본)";
  }

  // 그 외의 경우 조합해서 출력 (예: "2일 3시간", "1일 30분")
  let text = `${days}일`;
  if (hours > 0) text += ` ${hours}시간`;
  if (minutes > 0) text += ` ${minutes}분`;

  return text;
};
