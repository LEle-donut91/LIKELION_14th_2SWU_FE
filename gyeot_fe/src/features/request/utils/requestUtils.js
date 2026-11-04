import {
  SENSITIVE_KEYS,
  DATE_TIME_KEYS,
  DUE_DATE_KEYS,
  DATE_TIME_MAX_LIMITS,
  DATE_TIME_MIN_LIMITS,
  DUE_DATE_MAX_LIMITS,
  DUE_DATE_MIN_LIMITS,
  MS_PER_MINUTE,
  START_MIN_LEAD_MINUTES,
  REQUEST_FORM_FIELD_KEY,
  REQUEST_PREREQUISITE_TOAST_MESSAGE,
  FIXED_DUE_DATE_TOAST_MESSAGE,
  START_PASSED_TOAST_MESSAGE,
  REQUEST_STATE,
  REQUESTER_FOOTER_KEY,
  REQUESTER_NOTICE_CONFIG,
  REQUESTER_NOTICE_KEY,
  REQUESTER_ORDER_TITLE,
  REQUESTER_USER_STATE_TEXT,
  CHANGE_STATE,
} from "../constants/requestConstants";

/**
 * =====================================================================
 * [request/ 공통] 타이머용 시간 문자열 처리
 * =====================================================================
 */

// 1자리 숫자 앞에 0 붙이기 (예: 1 -> "01")
export const padTimeUnit = (num) => String(num).padStart(2, "0");

// "HH:MM:SS" -> 초 단위 총합 (비어있거나 숫자가 아니면 0 취급)
export const parseTimeToSeconds = (timeStr = "") => {
  const [h, m, s] = String(timeStr)
    .split(":")
    .map((v) => parseInt(v, 10) || 0);
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
};

// 초 단위 총합 -> { hour, minute, second } (각각 2자리 문자열)
export const formatSecondsToTime = (totalSeconds) => ({
  hour: padTimeUnit(Math.floor(totalSeconds / 3600)),
  minute: padTimeUnit(Math.floor((totalSeconds % 3600) / 60)),
  second: padTimeUnit(totalSeconds % 60),
});

/**
 * =========================================================================
 * [H-03-02] 요청 작성
 * - 선행 조건(상황/도움 종류를 모두 선택) 충족 여부 체크 및 관련 토스트 메시지 반환
 * - 사용자 입력값 기반 텍스트 UI 가공 (상황)
 * =========================================================================
 */

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

// 선택된 상황을 화면 표시용 문자열로 가공
export const getSelectedSituationText = (situation, situationId) => {
  const selectedSituation = situation?.find((item) => item.id === situationId);
  return selectedSituation?.title || "선택"; // 없으면 "선택" 출력
};

/**
 * ==============================================================================
 * [H-03-02] 요청 작성
 * [H-03-01-02] 요청 수정 · 취소
 * [N-06] 다시 부탁하기
 * - 사용자가 입력한 데이터 값 보정 (시작/종료의 날짜 입력값, 시간 입력값)
 * - 사용자 입력값 기반 텍스트 UI 가공 (시작, 종료, 요청 대상, 응답 기한)
 * - 시간/날짜 입력값 (DateTimeValue), 응답 기한 입력값 (DueDateValue) 입력됐는지 체크
 * - Date 타입, minute로 변환
 * ==============================================================================
 */

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

// 입력된 날짜/시간 객체를 화면 표시용 문자열(YY/MM/DD HH:mm)로 가공
export const getDateTimeText = (dateTimeObj) => {
  // 없으면 "선택" 출력
  if (!dateTimeObj) return "선택";
  const { year, month, day, hour, minute } = dateTimeObj;

  // 월, 일, 시, 분이 한 자리일 때 앞에 '0'을 붙여줌 (예: "1" -> "01")
  const pad = (value) => String(value).padStart(2, "0");

  if (!year || !month || !day || !hour || !minute) return "선택";

  // year가 4자리 숫자라면 뒤 2자리만 잘라내고, 아니면 원래 값 사용
  const formattedYear =
    String(year).length === 4 ? String(year).slice(-2) : year;

  const datePart = `${formattedYear}/${pad(month)}/${pad(day)}`;
  const timePart = `${pad(hour)}:${pad(minute)}`;
  return `${datePart} ${timePart}`;
};

// 선택된 요청 대상을 화면 표시용 문자열로 가공
export const getSelectedUserText = (user, userId) => {
  const selectedUser = user?.find((item) => item.id === userId);
  return selectedUser?.userName || "한 명 선택"; // 없으면 "한 명 선택" 출력
};

// 입력된 응답 기한 객체를 화면 표시용 문자열 (N일 N시간 N분)으로 가공
export const getDueDateText = (dueDate, isFixed = false) => {
  // 응답 기한이 고정된 경우 "시작 시간까지" 출력
  if (isFixed) return "시작 시간까지";

  // 없으면 "선택" 출력
  if (!dueDate) return "선택";
  const days = parseInt(dueDate.days, 10) || 0;
  const hours = parseInt(dueDate.hours, 10) || 0;
  const minutes = parseInt(dueDate.minutes, 10) || 0;

  // 아무것도 입력하지 않았거나, 0일 0시간 0분으로 입력했을 때 -> "선택" 출력
  if (days === 0 && hours === 0 && minutes === 0) {
    return "선택";
  }

  // 정확히 1일 0시간 0분일 때만 "24시간 (기본)" 출력
  if (days === 1 && hours === 0 && minutes === 0) {
    return "24시간 (기본)";
  }

  // 그 외의 경우 조합해서 출력 (예: "2일 3시간", "1일 30분")
  let text = "";
  if (days > 0) text += `${days}일`;
  if (hours > 0) text += ` ${hours}시간`;
  if (minutes > 0) text += ` ${minutes}분`;

  return text;
};

// 시간/날짜 입력 칸의 5개 필드가 전부 채워졌는지 체크 (null / undefined / "" 은 모두 미입력으로 취급)
export const isDateTimeComplete = (v) =>
  !!v && DATE_TIME_KEYS.every((k) => v[k] != null && v[k] !== "");

// 응답 기한 입력 칸의 3개 필드 중 1개 이상 입력했는지 체크 (null / undefined / "" 은 모두 미입력으로 취급)
export const isDueDateEntered = (d) =>
  DUE_DATE_KEYS.some((k) => d?.[k] != null && d?.[k] !== "");

// 시간/날짜 입력값 객체 (DateTimeValue)를 Date 타입으로 변환
export const toDate = (v) =>
  isDateTimeComplete(v)
    ? new Date(+v.year, +v.month - 1, +v.day, +v.hour, +v.minute)
    : null;

// 응답 기한 입력값 객체 (DueDateValue)를 분 단위 총합으로 환산 (없는 키/null은 0으로 취급)
export const toMinutes = (d) =>
  (parseInt(d?.days, 10) || 0) * 24 * 60 +
  (parseInt(d?.hours, 10) || 0) * 60 +
  (parseInt(d?.minutes, 10) || 0);

/**
 * =====================================================================
 * [H-03-02-01] 공개 정보 미리보기
 * [H-03-01-02] 요청 수정 · 취소
 * - 사용자 입력값(체크한 항목) 기반 텍스트 UI 가공
 * =====================================================================
 */

// 선택된 ID 목록(checkedList)과 원본 데이터 목록(dataList)을 받아서,
// 선택된 항목들의 title을 쉼표(,)로 연결하여 반환
export const getSelectedTitles = (checkedList, dataList) => {
  if (!checkedList || checkedList.length === 0) return "해당 없음";

  return dataList
    .filter((item) => checkedList.includes(item.id))
    .map((item) => item.label)
    .join(", ");
};

// TODO : API 명세서 확인 후 삭제 여부 검토
// 사용자가 체크한 항목 중 민감정보가 포함되어 있으면 true 반환 (아니라면 false)
export const checkSensitiveIncluded = (healthList = [], lifeList = []) => {
  const isHealthSensitiveSelected = healthList.some((id) =>
    SENSITIVE_KEYS.includes(id),
  );
  const isLifeSensitiveSelected = lifeList.some((id) =>
    SENSITIVE_KEYS.includes(id),
  );

  return isHealthSensitiveSelected || isLifeSensitiveSelected;
};

/**
 * =========================================================================
 * [N-06] 다시 부탁하기
 * - 시작 시간 경과 / 응답 기한 고정 여부 체크 및 관련 토스트 메시지 반환
 * =========================================================================
 */

// 시작까지 남은 시간이 1시간 미만이 되는 시점까지 남은 밀리초
// (시작 일시가 불완전하면 null, 이미 1시간 미만이면 음수)
export const getMsUntilStartLeadTooShort = (
  startDateTime,
  now = new Date(),
) => {
  const start = toDate(startDateTime);
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
  const start = toDate(startDateTime);
  if (start && start <= now) {
    showToast(START_PASSED_TOAST_MESSAGE);
    return false;
  }
  return true;
};

/**
 * =====================================================================
 * [H-03-01] 요청 상세 · 요청자 뷰
 * - 상태 플래그 / 알림 / 푸터 / 텍스트 결정
 * =====================================================================
 */

// 서버 데이터에서 요청자 뷰의 모든 조건부 플래그를 한 곳에서 계산
export const getRequesterFlags = ({
  requestState,
  isAssignedNoti,
  changeState,
}) => {
  const isRequestState = requestState === REQUEST_STATE.REQUEST;
  const isAcceptState = requestState === REQUEST_STATE.ACCEPT;
  const isProgressState = requestState === REQUEST_STATE.PROGRESS;
  const isDoneState = requestState === REQUEST_STATE.DONE;
  const isCancelState = requestState === REQUEST_STATE.CANCEL;

  // 수정 상태
  const isEditPending = isAcceptState && changeState === CHANGE_STATE.RECONFIRMING; // 수정안을 담당자가 확인 중
  const isEditInvalid = (isAcceptState || isProgressState) && changeState === CHANGE_STATE.INVALID; // 수정 무효

  return {
    isRequestState,
    isAcceptState,
    isProgressState,
    isDoneState,
    isCancelState,
    isAssignedNoti,
    isEditInvalid,
    isEditPending,

    // 화면 요소 노출 여부
    isCancelable: isRequestState || isAcceptState || isProgressState, // 헤더 우측 "취소" 버튼
    showUserState: isEditPending || isDoneState, // 요청 대상의 상태 카드 (수정사항을 확인 중이에요. 요청사항을 완료했어요!)
    showDueDate: isRequestState, // 응답 기한 (타이머 형태)
    showUserOrder: isRequestState || isCancelState, // 요청 순서/부탁 순서
    showProgress: isProgressState, // 진행 중 표시 (이미지와 하단 안내 텍스트)
    showMessage: !isProgressState, // 요청 내용의 세부 message 표시
  };
};

// 노출할 요청 상태 카드(RequestState) 목록 반환: [{ key, title, information }]
export const getRequesterNotices = (flags, ctx = {}) => {
  const noticeKeys = [];

  // 요청 취소 - 직접 취소했어요.
  if (flags.isCancelState) {
    noticeKeys.push(REQUESTER_NOTICE_KEY.CANCEL);
  }

  // 담당자 없음 - 진행 어려움 응답 / 응답 기한 경과
  if (flags.isRequestState && flags.isAssignedNoti) {
    noticeKeys.push(REQUESTER_NOTICE_KEY.NO_ASSIGNEE);
  }

  // 수정 무효 - 수정이 반영되지 않았어요
  if (flags.isEditInvalid) {
    noticeKeys.push(REQUESTER_NOTICE_KEY.EDIT_INVALID);
  }

  return noticeKeys.map((key) => {
    const { title, information } = REQUESTER_NOTICE_CONFIG[key];
    return {
      key,
      title,
      information:
        typeof information === "function" ? information(ctx) : information,
    };
  });
};

// 상태별 푸터 종류 결정 (없으면 null)
export const getRequesterFooterKey = (flags) => {
  // 요청 상태
  if (flags.isRequestState) {
    return flags.isAssignedNoti
      ? REQUESTER_FOOTER_KEY.EDIT_ASK_AGAIN
      : REQUESTER_FOOTER_KEY.EDIT;
  }

  // 수락 상태
  if (flags.isAcceptState) {
    // 수정안 확인 중이면 [수정, 철회], 아니면 [수정]
    return flags.isEditPending
      ? REQUESTER_FOOTER_KEY.EDIT_WITHDRAW
      : REQUESTER_FOOTER_KEY.EDIT;
  }

  // 진행 상태
  if (flags.isProgressState) return REQUESTER_FOOTER_KEY.DONE;

  // 완료 상태, 취소 상태
  if (flags.isDoneState || flags.isCancelState) {
    return REQUESTER_FOOTER_KEY.SAME_REQUEST;
  }

  return null;
};

// UserOrder(요청 순서, 부탁 순서) 타이틀 결정
export const getRequesterOrderTitle = (flags) =>
  flags.isCancelState || (flags.isRequestState && flags.isAssignedNoti)
    ? REQUESTER_ORDER_TITLE.ASK_OTHER
    : REQUESTER_ORDER_TITLE.DEFAULT;

// 요청 대상 상태 문구 결정 (showUserState일 때만 의미 있음)
export const getRequesterUserStateText = (flags) =>
  flags.isDoneState
    ? REQUESTER_USER_STATE_TEXT.DONE
    : REQUESTER_USER_STATE_TEXT.EDIT_PENDING;
