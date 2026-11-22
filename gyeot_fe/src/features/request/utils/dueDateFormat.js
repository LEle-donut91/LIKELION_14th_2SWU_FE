import {
  DUE_DATE_DEFAULT_MINUTES,
  DUE_DATE_MIN_MINUTES,
  DUE_DATE_MAX_MINUTES,
  MS_PER_MINUTE,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/timeConstants";
import { toDateFromInput } from "@/features/request/utils/dateTimeFormat";
import { DUEDATE_FIXED_MESSAGE } from "@/features/request/constants/messageConstants";
import { INITIAL_FORM } from "@/features/request/constants/initialFormConstants";

// 화면 진입·시작 일시 변경 때만 기본 24시간을 시작 일시에 맞춰 초기화한다.
export const getInitialDueDateForStart = (startDateTime, now = new Date()) => {
  const start = toDateFromInput(startDateTime);
  if (start && start - now < DUE_DATE_DEFAULT_MINUTES * MS_PER_MINUTE) {
    return { dueDate: null, message: DUEDATE_FIXED_MESSAGE };
  }
  return { dueDate: { ...INITIAL_FORM.dueDate }, message: null };
};

/**
 * 사용자가 시트에서 확인한 응답 기한이 시작 시간을 초과하는지 계산한다.
 * - dueDate는 실제 저장값이며, null이면 화면에서 "시작 시간까지"로 표시한다.
 * - message는 호출부에서 띄울 토스트 문구다. 이 함수가 직접 토스트를 띄우지는 않는다.
 * - now를 생략하면 함수를 호출한 순간의 현재 시각으로 계산한다.
 * @returns {{dueDate: Object|null, message: string|null}} 저장할 기한과 선택적 안내 문구.
 */
export const getDueDateForStart = (startDateTime, dueDate, now = new Date()) => {
  const start = toDateFromInput(startDateTime);
  // 시작 일시가 미완성이면 비교하지 않는다. 이미 null이면 중복 안내 없이 그대로 둔다.
  if (!start || dueDate === null) return { dueDate, message: null };
  const minutes = toMinutes(dueDate);

  // 최소 기한 미달 (< 1시간)과 최대 기한 초과 (> 3일)는 값을 유지
  // -> '다음' 버튼에서 최소·최대 기한 오류를 확인할 수 있게 한다.
  if (minutes < DUE_DATE_MIN_MINUTES || minutes > DUE_DATE_MAX_MINUTES) {
    return { dueDate, message: null };
  }

  // 시작까지 24시간 미만이어도 사용자가 입력한 유효한 기한은 유지한다.
  if (
    now.getTime() + minutes * MS_PER_MINUTE > start.getTime()
  ) {
    // 값을 null로 설정, "응답 기한은 시작 시간까지입니다." 토스트 메시지
    return { dueDate: null, message: DUEDATE_FIXED_MESSAGE };
  }

  // 시작 시간을 초과하지 않으면 입력한 응답 기한을 유지한다.
  return { dueDate, message: null };
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


