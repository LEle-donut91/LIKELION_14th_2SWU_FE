import {
  DUE_DATE_DEFAULT_MINUTES,
  MS_PER_MINUTE,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/timeConstants";
import { toDateFromInput } from "@/features/request/utils/dateTimeFormat";

// 진입 또는 시작 일시 변경 시, 시작까지 24시간 미만이면 기한을 null로 맞춘다.
export const getDueDateForStart = (startDateTime, dueDate, now = new Date()) => {
  const start = toDateFromInput(startDateTime);
  return start && start - now < DUE_DATE_DEFAULT_MINUTES * MS_PER_MINUTE
    ? null
    : dueDate;
};

// 응답 기한 입력값 객체 (DueDateValue)를 분 단위 총합으로 환산 (없는 키/null은 0으로 취급)
export const toMinutes = (d) =>
  (parseInt(d?.days, 10) || 0) * 24 * 60 +
  (parseInt(d?.hours, 10) || 0) * 60 +
  (parseInt(d?.minutes, 10) || 0);


/**
 * [N-06] 다시 부탁하기 에서만 사용
 */

// 시작까지 남은 시간이 1시간 미만이 되는 시점까지 남은 밀리초
// (시작 일시가 불완전하면 null, 이미 1시간 미만이면 음수)
const getMsUntilStartLeadTooShort = (
  startDateTime,
  now = new Date(),
) => {
  const start = toDateFromInput(startDateTime);
  return start ? start - now - START_MIN_LEAD_MINUTES * MS_PER_MINUTE : null;
};

// 응답 기한 고정 여부 (고정된 경우 true)
export const isDueDateFixed = (startDateTime, now = new Date()) => {
  const remaining = getMsUntilStartLeadTooShort(startDateTime, now);
  return remaining !== null && remaining < 0;
};


