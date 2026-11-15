import {
  MS_PER_MINUTE,
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
} from "@/features/request/utils/requestUtils";

export const validateInput = (form, now, fields = null) => {
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
    const start = toDate(form.startDateTime);
    const end = toDate(form.endDateTime);
    if (!isDateTimeComplete(form.endDateTime)) {
      errors.endDateTime = "종료 일시를 모두 입력해 주세요.";
    }
    else if (start && end <= start) {
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
