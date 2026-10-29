import { useState } from "react";
import { DATE_TIME_KEYS } from "@/features/request/constants/requestConstants";

/**
 * 날짜+시간 값. 모든 필드는 "문자열"이며, 입력 전/범위 밖 값은 ""(빈 문자열)
 * 예) { year: "2026", month: "11", day: "3", hour: "9", minute: "30" }
 * @typedef {Object} DateTimeValue
 * @property {string} [year]
 * @property {string} [month]
 * @property {string} [day]
 * @property {string} [hour]
 * @property {string} [minute]
 */

/**
 * 응답 기한 값. 사용자가 입력한 키만 존재할 수 있음 (없는 키 = 0으로 취급)
 * 예) { days: "1" } / { days: "0", hours: "3", minutes: "30" }
 * @typedef {Object} DueDateValue
 * @property {string} [days]
 * @property {string} [hours]
 * @property {string} [minutes]
 */

/**
 * 요청 작성 폼 전체 (이 객체가 /request 화면의 유일한 "입력값" state)
 * @typedef {Object} RequestForm
 * @property {string|null} situationId      상황 id. 예) "1"  (미선택 = null)
 * @property {string|null} userId           요청 대상 id. 예) "2"  (미선택 = null)
 * @property {string|null} helpType         HELP_TYPE_OPTIONS 중 하나. 예) "병원 동행"  (미선택 = null)
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

/** 5개 필드가 전부 채워졌는지 (일부만 입력된 미완성 값을 걸러냄) */
export const isDateTimeComplete = (v) =>
  !!v && DATE_TIME_KEYS.every((k) => v[k] !== undefined && v[k] !== "");

/** 응답 기한이 0일 0시간 0분이면 안 됨 */
const isDueDateValid = (d) =>
  (parseInt(d?.days, 10) || 0) +
    (parseInt(d?.hours, 10) || 0) +
    (parseInt(d?.minutes, 10) || 0) >
  0;

/**
 * 필수값 검증. 통과하면 빈 객체, 문제 있으면 { 필드명: "이유" }
 * 부탁 내용(content)을 제외한 모든 항목이 필수.
 * 에러는 화면 위에서 아래 순서로 쌓이므로, Object.values(errors)[0] 이 가장 위쪽 문제.
 * @param {RequestForm} form
 */
export const validateRequestForm = (form) => {
  const errors = {};

  // 필수 항목은 시간, 장소, 요청 대상, 응답 기한만
  // if (!form.situationId) errors.situationId = "상황을 선택해 주세요.";
  // if (!form.helpType) errors.helpType = "도움 종류를 선택해 주세요.";

  if (!isDateTimeComplete(form.startDateTime)) {
    errors.startDateTime = "시작 일시를 모두 입력해 주세요.";
  }
  if (!isDateTimeComplete(form.endDateTime)) {
    errors.endDateTime = "종료 일시를 모두 입력해 주세요.";
  } 
  if (!form.location?.trim()) errors.location = "장소를 입력해 주세요.";
  if (!form.userId) errors.userId = "요청 대상을 선택해 주세요.";
  if (!isDueDateValid(form.dueDate)) errors.dueDate = "응답 기한을 입력해 주세요.";

  return errors;
};

/**
 * @param {string} [initialSituationId] 라우트 파라미터(/request/:id)로 받은 상황 id
 * @returns {{
 *   form: RequestForm,
 *   setField: <K extends keyof RequestForm>(key: K, value: RequestForm[K]) => void,
 *   errors: Record<string, string>,
 *   isValid: boolean,
 * }}
 */
export function useRequestForm(initialSituationId) {
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    situationId: initialSituationId ?? null, // undefined 대신 null로 통일
  }));

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const errors = validateRequestForm(form);
  const isValid = Object.keys(errors).length === 0;

  return { form, setField, errors, isValid };
}
