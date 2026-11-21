import {
  MS_PER_MINUTE,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/timeConstants";
import {
  FIXED_DUE_DATE_TOAST_MESSAGE,
  START_PASSED_TOAST_MESSAGE,
} from "@/features/request/constants/messageConstants";
import { toDateFromInput } from "@/features/request/utils/dateTimeFormat";

/**
 * [H-03-02] 요청 작성 / [N-06] 다시 부탁하기
 * 응답 기한 표시 · 고정 여부 · 시작 시간 경과 체크 · 마감 보정
 */

// 시작까지 남은 시간이 1시간 미만이 되는 시점까지 남은 밀리초
// (시작 일시가 불완전하면 null, 이미 1시간 미만이면 음수)
export const getMsUntilStartLeadTooShort = (
  startDateTime,
  now = new Date(),
) => {
  const start = toDateFromInput(startDateTime);
  return start ? start - now - START_MIN_LEAD_MINUTES * MS_PER_MINUTE : null;
};

// 시작까지 남은 시간이 최소 여유 시간(1시간) 미만인지 체크 (시작 일시가 불완전하면 false)
const isStartLeadTooShort = (startDateTime, now = new Date()) => {
  const ms = getMsUntilStartLeadTooShort(startDateTime, now);
  return ms !== null && ms < 0;
};

// 응답 기한 초기값 반환: 시작까지 1시간 미만이면 null (서버에서 처리), 아니면 기본값
export const getInitialDueDate = (
  startDateTime,
  defaultDueDate,
  now = new Date(),
) => (isStartLeadTooShort(startDateTime, now) ? null : defaultDueDate);

// 응답 기한이 고정되어 있는지 체크 (useRequestForm이 dueDate를 null로 설정한 경우)
export const isDueDateFixed = (form) => form.dueDate === null;

// 응답 기한이 고정되어 있으면 토스트를 띄우고 false 반환 (수정 가능하면 true 반환)
export const isDueDateEditable = (form, showToast) => {
  if (isDueDateFixed(form)) {
    showToast(FIXED_DUE_DATE_TOAST_MESSAGE);
    return false;
  }
  return true;
};

// 시작 시간이 이미 지났으면 토스트를 띄우고 false 반환 (아니면 true 반환)
export const isStartTimeEnsured = (
  startDateTime,
  showToast,
  now = new Date(),
) => {
  const start = toDateFromInput(startDateTime);
  if (start && start <= now) {
    showToast(START_PASSED_TOAST_MESSAGE);
    return false;
  }
  return true;
};

// 응답 기한 입력값 객체 (DueDateValue)를 분 단위 총합으로 환산 (없는 키/null은 0으로 취급)
export const toMinutes = (d) =>
  (parseInt(d?.days, 10) || 0) * 24 * 60 +
  (parseInt(d?.hours, 10) || 0) * 60 +
  (parseInt(d?.minutes, 10) || 0);
