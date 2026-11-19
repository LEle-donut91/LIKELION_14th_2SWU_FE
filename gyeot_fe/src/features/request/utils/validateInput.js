import {
  MS_PER_MINUTE,
  DUE_DATE_MAX_MINUTES,
  DUE_DATE_MIN_MINUTES,
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
import { REQUEST_PREREQUISITE_TOAST_MESSAGE } from "@/features/request/constants/messageConstants";

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

export const validateInput = (form, now, fields = null) => {
  // REQUEST_FORM_FIELD_KEY 구조분해 할당 (유효성 검사 후보 필드만 가져옴)
  const {
    SITUATION_ID,
    HELP_TYPE,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    USER_ID,
    CONTENT,
    DUE_DATE,
  } = REQUEST_FORM_FIELD_KEY;

  const errors = {};

  const targetFields = fields || [
    SITUATION_ID,
    HELP_TYPE,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    USER_ID,
    CONTENT,
    DUE_DATE,
  ];

  // 필수 항목은 상황, 도움 종류, 시간, 장소, 요청대상, 응답 기한
  // 1. 상황
  if (targetFields.includes(SITUATION_ID)) {
    if (!form.situationId) errors.situationId = "상황을 선택해 주세요.";
  }

  // 2. 도움 종류
  if (targetFields.includes(HELP_TYPE)) {
    if (!form.helpType) errors.helpType = "도움 종류를 선택해 주세요.";
  }

  // 3. 시작 일시
  if (targetFields.includes(START_DATE_TIME)) {
    const start = toDateFromInput(form.startDateTime);
    if (!start) {
      errors.startDateTime = "시작 일시를 모두 입력해 주세요.";
    } else {
      const leadMinutes = (start - now) / MS_PER_MINUTE;
      if (leadMinutes <= 0) {
        errors.startDateTime =
          "이미 지난 시간은 시작 시간으로 설정할 수 없어요.";
      } else if (leadMinutes < START_MIN_LEAD_MINUTES) {
        errors.startDateTime =
          "시작 시간은 지금으로부터 최소 1시간 이후여야 해요.";
      }
    }
  }

  // 4. 종료 일시
  if (targetFields.includes(END_DATE_TIME)) {
    const start = toDateFromInput(form.startDateTime);
    const end = toDateFromInput(form.endDateTime);
    if (!end) {
      errors.endDateTime = "종료 일시를 모두 입력해 주세요.";
    } else if (start && end <= start) {
      errors.endDateTime = "종료 시간은 시작 시간보다 늦어야 해요.";
    }
  }

  // 5. 장소
  if (targetFields.includes(LOCATION)) {
    if (!form.location?.trim()) errors.location = "장소를 입력해 주세요.";
  }

  // 6. 요청 대상
  if (targetFields.includes(USER_ID)) {
    if (!form.userId) errors.userId = "요청 대상을 선택해 주세요.";
  }

  // 7. 응답 기한
  if (targetFields.includes(DUE_DATE)) {
    if (form.dueDate !== null && isDueDateEntered(form.dueDate)) {
      const minutes = toMinutes(form.dueDate);
      if (minutes < DUE_DATE_MIN_MINUTES || minutes > DUE_DATE_MAX_MINUTES) {
        errors.dueDate = "응답 기한은 1시간~3일 범위로 입력해 주세요.";
      }
    }
  }
  // 날짜시각 응답은 [startAt, endAt), 기존 날짜 응답은 종료일 전체를 포함한다.
  const hasTime = (value) => value?.includes("T");
  const situationStart = hasTime(form.situationStartDate)
    ? new Date(form.situationStartDate)
    : formatDateToLocalDayBoundary(form.situationStartDate);
  const situationEnd = hasTime(form.situationEndDate)
    ? new Date(form.situationEndDate)
    : formatDateToLocalDayBoundary(form.situationEndDate, true);
  for (const field of [START_DATE_TIME, END_DATE_TIME]) {
    const date = toDateFromInput(form[field]);
    if (
      targetFields.includes(field) &&
      date &&
      ((situationStart && date < situationStart) ||
        (situationEnd && (hasTime(form.situationEndDate) ? date >= situationEnd : date > situationEnd)))
    ) {
      errors[field] = "시작·종료 일시는 상황 기간 안에 있어야 해요.";
    }
  }

  return errors;
};
