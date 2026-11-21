/*
아래 사항은 페이지 컴포넌트에서 검증
1. 응답 기한 미입력 시(""일 ""시간 ""분으로 전부 빈 값 입력) -> 기본 응답 기한인 24시간을 저장
2. 합계가 0시간 0분 0초면 (전부 0을 임의로 입력한 경우) -> 기본 응답 기한인 24시간을 저장
*/

import {
  MS_PER_MINUTE,
  DUE_DATE_MAX_MINUTES,
  DUE_DATE_MIN_MINUTES,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/timeConstants";
import { REQUEST_FORM_FIELD_KEY } from "@/features/request/constants/requestFormConstants";
import { REQUEST_EDIT_FIELD_KEY } from "@/features/request/constants/enumConstants";
import { toMinutes } from "@/features/request/utils/dueDateFormat";
import { getEditChanges } from "@/features/request/utils/getEditChanges";
import {
  formatDateToLocalDayBoundary,
  toDateFromInput,
} from "@/features/request/utils/dateTimeFormat";
import {
  DUE_DATE_KEYS,
  DATE_TIME_MAX_LIMITS,
  DATE_TIME_MIN_LIMITS,
  DUE_DATE_MAX_LIMITS,
  DUE_DATE_MIN_LIMITS,
} from "@/features/request/constants/dateTimeInputConstants";
import {
  REQUEST_PREREQUISITE_TOAST_MESSAGE,
  START_PASSED_TOAST_MESSAGE,
  NO_CHANGE_TOAST_MESSAGE,
} from "@/features/request/constants/messageConstants";

/**
 * 날짜·시간·응답 기한 입력값에서 숫자만 남기고 필드별 허용 범위를 확인한다.
 * @param {string} key - 입력 필드명.
 * @param {string} rawValue - 사용자가 입력한 문자열.
 * @returns {string} 숫자 문자열. 미입력 또는 범위 밖이면 빈 문자열.
 */
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

/**
 * 응답 기한의 일·시·분 중 하나라도 입력했는지 확인한다.
 * null·undefined·빈 문자열은 미입력이며, "0"은 입력한 값으로 취급한다.
 * @param {Object|null|undefined} d - 응답 기한 입력 객체.
 * @returns {boolean} 입력한 필드가 있으면 true.
 */
export const isDueDateEntered = (d) =>
  DUE_DATE_KEYS.some((k) => d?.[k] != null && d?.[k] !== "");

/**
 * 상황·도움 종류 선택 전에는 장소·부탁 내용을 읽기 전용으로 표시한다.
 * @param {Object} form - 현재 요청 폼.
 * @returns {boolean} 선행 선택이 부족하면 true.
 */
export const isReadOnly = (form) =>
  !(
    form[REQUEST_FORM_FIELD_KEY.SITUATION_ID] &&
    form[REQUEST_FORM_FIELD_KEY.HELP_TYPE]
  );

/**
 * 하위 입력 항목을 열기 전에 상황·도움 종류 선택을 확인한다.
 * 미선택 시 해당 안내 토스트를 직접 호출한다.
 * @param {Object} form - 현재 요청 폼.
 * @param {Function} showToast - 토스트 출력 함수.
 * @returns {boolean} 두 항목을 모두 선택했으면 true.
 */
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
 * 2. 도움 종류
 * 3. 시작 일시
 * 4. 종료 일시
 * 5. 상황 기간
 * 6. 장소
 * 7. 요청 대상
 * 8. 응답 기한
 * @param {Object} form - 현재 요청 작성 폼.
 * @param {Date} now - 검증 기준 시각.
 * @returns {{errors: Object, form: Object, message: null}} 오류와 저장할 폼. errors가 있으면 이동을 막는다.
 */
export const requestValidateInput = (form, now) => {
  const errors = {};
  const start = toDateFromInput(form.startDateTime); // 시작 시간
  const end = toDateFromInput(form.endDateTime); // 종료 시간

  // 1. 상황
  if (!form.situationId) errors.situationId = "상황을 선택해 주세요.";

  // 2. 도움 종류
  if (!form.helpType) errors.helpType = "도움 종류를 선택해 주세요.";

  // 3. 시작 일시
  validateStartDateTime(start, now, errors);

  // 4. 종료 일시
  validateEndDateTime(start, end, errors);

  // 5. 시작 & 종료 일시
  validateSituationPeriod(form, errors);

  // 6. 장소
  if (!form.location?.trim()) errors.location = "장소를 입력해 주세요.";

  // 7. 요청 대상
  if (!form.userId) errors.userId = "요청 대상을 선택해 주세요.";

  // 8. 응답 기한 - 1) 최소 기한 미달, 2) 최대 기한 초과
  validateDueDateRange(form.dueDate, errors);

  // errors: 이동 차단용 문구 / form: 저장할 값 / message: 이동을 허용하는 안내 문구.
  return { errors, form, message: null };
};

/**
 * [H-03-01-02] 요청 수정 - "다음" 버튼을 눌렀을 때 유효성 검사
 * - 시작 일시의 "과거 시간 설정 시"와 "여유 시간 부족 시"는 사용자가 시작 일시를 입력해서 바뀌었을 때만 검사
 *
 * 1. 시작 일시
 * 2. 종료 일시
 * 3. 장소
 * 4. 시작 & 종료 일시 (상황 기간 밖)
 * 5. 기타
 * - 바뀐 내용 없음: "바뀐 내용이 없습니다."
 * - 공개 항목만 변경해도 변경으로 인정한다.
 *
 * @param {Object} form - 현재 수정 폼.
 * @param {Date} now - 검증 기준 시각.
 * @param {Object} before - 최근 수정안의 after 기준 폼. 수정안이 없으면 원래 요청 기준 폼.
 * @returns {Object} 필드별 오류. 빈 객체면 다음 단계로 진행할 수 있다.
 */
export const editValidateInput = (form, now, before) => {
  const errors = {};
  // before는 최근 수정안의 after 값, 수정안이 없으면 원래 요청 값이다.
  // 현재 입력값과 비교해 실제로 달라진 필드만 가져온다.
  const changes = getEditChanges(form, before);
  const start = toDateFromInput(form.startDateTime);
  const end = toDateFromInput(form.endDateTime);

  // 1. 시작 일시
  validateStartDateTime(start, now, errors, Object.hasOwn(changes, REQUEST_EDIT_FIELD_KEY.STARTS_AT));
  
  // 2. 종료 일시
  validateEndDateTime(start, end, errors);

  // 3. 장소
  if (!form.location?.trim()) errors.location = "장소를 입력해 주세요.";

  // 4. 시작 & 종료 일시
  validateSituationPeriod(form, errors);

  // 5. 기타
  // 다른 입력 오류가 없고, 일정·장소·공개 항목 모두 변경하지 않았으면 이동을 막는다.
  // 공개 항목만 변경해도 changes에 informationIds가 있으므로 이 조건에 해당하지 않는다.
  if (Object.keys(errors).length === 0 && Object.keys(changes).length === 0) {
    errors.noChanges = NO_CHANGE_TOAST_MESSAGE;
  }
  return errors;
};

/**
 * [N-06] 다시 부탁하기 - "다음" 버튼을 눌렀을 때 유효성 검사
 *
 * 1. 시작 시간 ("과거 시간 설정 시" 규칙만 검사)
 * 2. 새 요청 대상
 * 3. 응답 기한
 * - 3.1 시작까지 남은 시간이 1시간 이상인 경우 - 기존 응답 기한 검사 전부 수행
 * - 3.2 시작까지 남은 시간이 1시간 미만인 경우 - 검사 생략
 * 
 * 화면 담당: 진입 시각 기준 1시간 미만이면 입력을 잠그고 클릭 시 입력 불가 토스트 메시지를 출력한다.
 * null의 화면 표시는 "시작 시간까지"이며, 입력 잠금·표시·토스트는 이 함수에서 처리하지 않는다.
 *
 * @param {Object} form - 현재 다시 부탁하기 폼.
 * @param {boolean} isDueDateFixed - 호출부가 판단한 기한 입력 고정 여부.
 * @param {Date} [now] - 검증 기준 시각. 생략하면 현재 시각.
 * @returns {{errors: Object, form: Object, message: null}} 오류와 저장할 폼. errors가 있으면 이동을 막는다.
 *
 */
export const askAgainValidateInput = (form, isDueDateFixed, now = new Date()) => {
  const errors = {};
  const start = toDateFromInput(form.startDateTime);

  // 1. 시작 시간
  if (start && start <= now) {
    errors.startDateTime = START_PASSED_TOAST_MESSAGE;
    return { errors, form, message: null };
  }
  // 2. 새 요청 대상
  if (!form.userId) errors.userId = "요청 대상을 선택해 주세요.";

  // 3. 응답 기한
  // 3.1 시작까지 남은 시간이 1시간 이상인 경우
  if (!isDueDateFixed) {
    // 1) 최소 기한 미달, 2) 최대 기한 초과
    validateDueDateRange(form.dueDate, errors);

    
    // errors: 이동 차단용 문구 / form: 저장할 값 / message: 이동을 허용하는 안내 문구.
    return { errors, form, message: null };
  }
  // 3.2 시작까지 남은 시간이 1시간 미만인 경우
  return { errors, form: { ...form, dueDate: null }, message: null };
};

/**
 * 시작 일시 검사
 * - 미입력 시: "시작 일시를 모두 입력해 주세요."
 * - 과거 시간 설정 시: "이미 지난 시간은 시작 시간으로 설정할 수 없어요."
 * - 여유 시간 부족 시 (< 1시간): "시작 시간은 지금으로부터 최소 1시간 이후여야 해요."
 * 
 * @param {Date|null} start - 입력한 시작 일시.
 * @param {Date} now - 검증 기준 시각.
 * @param {Object} errors - 오류를 기록할 객체(startDateTime).
 * @param {boolean} [checkLead=true] - false면 미입력만 검사한다. 요청 수정에서 변경 여부를 전달한다.
 * @returns {void}
 */
const validateStartDateTime = (start, now, errors, checkLead = true) => {
  if (!start) {
    errors.startDateTime = "시작 일시를 모두 입력해 주세요.";
  } else if (checkLead) {
    const leadMinutes = (start - now) / MS_PER_MINUTE;
    if (leadMinutes <= 0) {
      errors.startDateTime = "이미 지난 시간은 시작 시간으로 설정할 수 없어요.";
    } else if (leadMinutes < START_MIN_LEAD_MINUTES) {
      errors.startDateTime =
        "시작 시간은 지금으로부터 최소 1시간 이후여야 해요.";
    }
  }
};

/**
 * 종료 일시 검사
 * - 미입력 시: "종료 일시를 모두 입력해 주세요."
 * - 시작 시간보다 같거나 빠른 경우: "종료 시간은 시작 시간 이후로 정해 주세요."
 * 
 * @param {Date|null} start - 입력한 시작 일시.
 * @param {Date|null} end - 입력한 종료 일시.
 * @param {Object} errors - 오류를 기록할 객체(endDateTime).
 * @returns {void}
 */
const validateEndDateTime = (start, end, errors) => {
  if (!end) {
    errors.endDateTime = "종료 일시를 모두 입력해 주세요.";
  } else if (start && end <= start) {
    errors.endDateTime = "종료 시간은 시작 시간 이후로 정해 주세요.";
  }
};

/**
 * 응답 기한 검사 (null·미입력은 생략)
 * - 1) 최소 기한 미달 (< 1시간): "응답 기한은 최소 1시간 이상이어야 해요."
 * - 2) 최대 기한 초과 (> 3일): "응답 기한은 최대 3일까지 설정할 수 있어요."
 * @param {Object|null} dueDate - 일·시·분 입력 객체.
 * @param {Object} errors - 오류를 기록할 객체(dueDate).
 * @returns {void}
 */
const validateDueDateRange = (dueDate, errors) => {
  if (dueDate !== null && isDueDateEntered(dueDate)) {
    const minutes = toMinutes(dueDate);
    if (minutes < DUE_DATE_MIN_MINUTES) { // 1) 최소 기한 미달
      errors.dueDate = "응답 기한은 최소 1시간 이상이어야 해요.";
    } else if (minutes > DUE_DATE_MAX_MINUTES) { // 2) 최대 기한 초과
      errors.dueDate = "응답 기한은 최대 3일까지 설정할 수 있어요.";
    }
  }
};

/**
 * 상황 기간 검사
 * - 상황 기간 밖: "시작·종료 일시는 상황 기간 안에 있어야 해요."
 * 
 * 기존 필드 오류는 유지한다.
 * 날짜·시각 형식의 종료 경계는 제외하고, 날짜만 있으면 종료일 전체를 포함한다.
 * 제공되지 않은 기간 경계는 검사하지 않는다.
 * @param {Object} form - 입력 일시와 상황 시작·종료 기간을 가진 폼.
 * @param {Object} errors - 오류를 기록할 객체(startDateTime·endDateTime).
 * @returns {void}
 */
const validateSituationPeriod = (form, errors) => {
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
};

