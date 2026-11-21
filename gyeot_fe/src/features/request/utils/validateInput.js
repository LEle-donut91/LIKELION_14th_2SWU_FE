import {
  MS_PER_MINUTE,
  DUE_DATE_MAX_MINUTES,
  DUE_DATE_MIN_MINUTES,
  DUE_DATE_DEFAULT_MINUTES,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/timeConstants";
import { REQUEST_FORM_FIELD_KEY } from "@/features/request/constants/requestFormConstants";
import { toMinutes } from "@/features/request/utils/dueDateUtils";
import {
  formatDateToLocalDayBoundary,
  toDateFromInput,
} from "@/features/request/utils/dateTimeFormat";
import {
  DATE_TIME_KEYS,
  DUE_DATE_KEYS,
  DATE_TIME_MAX_LIMITS,
  DATE_TIME_MIN_LIMITS,
  DUE_DATE_MAX_LIMITS,
  DUE_DATE_MIN_LIMITS,
} from "@/features/request/constants/dateTimeInputConstants";
import {
  REQUEST_PREREQUISITE_TOAST_MESSAGE,
  DEADLINE_NOTICE,
} from "@/features/request/constants/messageConstants";

// 시작/종료 Section에 입력된 시간, 날짜 값에서 숫자만 남기고, 필드(key)별 최대값/유효성에 맞게 값을 보정
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

// 시간/날짜 입력 칸의 5개 필드가 전부 채워졌는지 체크 (null / undefined / "" 은 모두 미입력으로 취급)
export const isDateTimeComplete = (v) =>
  !!v && DATE_TIME_KEYS.every((k) => v[k] != null && v[k] !== "");

// 응답 기한 입력 칸의 3개 필드 중 1개 이상 입력했는지 체크 (null / undefined / "" 은 모두 미입력으로 취급)
export const isDueDateEntered = (d) =>
  DUE_DATE_KEYS.some((k) => d?.[k] != null && d?.[k] !== "");

// 장소/부탁 내용(input/textarea)이 read only인지 체크
// 상황이나 도움 종류 중 하나라도 없으면 true(읽기 전용), 둘 다 있으면 false
export const isReadOnly = (form) =>
  !(
    form[REQUEST_FORM_FIELD_KEY.SITUATION_ID] &&
    form[REQUEST_FORM_FIELD_KEY.HELP_TYPE]
  );

// 선행 조건 미충족 시 토스트를 띄우고 false 반환 (충족 시 true 반환)
export const isPrerequisiteEnsured = (form, showToast) => {
  if (!form[REQUEST_FORM_FIELD_KEY.SITUATION_ID]) {
    showToast(REQUEST_PREREQUISITE_TOAST_MESSAGE.SITUATION_REQUIRED);
    return false;
  }

  if (!form[REQUEST_FORM_FIELD_KEY.HELP_TYPE]) {
    showToast(REQUEST_PREREQUISITE_TOAST_MESSAGE.HELP_TYPE_REQUIRED);
    return false;
  }

  return true;
};

/**
 * [H-03-02] 요청 작성 - "다음" 버튼을 눌렀을 때 유효성 검사
 * 1. 상황
 * - 미입력 시: "상황을 선택해 주세요."
 *
 * 2. 도움 종류
 * - 미입력 시: "도움 종류를 선택해 주세요."
 *
 * 3. 시작 일시
 * - 미입력 시: "시작 일시를 모두 입력해 주세요."
 * - 과거 시간 설정 시: "이미 지난 시간은 시작 시간으로 설정할 수 없어요."
 * - 여유 시간 부족 시 (< 1시간): "시작 시간은 지금으로부터 최소 1시간 이후여야 해요."
 *
 * 4. 종료 일시
 * - 미입력 시: "종료 일시를 모두 입력해 주세요."
 * - 시작 시간보다 빠른 경우: "종료 시간은 시작 시간 이후로 정해 주세요."
 *
 * 5. 장소
 * - 미입력 또는 공백 시: "장소를 입력해 주세요."
 *
 * 6. 요청 대상
 * - 미선택 시: "요청 대상을 선택해 주세요."
 *
 * 7. 응답 기한 (1, 4는 normalizeResponseDeadline에서 처리)
 * - 1) 미입력 시: "응답 기한은 24시간으로 고정됩니다." (이때 실제 값은 24시간으로 세팅되며, 토스트 메시지를 출력하긴 하지만 다음 페이지로 이동함)
 * - 2) 최소 기한 미달 (< 1시간): "응답 기한은 최소 1시간 이상이어야 해요."
 * - 3) 최대 기한 초과 (> 3일): "응답 기한은 최대 3일까지 설정할 수 있어요."
 * - 4) 시작 시간을 초과할 때 (현재+기한 > 시작시간): "응답 기한은 시작 시간까지로 고정됩니다." (이때 실제 값은 null로 세팅되며, 화면에는 "시작 시간까지"로 표시됨. 토스트 메시지를 출력하긴 하지만 다음 페이지로 이동함)
 *
 * 8. 시작 & 종료 일시
 * - 상황 기간 밖: "시작·종료 일시는 상황 기간 안에 있어야 해요."
 *
 */
export const requestValidateInput = (form, now) => {
  const errors = {};
  // 1. 상황
  if (!form.situationId) errors.situationId = "상황을 선택해 주세요.";

  // 2. 도움 종류
  if (!form.helpType) errors.helpType = "도움 종류를 선택해 주세요.";

  // 시작 시간/종료 시간
  const start = toDateFromInput(form.startDateTime);
  const end = toDateFromInput(form.endDateTime);

  // 3. 시작 일시
  if (!start) {
    errors.startDateTime = "시작 일시를 모두 입력해 주세요.";
  } else {
    const leadMinutes = (start - now) / MS_PER_MINUTE;
    if (leadMinutes <= 0) {
      errors.startDateTime = "이미 지난 시간은 시작 시간으로 설정할 수 없어요.";
    } else if (leadMinutes < START_MIN_LEAD_MINUTES) {
      errors.startDateTime =
        "시작 시간은 지금으로부터 최소 1시간 이후여야 해요.";
    }
  }

  // 4. 종료 일시
  if (!end) {
    errors.endDateTime = "종료 일시를 모두 입력해 주세요.";
  } else if (start && end <= start) {
    errors.endDateTime = "종료 시간은 시작 시간 이후로 정해 주세요.";
  }

  // 5. 장소
  if (!form.location?.trim()) errors.location = "장소를 입력해 주세요.";

  // 6. 요청 대상
  if (!form.userId) errors.userId = "요청 대상을 선택해 주세요.";

  // 7. 응답 기한
  if (form.dueDate !== null && isDueDateEntered(form.dueDate)) {
    const minutes = toMinutes(form.dueDate);
    if (minutes < DUE_DATE_MIN_MINUTES) { // 2) 최소 기한 미달
      errors.dueDate = "응답 기한은 최소 1시간 이상이어야 해요.";
    } else if (minutes > DUE_DATE_MAX_MINUTES) { // 3) 최대 기한 초과
      errors.dueDate = "응답 기한은 최대 3일까지 설정할 수 있어요.";
    }
  }

  // 8. 시작 & 종료 일시
  // 날짜시각 응답은 [startAt, endAt), 날짜 응답은 종료일 전체를 포함한다.
  const hasTime = (value) => value?.includes("T");
  const situationStart = hasTime(form.situationStartDate)
    ? new Date(form.situationStartDate)
    : formatDateToLocalDayBoundary(form.situationStartDate);
  const situationEnd = hasTime(form.situationEndDate)
    ? new Date(form.situationEndDate)
    : formatDateToLocalDayBoundary(form.situationEndDate, true);
  for (const field of ["startDateTime", "endDateTime"]) {
    const date = toDateFromInput(form[field]);
    if (
      !errors[field] &&
      date &&
      ((situationStart && date < situationStart) ||
        (situationEnd &&
          (hasTime(form.situationEndDate)
            ? date >= situationEnd
            : date > situationEnd)))
    ) {
      errors[field] = "시작·종료 일시는 상황 기간 안에 있어야 해요.";
    }
  }

  // 7. 응답 기한 - 1) 미입력 시, 4) 시작 시간을 초과할 때
  const normalized = normalizeResponseDeadline(form, now);
  return { errors, form: normalized.form, message: normalized.message };
};

/**
 * [N-06] 다시 부탁하기 - "다음" 버튼을 눌렀을 때 유효성 검사
 * 1. 상황
 * - 미입력 시: "상황을 선택해 주세요."
 *
 * 2. 도움 종류
 * - 미입력 시: "도움 종류를 선택해 주세요."
 *
 * 3. 시작 일시
 * - 미입력 시: "시작 일시를 모두 입력해 주세요."
 * - 과거 시간 설정 시: "이미 지난 시간은 시작 시간으로 설정할 수 없어요."
 * - 여유 시간 부족 시 (< 1시간): "시작 시간은 지금으로부터 최소 1시간 이후여야 해요."
 *
 * 4. 종료 일시
 * - 미입력 시: "종료 일시를 모두 입력해 주세요."
 * - 시작 시간보다 빠른 경우: "종료 시간은 시작 시간 이후로 정해 주세요."
 *
 * 5. 장소
 * - 미입력 또는 공백 시: "장소를 입력해 주세요."
 *
 * 6. 요청 대상
 * - 미선택 시: "요청 대상을 선택해 주세요."
 *
 * 7. 응답 기한 (1, 4는 normalizeResponseDeadline에서 처리)
 * - 1) 미입력 시: "응답 기한은 24시간으로 고정됩니다." (이때 실제 값은 24시간으로 세팅되며, 토스트 메시지를 출력하긴 하지만 다음 페이지로 이동함)
 * - 2) 최소 기한 미달 (< 1시간): "응답 기한은 최소 1시간 이상이어야 해요."
 * - 3) 최대 기한 초과 (> 3일): "응답 기한은 최대 3일까지 설정할 수 있어요."
 * - 4) 시작 시간을 초과할 때 (현재+기한 > 시작시간): "응답 기한은 시작 시간까지로 고정됩니다." (이때 실제 값은 null로 세팅되며, 화면에는 "시작 시간까지"로 표시됨. 토스트 메시지를 출력하긴 하지만 다음 페이지로 이동함)
 *
 * 8. 시작 & 종료 일시
 * - 상황 기간 밖: "시작·종료 일시는 상황 기간 안에 있어야 해요."
 *
 */
export const editValidateInput = (form, now) => {
  const errors = {};
  const start = toDateFromInput(form.startDateTime);
  const end = toDateFromInput(form.endDateTime);
  if (!start) {
    errors.startDateTime = "시작 일시를 모두 입력해 주세요.";
  } else {
    const leadMinutes = (start - now) / MS_PER_MINUTE;
    if (leadMinutes <= 0) {
      errors.startDateTime = "이미 지난 시간은 시작 시간으로 설정할 수 없어요.";
    } else if (leadMinutes < START_MIN_LEAD_MINUTES) {
      errors.startDateTime =
        "시작 시간은 지금으로부터 최소 1시간 이후여야 해요.";
    }
  }
  if (!end) {
    errors.endDateTime = "종료 일시를 모두 입력해 주세요.";
  } else if (start && end <= start) {
    errors.endDateTime = "종료 시간은 시작 시간 이후로 정해 주세요.";
  }
  if (!form.location?.trim()) errors.location = "장소를 입력해 주세요.";
  // 날짜시각 응답은 [startAt, endAt), 날짜 응답은 종료일 전체를 포함한다.
  const hasTime = (value) => value?.includes("T");
  const situationStart = hasTime(form.situationStartDate)
    ? new Date(form.situationStartDate)
    : formatDateToLocalDayBoundary(form.situationStartDate);
  const situationEnd = hasTime(form.situationEndDate)
    ? new Date(form.situationEndDate)
    : formatDateToLocalDayBoundary(form.situationEndDate, true);
  for (const field of ["startDateTime", "endDateTime"]) {
    const date = toDateFromInput(form[field]);
    if (
      !errors[field] &&
      date &&
      ((situationStart && date < situationStart) ||
        (situationEnd &&
          (hasTime(form.situationEndDate)
            ? date >= situationEnd
            : date > situationEnd)))
    ) {
      errors[field] = "시작·종료 일시는 상황 기간 안에 있어야 해요.";
    }
  }
  return errors;
};

// 다시 부탁하기
export const askAgainValidateInput = (form) => {
  const errors = {};
  if (!form.userId) errors.userId = "요청 대상을 선택해 주세요.";
  if (form.dueDate !== null && isDueDateEntered(form.dueDate)) {
    const minutes = toMinutes(form.dueDate);
    if (minutes < DUE_DATE_MIN_MINUTES) {
      errors.dueDate = "응답 기한은 최소 1시간 이상이어야 해요.";
    } else if (minutes > DUE_DATE_MAX_MINUTES) {
      errors.dueDate = "응답 기한은 최대 3일까지 설정할 수 있어요.";
    }
  }
  return errors;
};

export const normalizeResponseDeadline = (form, now = new Date()) => {
  // 이미 '시작 시간까지'로 설정되어 있는 경우는 그대로 유지 (추가 보정 및 안내 없이 그대로 반환)
  if (form.dueDate === null) return { form, message: null };

  let nextForm = form;
  let message = null;
  if (!isDueDateEntered(form.dueDate)) { // 1) 미입력 시
    nextForm = {
      ...form,
      dueDate: { days: String(DUE_DATE_DEFAULT_MINUTES / (24 * 60)) },
    };
    message = DEADLINE_NOTICE.DEFAULT;
  }

  // 응답 기한이 시작 시간을 넘는지 계산
  const start = toDateFromInput(form.startDateTime);
  const minutes = toMinutes(nextForm.dueDate);
  const exceedsStart =
    start && now.getTime() + minutes * MS_PER_MINUTE > start.getTime();

  // 응답 기한이 시작 시간을 넘고, 허용된 기한(1시간 ~ 3일)이면 null로 보정 ('시작 시간까지'로)
  if (
  exceedsStart &&
  minutes >= DUE_DATE_MIN_MINUTES &&
  minutes <= DUE_DATE_MAX_MINUTES
) { // 4) 시작 시간을 초과할 때
    return { form: { ...nextForm, dueDate: null }, message: DEADLINE_NOTICE.FIXED };
  }

  // 위 조건에 해당하지 않으면 그대로 반환
  return { form: nextForm, message };
};

