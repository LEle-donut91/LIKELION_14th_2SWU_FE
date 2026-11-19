import {
  MS_PER_MINUTE,
  DUE_DATE_DEFAULT_MINUTES,
  DUE_DATE_MIN_MINUTES,
  DUE_DATE_MAX_MINUTES,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/timeConstants";
import {
  DEADLINE_NOTICE,
  FIXED_DUE_DATE_TOAST_MESSAGE,
  START_PASSED_TOAST_MESSAGE,
} from "@/features/request/constants/messageConstants";
import { toDateFromInput } from "@/features/request/utils/dateTimeFormat";
import { isDueDateEntered } from "@/features/request/utils/validateInput";

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

// 응답 기한이 허용 범위(1시간~3일) 안의 "정시간 단위"인지 체크
const isAllowedDeadlineMinutes = (minutes) =>
  minutes >= DUE_DATE_MIN_MINUTES &&
  minutes <= DUE_DATE_MAX_MINUTES &&
  minutes % 60 === 0;

// 다음 버튼을 누른 시점에 미입력 및 시작 시간을 넘는 응답 기한을 보정한다.
export const normalizeResponseDeadline = (form, now = new Date()) => {
  if (form.dueDate === null) return { form, message: null };

  // 미입력: 기본값(24시간)으로 채움
  if (!isDueDateEntered(form.dueDate)) {
    return {
      form: {
        ...form,
        dueDate: { days: String(DUE_DATE_DEFAULT_MINUTES / (24 * 60)) },
      },
      message: DEADLINE_NOTICE.DEFAULT,
    };
  }

  // 응답 기한이 시작 시간을 넘어가면 "시작 시간까지"로 고정(null)
  const start = toDateFromInput(form.startDateTime);
  const minutes = toMinutes(form.dueDate);
  const exceedsStart =
    start && now.getTime() + minutes * MS_PER_MINUTE > start.getTime();

  if (exceedsStart && isAllowedDeadlineMinutes(minutes)) {
    return { form: { ...form, dueDate: null }, message: DEADLINE_NOTICE.FIXED };
  }
  return { form, message: null };
};

// 응답 기한 입력값 객체 (DueDateValue)를 분 단위 총합으로 환산 (없는 키/null은 0으로 취급)
export const toMinutes = (d) =>
  (parseInt(d?.days, 10) || 0) * 24 * 60 +
  (parseInt(d?.hours, 10) || 0) * 60 +
  (parseInt(d?.minutes, 10) || 0);
