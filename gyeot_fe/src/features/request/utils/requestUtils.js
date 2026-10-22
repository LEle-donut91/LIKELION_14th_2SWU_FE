import { SENSITIVE_KEYS } from "@/features/request/constants/requestConstants.js";;

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
    SENSITIVE_KEYS.includes(id)
  );
  const isLifeSensitiveSelected = lifeList.some((id) =>
    SENSITIVE_KEYS.includes(id)
  );

  return isHealthSensitiveSelected || isLifeSensitiveSelected;
};


// 날짜/시간 객체를 화면 표시용 문자열(YYYY.MM.DD HH:mm)로 가공
export const getDateTimeText = (dateTimeObj) => {
  if (!dateTimeObj) return "선택";
  const { year, month, day, hour, minute } = dateTimeObj;
  if (!year && !month && !day && !hour && !minute) return "선택";

  const datePart =
    year || month || day
      ? `${year || "0000"}.${month || "00"}.${day || "00"}`
      : "";
  const timePart = hour || minute ? `${hour || "00"}:${minute || "00"}` : "";

  return `${datePart} ${timePart}`.trim();
};
