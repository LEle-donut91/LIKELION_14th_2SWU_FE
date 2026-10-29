import { useState } from "react";
import {
  DATE_TIME_KEYS,
  DUE_DATE_KEYS,
  DUE_DATE_MAX_MINUTES,
  DUE_DATE_MIN_MINUTES,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/requestConstants";

/**
 * 날짜+시간 값. 모든 필드는 "문자열"이며, 입력 전/범위 밖 값은 null
 * 예) { year: "2026", month: "11", day: "3", hour: "9", minute: "30" }
 * @typedef {Object} DateTimeValue
 * @property {string|null} [year]
 * @property {string|null} [month]
 * @property {string|null} [day]
 * @property {string|null} [hour]
 * @property {string|null} [minute]
 */

/**
 * 응답 기한 값. 사용자가 입력한 키만 존재할 수 있음 (없는 키/null = 0으로 취급)
 * 예) { days: "1" } / { days: "0", hours: "3", minutes: "30" }
 * @typedef {Object} DueDateValue
 * @property {string|null} [days]
 * @property {string|null} [hours]
 * @property {string|null} [minutes]
 */

/**
 * 요청 작성 폼 전체 (이 객체가 /request 화면의 유일한 "입력값" state)
 * @typedef {Object} RequestForm
 * @property {string|null} situationId      상황 id. 예) "1"  (미선택 = null)
 * @property {string|null} userId           요청 대상 id. 예) "2"  (미선택 = null)
 * @property {string|null} helpType         HELP_TYPE_OPTIONS 중 하나  (미선택 = null)
 * @property {DateTimeValue|null} startDateTime  (미선택 = null)
 * @property {DateTimeValue|null} endDateTime    (미선택 = null)
 * @property {string|null} location         장소. 미입력 = null
 * @property {string|null} content          부탁 내용. 미입력 = null
 * @property {DueDateValue} dueDate         응답 기한. 기본 { days: "1" } (24시간)
 */

/** @type {RequestForm} */
const INITIAL_FORM = {
  situationId: null,
  userId: null,
  helpType: null,
  startDateTime: null,
  endDateTime: null,
  location: null,
  content: null,
  dueDate: { days: "1" },
};

const MS_PER_MINUTE = 60 * 1000;

/** 5개 필드가 전부 채워졌는지 (null / undefined / "" 모두 미입력으로 취급) */
export const isDateTimeComplete = (v) =>
  !!v && DATE_TIME_KEYS.every((k) => v[k] != null && v[k] !== "");

/** DateTimeValue -> Date (미완성이면 null) */
const toDate = (v) =>
  isDateTimeComplete(v)
    ? new Date(+v.year, +v.month - 1, +v.day, +v.hour, +v.minute)
    : null;

/** 응답 기한을 하나라도 입력했는지 (null / undefined / "" 모두 미입력으로 취급) */
const isDueDateEntered = (d) =>
  DUE_DATE_KEYS.some((k) => d?.[k] != null && d?.[k] !== "");

/** 응답 기한을 분 단위 총합으로 환산 (없는 키/null은 0으로 취급) */
const getDueDateMinutes = (d) =>
  (parseInt(d?.days, 10) || 0) * 24 * 60 +
  (parseInt(d?.hours, 10) || 0) * 60 +
  (parseInt(d?.minutes, 10) || 0);

/**
 * 검증. 통과하면 빈 객체, 문제 있으면 { 필드명: "이유" }
 * 시간(now)에 따라 결과가 달라지므로, 렌더마다 계산하지 말고 버튼 클릭 시점에 호출할 것.
 * 에러는 화면 위에서 아래 순서로 쌓이므로, Object.values(errors)[0] 이 가장 위쪽 문제.
 *
 * @param {RequestForm} form
 * @param {Date} now
 */
export const validateRequestForm = (form, now) => {
  const errors = {};

  // 필수 항목은 시간/장소/요청대상/응답 기한 뿐
  // if (!form.situationId) errors.situationId = "상황을 선택해 주세요.";
  // if (!form.helpType) errors.helpType = "도움 종류를 선택해 주세요.";

  // 시작 일시
  const start = toDate(form.startDateTime);
  let isStartValid = false;
  if (!start) {
    errors.startDateTime = "시작 일시를 모두 입력해 주세요.";
  } else {
    const leadMinutes = (start - now) / MS_PER_MINUTE;
    if (leadMinutes <= 0) {
      errors.startDateTime = "이미 지난 시간은 시작 시간으로 설정할 수 없어요.";
    } else if (leadMinutes < START_MIN_LEAD_MINUTES) {
      errors.startDateTime =
        "시작 시간은 지금으로부터 최소 1시간 이후여야 해요.";
    } else {
      isStartValid = true;
    }
  }

  // 종료 일시
  const end = toDate(form.endDateTime);
  if (!isDateTimeComplete(form.endDateTime)) {
    errors.endDateTime = "종료 일시를 모두 입력해 주세요.";
  } else if (isStartValid && end <= start) {
    // 시작 일시가 정상이고, 종료 일시가 시작 일시보다 빠르거나 같을 때
    errors.endDateTime = "종료 시간은 시작 시간보다 늦어야 해요.";
  }

  if (!form.location?.trim()) errors.location = "장소를 입력해 주세요.";
  if (!form.userId) errors.userId = "요청 대상을 선택해 주세요.";

  // 응답 기한
  if (!isDueDateEntered(form.dueDate)) {
    errors.dueDate = "응답 기한을 입력해 주세요.";
  } else {
    const dueMinutes = getDueDateMinutes(form.dueDate);

    if (dueMinutes < DUE_DATE_MIN_MINUTES) {
      errors.dueDate = "응답 기한은 최소 1시간 이상이어야 해요.";
    } else if (dueMinutes > DUE_DATE_MAX_MINUTES) {
      errors.dueDate = "응답 기한은 최대 3일까지 설정할 수 있어요.";
    } else if (isStartValid) {
      // 지금 + 기한이 시작 시간을 넘으면 안 됨 (시작 시간 자체가 틀렸으면 비교하지 않음)
      const deadline = new Date(now.getTime() + dueMinutes * MS_PER_MINUTE);
      if (deadline > start) {
        errors.dueDate = "응답 기한은 시작 시간을 넘을 수 없어요.";
      }
    }
  }

  return errors;
};

/**
 * @param {string} [initialSituationId] 라우트 파라미터(/request/:id)로 받은 상황 id
 * @returns {{
 *   form: RequestForm,
 *   setField: <K extends keyof RequestForm>(key: K, value: RequestForm[K]) => void,
 *   validate: () => Record<string, string>,
 * }}
 */
export function useRequestForm(initialSituationId) {
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    situationId: initialSituationId ?? null, // undefined 대신 null로 통일
  }));

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // 버튼 클릭 시점의 시각으로 검증
  const validate = () => validateRequestForm(form, new Date());

  return { form, setField, validate };
}
