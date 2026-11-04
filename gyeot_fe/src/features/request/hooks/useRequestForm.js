import { useEffect, useState } from "react";
import {
  MS_PER_MINUTE,
  MAX_TIMEOUT_MS,
  DUE_DATE_MAX_MINUTES,
  DUE_DATE_MIN_MINUTES,
  START_MIN_LEAD_MINUTES,
  REQUEST_FORM_FIELD_KEY,
} from "@/features/request/constants/requestConstants";
import {
  isDateTimeComplete,
  isDueDateEntered,
  toDate,
  toMinutes,
  getInitialDueDate,
  getMsUntilStartLeadTooShort,
} from "@/features/request/utils/requestUtils";

/**
 * ==============================================================================================================================
 * [H-03-02] 요청 작성
 * [H-03-01-02] 요청 수정 · 취소
 * [N-06] 다시 부탁하기
 * - 사용자가 입력 폼 데이터(State)를 통합 관리
 * - 사용자가 입력 폼 데이터의 유효성 검사 -> 에러 목록(객체 형태) 반환
 * - 선행 조건(상황/도움 종류를 모두 선택) 충족 여부 체크 로직은 [H-03-02] 요청 작성 (Request.jsx)에서만 사용하므로 requestUtils.js에 정의
 *
 * ==============================================================================================================================
 */

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
 * 요청 작성 폼 전체
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

// REQUEST_FORM_FIELD_KEY 구조분해 할당 (유효성 검사 후보 필드만 가져옴)
const {
  SITUATION_ID,
  HELP_TYPE,
  START_DATE_TIME,
  END_DATE_TIME,
  LOCATION,
  USER_ID,
  DUE_DATE,
} = REQUEST_FORM_FIELD_KEY;

/**
 * @type {RequestForm}
 * 입력 Form 초기값 설정
 */
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

/**
 * * [validateRequestForm 에러 조건 및 메시지 정리]
 *
 * 1. 상황 (situationId)
 *    - 미입력 시: "상황을 선택해 주세요."
 *
 * 2. 도움 종류 (helpType)
 *    - 미입력 시: "도움 종류를 선택해 주세요."
 *
 * 3. 시작 일시 (startDateTime)
 *    - 미입력 시: "시작 일시를 모두 입력해 주세요."
 *    - 과거 시간 설정 시: "이미 지난 시간은 시작 시간으로 설정할 수 없어요."
 *    - 여유 시간 부족 시 (< 1시간): "시작 시간은 지금으로부터 최소 1시간 이후여야 해요."
 *
 * 4. 종료 일시 (endDateTime)
 *    - 미입력 시: "종료 일시를 모두 입력해 주세요."
 *
 * 5. 장소 (location)
 *    - 미입력 또는 공백 시: "장소를 입력해 주세요."
 *
 * 6. 요청 대상 (userId)
 *    - 미선택 시: "요청 대상을 선택해 주세요."
 *
 * 7. 응답 기한 (dueDate)
 *    - 미입력 시: "응답 기한을 입력해 주세요."
 *    - 최소 기한 미달 (< 1시간): "응답 기한은 최소 1시간 이상이어야 해요."
 *    - 최대 기한 초과 (> 3일): "응답 기한은 최대 3일까지 설정할 수 있어요."
 *    - 시작 시간을 초과할 때 (현재+기한 > 시작시간): "응답 기한은 시작 시간을 넘을 수 없어요."
 *
 * @param {Partial<RequestForm>} form
 * @param {Date} now
 * @param {string[]} [fields] 검증하고 싶은 필드 배열 (없으면 전체 검증)
 */
// 전체 폼 또는 일부 항목 검증 함수
export const validateRequestForm = (form, now, fields = null) => {
  const errors = {};

  const targetFields = fields || [
    SITUATION_ID,
    HELP_TYPE,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    USER_ID,
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
    const start = toDate(form.startDateTime);
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
    // const start = toDate(form.startDateTime);
    // const end = toDate(form.endDateTime);
    if (!isDateTimeComplete(form.endDateTime)) {
      errors.endDateTime = "종료 일시를 모두 입력해 주세요.";
    }
    // else if (start && end <= start) {
    //   errors.endDateTime = "종료 시간은 시작 시간보다 늦어야 해요.";
    // }
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
    if (!isDueDateEntered(form.dueDate)) {
      errors.dueDate = "응답 기한을 입력해 주세요.";
    } else {
      const dueMinutes = toMinutes(form.dueDate);
      const start = toDate(form.startDateTime);

      if (dueMinutes < DUE_DATE_MIN_MINUTES) {
        errors.dueDate = "응답 기한은 최소 1시간 이상이어야 해요.";
      } else if (dueMinutes > DUE_DATE_MAX_MINUTES) {
        errors.dueDate = "응답 기한은 최대 3일까지 설정할 수 있어요.";
      } else if (start) {
        const deadline = new Date(now.getTime() + dueMinutes * MS_PER_MINUTE);
        if (deadline > start) {
          errors.dueDate = "응답 기한은 시작 시간을 넘을 수 없어요.";
        }
      }
    }
  }

  return errors;
};

/**
 * @param {Partial<RequestForm>} [initialValues]
 * @param {Object} [options]
 * @param {boolean} [options.lockDueDate] 시작까지 1시간 미만이면 응답 기한을 null로 고정 ([N-06] 다시 부탁하기)
 *   - 마운트 시점에 이미 1시간 미만이면 초기값을 null로 설정
 *   - 화면을 열어둔 사이 1시간 미만이 되면 그 시점에 null로 전환
 */
export function useRequestForm(
  initialValues = {},
  { lockDueDate = false } = {},
) {
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    ...initialValues,
    ...(lockDueDate && {
      dueDate: getInitialDueDate(
        initialValues.startDateTime,
        INITIAL_FORM.dueDate,
      ),
    }),
  }));

  // 화면을 열어둔 사이 시작까지 1시간 미만이 되면, 그 시점에 응답 기한을 고정(null)으로 전환
  useEffect(() => {
    // 다시 부탁하기 (lockDueDate = true)가 아니라면, 하단 코드 실행 안 하고 바로 리턴
    if (!lockDueDate) return;

    const msUntilFixed = getMsUntilStartLeadTooShort(form.startDateTime);
    if (
      msUntilFixed === null ||
      msUntilFixed < 0 ||
      msUntilFixed > MAX_TIMEOUT_MS
    )
      return;

    const timerId = setTimeout(
      () => setForm((prev) => ({ ...prev, dueDate: null })),
      msUntilFixed,
    );
    return () => clearTimeout(timerId);
  }, [lockDueDate, form.startDateTime]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // 버튼 클릭 시점의 시각으로 검증
  // 특정 필드만 골라서 검증할 수 있도록 fields 인자 추가 지원
  const validate = (fields = null) =>
    validateRequestForm(form, new Date(), fields);

  return { form, setForm, setField, validate };
}
