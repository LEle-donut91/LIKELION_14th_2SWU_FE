import {
  MS_PER_MINUTE,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/timeConstants";
import { toDateFromInput } from "@/features/request/utils/dateTimeFormat";

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

// 응답 기한 초기값 반환: 시작까지 1시간 미만이면 null (서버에서 처리), 아니면 기본값
export const getInitialDueDate = (
  startDateTime,
  defaultDueDate,
  now = new Date(),
) => (isDueDateFixed(startDateTime, now) ? null : defaultDueDate);


