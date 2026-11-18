import { TARGET_NOTICE_CONFIG } from "@/features/request/constants/targetViewConstants";
import { USER_ORDER_STATE } from "@/features/request/constants/requestDetailConstants";
import {
  CANCEL_NOTICE_CONFIG,
  NO_ASSIGNEE_NOTICE_CONFIG,
  EDIT_INVALID_NOTICE_CONFIG,
} from "@/features/request/constants/requesterViewConstants";
import {
  REQUEST_STATE,
  ASSIGNMENT_CLOSE_REASON,
  NO_ASSIGNEE_REASON,
  RESPONSE_STATUS,
} from "@/features/request/constants/enumConstants";

export const getTargetNotice = ({ status, myAssignment }) => {
  if (
    myAssignment?.closed &&
    myAssignment.closeReason === ASSIGNMENT_CLOSE_REASON.TARGET_CHANGED
  ) {
    return TARGET_NOTICE_CONFIG[ASSIGNMENT_CLOSE_REASON.TARGET_CHANGED];
  }
  return TARGET_NOTICE_CONFIG[status] ?? null;
};

// 명세의 우선순위대로 부탁 순서 배지를 계산한다.
export const getOrderState = (assignment, raw, index, length) => {
  const { responseStatus, closeReason } = assignment;
  if (responseStatus === RESPONSE_STATUS.UNAVAILABLE)
    return USER_ORDER_STATE.DIFFICULTY;
  if (
    closeReason === ASSIGNMENT_CLOSE_REASON.ACCEPTANCE_WITHDRAWN ||
    (closeReason === ASSIGNMENT_CLOSE_REASON.REQUEST_ENDED &&
      raw.status === REQUEST_STATE.CANCELED)
  ) {
    return USER_ORDER_STATE.CANCEL;
  }
  if (
    closeReason === ASSIGNMENT_CLOSE_REASON.TARGET_CHANGED ||
    (closeReason === ASSIGNMENT_CLOSE_REASON.REQUEST_ENDED &&
      raw.status === REQUEST_STATE.EXPIRED) ||
    (index === length - 1 &&
      raw.noAssigneeReason === NO_ASSIGNEE_REASON.DEADLINE_PASSED)
  ) {
    return USER_ORDER_STATE.EXPIRED;
  }
  if (
    closeReason == null &&
    (responseStatus == null || responseStatus === RESPONSE_STATUS.CHECK_LATER)
  ) {
    return USER_ORDER_STATE.WAITING;
  }
  return null;
};

export const getRequesterNotices = (raw, flags) => {
  const notices = [];
  if (
    raw.status === REQUEST_STATE.CANCELED &&
    CANCEL_NOTICE_CONFIG[raw.cancelReason]
  ) {
    notices.push({ key: "cancel", ...CANCEL_NOTICE_CONFIG[raw.cancelReason] });
  }
  if (raw.status === REQUEST_STATE.EXPIRED) {
    notices.push({
      key: "expired",
      title: "만료됨",
      information: "담당자가 없어 요청이 만료됐어요.",
    });
  }
  if (flags.isAssignedNoti && NO_ASSIGNEE_NOTICE_CONFIG[raw.noAssigneeReason]) {
    notices.push({
      key: "noAssignee",
      ...NO_ASSIGNEE_NOTICE_CONFIG[raw.noAssigneeReason],
    });
  }
  if (flags.isEditInvalid)
    notices.push({ key: "editInvalid", ...EDIT_INVALID_NOTICE_CONFIG });
  return notices;
};
