import {
  TARGET_FOOTER_CONFIG,
  TARGET_FOOTER_KEY,
} from "@/features/request/constants/footerConstants";
import {
  REQUEST_STATE,
  DISPLAY_STATUS,
  PROPOSAL_STATUS,
  RESPONSE_STATUS,
  VIEWER_ROLE,
  REQUEST_ACTION,
} from "@/features/request/constants/enumConstants";
import { DUE_DATE_DEFAULT_MINUTES } from "@/features/request/constants/timeConstants";
import { HELP_TYPE_LABELS } from "@/features/request/constants/requestFormConstants";
import { ASSIGNEE_SAFETY_INFORMATION } from "@/features/request/constants/requestDetailConstants";
import {
  REQUESTER_ORDER_TITLE,
  REQUESTER_USER_STATE_TEXT,
} from "@/features/request/constants/requesterViewConstants";
import {
  TARGET_GUIDE_KEY,
  TARGET_GUIDE_LINES,
} from "@/features/request/constants/targetViewConstants";
import { formatCompactDateTimeRange } from "@/shared/utils/dateFormat";
import {
  getRequesterFooter,
  getAssigneeFooter,
} from "@/features/request/utils/getFooter";
import {
  getTargetNotice,
  getOrderState,
  getRequesterNotices,
} from "@/features/request/utils/getRequestDetail";
import {
  buildPlaceItem,
  buildScheduleItem,
} from "@/features/request/utils/infoListBuilders";

// 대상자가 이미 응답한 상태에 따라 노출할 푸터 종류
const TARGET_FOOTER_KEY_BY_RESPONSE = {
  [RESPONSE_STATUS.CHECK_LATER]: TARGET_FOOTER_KEY.CHANGE,
  [RESPONSE_STATUS.UNAVAILABLE]: TARGET_FOOTER_KEY.CHANGE_TO_ACCEPT,
};

// 이미 "보류/어려움"으로 응답한 상태 (안내 문구 노출 기준)
const HOLD_RESPONSE_STATUSES = [
  RESPONSE_STATUS.CHECK_LATER,
  RESPONSE_STATUS.UNAVAILABLE,
];

// 서버 응답에서 "누가 / 어떤 상태인지"를 한 번만 계산해 두고 아래 함수들이 공유
const getViewerContext = (raw) => {
  const actions = raw.actions ?? [];
  const isRequester = raw.viewerRole === VIEWER_ROLE.REQUESTER;
  const isAssignee = raw.viewerRole === VIEWER_ROLE.ASSIGNEE;
  const isTarget = raw.viewerRole === VIEWER_ROLE.TARGET;
  const isEnded = [REQUEST_STATE.CANCELED, REQUEST_STATE.EXPIRED].includes(
    raw.status,
  );

  return {
    actions,
    isRequester,
    isAssignee,
    isTarget,
    isEnded,
    responseStatus: raw.myAssignment?.responseStatus,
    isDoneState: raw.status === REQUEST_STATE.COMPLETED,
    isProgressState: raw.status === REQUEST_STATE.IN_PROGRESS,
    isAssignedNoti: raw.displayStatus === DISPLAY_STATUS.NO_ASSIGNEE,
    isEditPending: raw.latestProposal?.status === PROPOSAL_STATUS.PENDING,
    canRespond:
      isTarget &&
      actions.includes(REQUEST_ACTION.RESPOND) &&
      !raw.myAssignment?.closed &&
      !isEnded,
  };
};

// 화면 요소 노출 여부 플래그
const getFlags = (raw, ctx) => {
  const {
    actions,
    isRequester,
    isAssignee,
    isDoneState,
    isProgressState,
    isEditPending,
    canRespond,
  } = ctx;
  return {
    isAssignedNoti: ctx.isAssignedNoti,
    isEditPending,
    isEditInvalid: raw.latestProposal?.status === PROPOSAL_STATUS.INVALIDATED,
    isCancelable: isRequester && actions.includes(REQUEST_ACTION.CANCEL),
    showWithdrawBtn: isAssignee && actions.includes(REQUEST_ACTION.WITHDRAW),
    showChangedNotice: isAssignee && isEditPending,
    showDoneNotice: isAssignee && isDoneState,
    showUserState: isRequester && (isEditPending || isDoneState),
    showUserOrder:
      isRequester &&
      [
        DISPLAY_STATUS.WAITING,
        DISPLAY_STATUS.NO_ASSIGNEE,
        DISPLAY_STATUS.CANCELED,
        DISPLAY_STATUS.EXPIRED,
      ].includes(raw.displayStatus),
    showProgress: isRequester && isProgressState,
    showMessage: !isRequester || !isProgressState,
    showDueDate: isRequester
      ? raw.displayStatus === DISPLAY_STATUS.WAITING
      : canRespond,
    showHoldBtn: canRespond && ctx.responseStatus == null,
  };
};

// 대상자 안내 문구 (응답 불가 / 보류 중)
const getGuideLines = (raw, { isTarget, responseStatus }, notice) => {
  if (!isTarget) return [];
  if (notice || raw.myAssignment?.closed)
    return TARGET_GUIDE_LINES[TARGET_GUIDE_KEY.CLOSED];
  if (HOLD_RESPONSE_STATUSES.includes(responseStatus))
    return TARGET_GUIDE_LINES[TARGET_GUIDE_KEY.HOLD];
  return [];
};

// 역할별 푸터 설정
const getFooterConfig = (ctx) => {
  if (ctx.isRequester) return getRequesterFooter(ctx.actions);
  if (ctx.isAssignee) return getAssigneeFooter(ctx.actions);
  if (!ctx.canRespond) return null;
  const footerKey =
    TARGET_FOOTER_KEY_BY_RESPONSE[ctx.responseStatus] ??
    TARGET_FOOTER_KEY.RESPOND;
  return TARGET_FOOTER_CONFIG[footerKey];
};

// "같은 내용 요청" 시 응답 기한 입력 초기값 (서버의 시간 단위 -> { days, hours, minutes })
const getInitialDueDateInput = (raw) => {
  const deadlineHours =
    raw.responseDeadlineHours ?? DUE_DATE_DEFAULT_MINUTES / 60;
  return {
    days: String(Math.floor(deadlineHours / 24)),
    hours: String(deadlineHours % 24),
    minutes: "0",
  };
};

// [H-03-01] 요청 상세 조회 API 응답 가공 (요청자/담당자/대상자 뷰 공통)
export const getRequestDetailService = (response = {}) => {
  const raw = response?.data ?? response ?? {};
  const ctx = getViewerContext(raw);
  const { isRequester, isTarget, isDoneState, isAssignedNoti } = ctx;

  const flags = getFlags(raw, ctx);
  const notice = isTarget ? getTargetNotice(raw) : null;
  const assignments = [...(raw.assignments ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return {
    role: raw.viewerRole?.toLowerCase(),
    situation: raw.situation,
    situationId: raw.situation?.situationId ?? "",
    requestId: raw.requestId ?? "",
    proposalId: raw.latestProposal?.proposalId ?? "",
    requestState: raw.status ?? "",
    displayStatus: raw.displayStatus ?? "",
    stepState: [DISPLAY_STATUS.WAITING, DISPLAY_STATUS.NO_ASSIGNEE].includes(
      raw.displayStatus,
    )
      ? REQUEST_STATE.REQUESTED
      : (raw.displayStatus ?? raw.status ?? ""),
    requestType: HELP_TYPE_LABELS[raw.helpType] ?? "",
    userName:
      (isRequester
        ? raw.currentAssignment?.target?.name
        : raw.requester?.name) ?? "",
    userId: raw.currentAssignment?.target?.userId ?? "",
    message: raw.description ?? "",
    dueDate:
      (isRequester
        ? raw.currentAssignment?.responseDeadline
        : raw.myAssignment?.responseDeadline) ?? "",
    initialDueDate: getInitialDueDateInput(raw),
    infoList: [
      buildScheduleItem(
        "시간",
        raw.startsAt,
        raw.endsAt,
        formatCompactDateTimeRange,
      ),
      buildPlaceItem(raw.place),
    ],
    userList: assignments.map((assignment, index) => ({
      order: assignment.order,
      userName: assignment.target?.name ?? "",
      state: getOrderState(assignment, raw, index, assignments.length),
    })),
    flags,
    notices: isRequester ? getRequesterNotices(raw, flags) : [],
    notice,
    footerConfig: getFooterConfig(ctx),
    orderTitle:
      isAssignedNoti || ctx.isEnded
        ? REQUESTER_ORDER_TITLE.ASK_OTHER
        : REQUESTER_ORDER_TITLE.DEFAULT,
    userStateText: isDoneState
      ? REQUESTER_USER_STATE_TEXT.DONE
      : REQUESTER_USER_STATE_TEXT.EDIT_PENDING,
    safetyInformation: ASSIGNEE_SAFETY_INFORMATION[raw.status] ?? "",
    guideLines: getGuideLines(raw, ctx, notice),
  };
};
