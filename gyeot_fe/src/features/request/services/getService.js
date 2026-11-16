import { TARGET_FOOTER_CONFIG, TARGET_FOOTER_KEY } from "@/features/request/constants/footerConstants";
import {
  MS_PER_MINUTE,
  HELP_TYPE_LABELS,
  DUE_DATE_DEFAULT_MINUTES,
  TARGET_GUIDE_LINES,
  TARGET_GUIDE_KEY,
  REQUESTER_ORDER_TITLE,
  REQUESTER_USER_STATE_TEXT,
  ASSIGNEE_SAFETY_INFORMATION,
  USER_ORDER_STATE_TEXT,
} from "@/features/request/constants/requestConstants";
import {
  formatMonthDay,
  formatShortDateTime,
  formatCompactDateTimeRange,
  formatShortDateTimeRange,
  formatPaddedShortDateTime,
} from "@/shared/utils/dateFormat";
import {
  toMinutes,
  getInformationSelectionFlags,
  getReceivedInfoCardTitle,
  getCategoryDescription,
  getReceivedInfoValue,
  getReceivedInfoBadgeText,
  getReceivedInfoUnavailableMessage,
} from "@/features/request/utils/requestUtils";
import {
  REQUEST_STATE,
  DISPLAY_STATUS,
  PROPOSAL_STATUS,
  RESPONSE_STATUS,
  VIEWER_ROLE,
  REQUEST_ACTION,
} from "@/features/request/constants/enumConstants";
import {
  getInfoPreviewService,
} from "@/features/request/services/createService";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconHealthy from "@/shared/assets/icons/iconHealthy.svg";
import { getInformationSummary } from "@/features/request/utils/requestUtils";
import { getRequesterFooter, getAssigneeFooter } from "@/features/request/utils/getFooter";
import { getTargetNotice, getOrderState, getRequesterNotices } from "@/features/request/utils/getRequestDetail";
import { toDateTimeInput } from "@/features/request/utils/dateFormat";

// 대상 후보 조회 API 관련
export const getRequestTargetsService = (raw) =>
  (raw?.data?.items ?? []).map((item) => ({
    id: String(item.userId), // id는 폼의 userId와 === 비교하므로 문자열로 통일
    userName: item.name,
    isGuardian: Boolean(item.isGuardian),
  }));

// 공개 항목 선택지 조회 API 관련
export const getInformationOptionsService = (
  raw,
  requestForm,
) => {
  const categories = (raw?.data?.categories ?? []).map((category) => ({
    key: category.category,
    title: category.categoryName,
    description: getCategoryDescription(category.items),
    items: category.items.map((item) => {
      const updatedText =
        item.updated && item.updatedAt
          ? `, ${formatMonthDay(item.updatedAt)} 갱신`
          : "";
      return {
        id: item.informationId,
        label: item.typeName,
        title: getReceivedInfoCardTitle(item),
        description: `${item.informationValue}${updatedText}`,
        isSensitive: item.sensitive,
        isDefault: item.selected,
      };
    }),
  }));
  const items = categories.flatMap((category) => category.items);
  const informationOptions = {
    categories,
    defaultIds: items.filter((item) => item.isDefault).map((item) => item.id),
    sensitiveIds: items
      .filter((item) => item.isSensitive)
      .map((item) => item.id),
  };


  const selectedIds = requestForm.informationIds;

  return {
    ...informationOptions,
    selectedIds,
    ...getInformationSelectionFlags(
      raw ? informationOptions : undefined,
      selectedIds,
    ),
    dueDate: formatShortDateTime(
      new Date(Date.now() + toMinutes(requestForm.dueDate) * MS_PER_MINUTE),
    ),
  };
};

export const getRequestDetailService = (response = {}) => {
  const raw = response?.data ?? response ?? {};
  const actions = raw.actions ?? [];
  const role = raw.viewerRole?.toLowerCase();
  const isRequester = raw.viewerRole === VIEWER_ROLE.REQUESTER;
  const isAssignee = raw.viewerRole === VIEWER_ROLE.ASSIGNEE;
  const isTarget = raw.viewerRole === VIEWER_ROLE.TARGET;
  const isDoneState = raw.status === REQUEST_STATE.COMPLETED;
  const isProgressState = raw.status === REQUEST_STATE.IN_PROGRESS;
  const isAssignedNoti = raw.displayStatus === DISPLAY_STATUS.NO_ASSIGNEE;
  const isEditPending = raw.latestProposal?.status === PROPOSAL_STATUS.PENDING;
  const responseStatus = raw.myAssignment?.responseStatus;
  const canRespond = isTarget && actions.includes(REQUEST_ACTION.RESPOND)
    && !raw.myAssignment?.closed
    && raw.status !== REQUEST_STATE.CANCELED && raw.status !== REQUEST_STATE.EXPIRED;
  const flags = {
    isAssignedNoti,
    isEditPending,
    isEditInvalid: raw.latestProposal?.status === PROPOSAL_STATUS.INVALIDATED,
    isCancelable: isRequester && actions.includes(REQUEST_ACTION.CANCEL),
    showWithdrawBtn: isAssignee && actions.includes(REQUEST_ACTION.WITHDRAW),
    showChangedNotice: isAssignee && isEditPending,
    showDoneNotice: isAssignee && isDoneState,
    showUserState: isRequester && (isEditPending || isDoneState),
    showUserOrder: isRequester && [DISPLAY_STATUS.WAITING, DISPLAY_STATUS.NO_ASSIGNEE,
      DISPLAY_STATUS.CANCELED, DISPLAY_STATUS.EXPIRED].includes(raw.displayStatus),
    showProgress: isRequester && isProgressState,
    showMessage: !isRequester || !isProgressState,
    showDueDate: isRequester ? raw.displayStatus === DISPLAY_STATUS.WAITING : canRespond,
    showHoldBtn: canRespond && responseStatus == null,
  };
  const targetFooterKey = {
    [RESPONSE_STATUS.CHECK_LATER]: TARGET_FOOTER_KEY.CHANGE,
    [RESPONSE_STATUS.UNAVAILABLE]: TARGET_FOOTER_KEY.CHANGE_TO_ACCEPT,
  }[responseStatus] ?? TARGET_FOOTER_KEY.RESPOND;
  const notice = isTarget ? getTargetNotice(raw) : null;
  let guideLines = [];
  if (isTarget && (notice || raw.myAssignment?.closed)) {
    guideLines = TARGET_GUIDE_LINES[TARGET_GUIDE_KEY.CLOSED];
  } else if (isTarget && [RESPONSE_STATUS.CHECK_LATER, RESPONSE_STATUS.UNAVAILABLE].includes(responseStatus)) {
    guideLines = TARGET_GUIDE_LINES[TARGET_GUIDE_KEY.HOLD];
  }
  const assignments = [...(raw.assignments ?? [])].sort((a, b) => a.order - b.order);
  const deadlineHours = raw.responseDeadlineHours ?? DUE_DATE_DEFAULT_MINUTES / 60;
  const initialDueDate = {
    days: String(Math.floor(deadlineHours / 24)),
    hours: String(deadlineHours % 24),
    minutes: "0",
  };
  const footerConfig = isRequester ? getRequesterFooter(actions)
    : isAssignee ? getAssigneeFooter(actions)
      : canRespond ? TARGET_FOOTER_CONFIG[targetFooterKey] : null;

  return {
    role,
    situation: raw.situation,
    situationId: raw.situation?.situationId ?? "",
    requestId: raw.requestId ?? "",
    proposalId: raw.latestProposal?.proposalId ?? "",
    requestState: raw.status ?? "",
    displayStatus: raw.displayStatus ?? "",
    stepState: [DISPLAY_STATUS.WAITING, DISPLAY_STATUS.NO_ASSIGNEE].includes(raw.displayStatus)
      ? REQUEST_STATE.REQUESTED : raw.displayStatus ?? raw.status ?? "",
    requestType: HELP_TYPE_LABELS[raw.helpType] ?? "",
    userName: (isRequester ? raw.currentAssignment?.target?.name : raw.requester?.name) ?? "",
    userId: raw.currentAssignment?.target?.userId ?? "",
    message: raw.description ?? "",
    dueDate: (isRequester ? raw.currentAssignment?.responseDeadline : raw.myAssignment?.responseDeadline) ?? "",
    initialDueDate,
    infoList: [
      { icon: iconDate, label: "시간", value: raw.startsAt && raw.endsAt
        ? formatCompactDateTimeRange(raw.startsAt, raw.endsAt) : "" },
      { icon: iconLocation, label: "장소", value: raw.place ?? "" },
    ],
    userList: assignments.map((assignment, index) => ({
      order: assignment.order,
      userName: assignment.target?.name ?? "",
      state: getOrderState(assignment, raw, index, assignments.length),
    })),
    flags,
    notices: isRequester ? getRequesterNotices(raw, flags) : [],
    notice,
    footerConfig,
    orderTitle: isAssignedNoti || [REQUEST_STATE.CANCELED, REQUEST_STATE.EXPIRED].includes(raw.status)
      ? REQUESTER_ORDER_TITLE.ASK_OTHER : REQUESTER_ORDER_TITLE.DEFAULT,
    userStateText: isDoneState ? REQUESTER_USER_STATE_TEXT.DONE : REQUESTER_USER_STATE_TEXT.EDIT_PENDING,
    safetyInformation: ASSIGNEE_SAFETY_INFORMATION[raw.status] ?? "",
    guideLines,
  };
};

export const getAssigneeReconfirmService = (response = {}) => {
  const raw = response?.data ?? response ?? {};
  const before = raw?.latestProposal?.before;
  const after = raw?.latestProposal?.after;

  return {
    situationId: raw?.situation?.situationId ?? raw?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    proposalId: raw?.latestProposal?.proposalId ?? "",
    userName: raw?.requester?.name ?? "",
    requestType: HELP_TYPE_LABELS[raw?.helpType] ?? "",

    // 변경 전 일정, 장소, 정보
    beforeInfoList: [
      {
        icon: iconDate,
        label: "일정",
        value: before?.startsAt && before?.endsAt
          ? formatShortDateTimeRange(before.startsAt, before.endsAt) : "",
      },
      { icon: iconLocation, label: "장소", value: before?.place ?? "" },
      { icon: iconHealthy, label: "정보", value: getInformationSummary(before?.informations) },
    ],

    // 변경 후 일정, 장소, 정보
    afterInfoList: [
      {
        icon: iconDate,
        label: "일정",
        value: after?.startsAt && after?.endsAt
          ? formatShortDateTimeRange(after.startsAt, after.endsAt) : "",
      },
      { icon: iconLocation, label: "장소", value: after?.place ?? "" },
      { icon: iconHealthy, label: "정보", value: getInformationSummary(after?.informations) },
    ],
  };
};

export const getReceivedInfoService = (response = {}) => {
  const raw = response?.data ?? response ?? {};
  const isAccessible = Boolean(raw?.accessible);

  return {
    requestId: raw?.requestId ?? "",
    isAccessible,

    // 접근 기한 (볼 수 없을 때도 접근 종료 화면에 표시)
    dueDate: raw?.accessUntil
      ? `~ ${formatPaddedShortDateTime(raw.accessUntil)} (종료 시점)`
      : "",

    // 접근 종료 화면 문구 (볼 수 있으면 "")
    unavailableMessage: isAccessible
      ? ""
      : getReceivedInfoUnavailableMessage(raw?.unavailableReason),

    // 분류별 항목 -> SafetyCardDetail props
    safetyCardDetails: (raw?.categories ?? []).map((category) => ({
      title: category.categoryName,
      cardList: (category.items ?? []).map((item) => ({
        id: item.informationId,
        cardTitle: getReceivedInfoCardTitle(item),
        isSensitive: Boolean(item.sensitive),
        firstInfo: getReceivedInfoValue(item.informationValue),
        secondInfo: getReceivedInfoBadgeText(item),
      })),
    })),
  };
};

export const getEditFormService = (raw) => {
  const isEditing = raw?.isEditing ?? false;
  const draft = raw?.draft;

  return {
    situationId: raw?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    isEditing,
    userName: raw?.userName ?? "",
    dueDate: raw?.dueDate ?? "",
    sections: getInfoPreviewService(draft?.sharedInfo).sections,
    initialRequestForm:
      isEditing && draft
        ? {
            startDateTime: draft.startAt,
            endDateTime: draft.endAt,
            location: draft.location,
          }
        : {},
  };
};

export const getEditCheckService = (raw) => ({
  situationId: raw?.situationId ?? "",
  requestId: raw?.requestId ?? "",
  isConfirmRequired: raw?.isAccepted ?? false,
  userName: raw?.userName ?? "",
  userPart: raw?.userPart ?? "",
  beforeInfoList: [
    { icon: iconDate, label: "일정", value: raw?.beforeInfo?.time ?? "" },
    {
      icon: iconLocation,
      label: "장소",
      value: raw?.beforeInfo?.location ?? "",
    },
    { icon: iconHealthy, label: "정보", value: raw?.beforeInfo?.message ?? "" },
  ],
  afterInfoList: [
    { icon: iconDate, label: "일정", value: raw?.afterInfo?.time ?? "" },
    {
      icon: iconLocation,
      label: "장소",
      value: raw?.afterInfo?.location ?? "",
    },
    { icon: iconHealthy, label: "정보", value: raw?.afterInfo?.message ?? "" },
  ],
});

export const getAskAgainInformationService = (response) => {
  const items = (response?.data?.categories ?? [])
    .flatMap((category) => category.items ?? [])
    .filter((item) => item.selected);
  return {
    icon: iconHealthy,
    label: "정보",
    value: getInformationSummary(items.map((item) => ({ name: item.typeName }))),
  };
};

export const getAskAgainDetailService = (response) => {
  const raw = response?.data ?? {};
  const assignments = raw.assignments ?? [];
  return {
    reqType: HELP_TYPE_LABELS[raw.helpType] ?? "",
    reqMsg: raw.description ?? "",
    initialForm: {
      situationId: raw.situation?.situationId != null ? String(raw.situation.situationId) : null,
      situationStartDate: raw.situation?.startDate ?? null,
      situationEndDate: raw.situation?.endDate ?? null,
      helpType: raw.helpType ?? null,
      startDateTime: toDateTimeInput(raw.startsAt),
      endDateTime: toDateTimeInput(raw.endsAt),
      location: raw.place ?? null,
      content: raw.description ?? null,
    },
    infoList: [
      { icon: iconDate, label: "일정", value: raw.startsAt && raw.endsAt
        ? formatShortDateTimeRange(raw.startsAt, raw.endsAt) : "" },
      { icon: iconLocation, label: "장소", value: raw.place ?? "" },
    ],
    userRecord: assignments.map((assignment, index) => ({
      name: assignment.target?.name ?? "",
      part: assignment.target?.isGuardian ? "보호자" : "나의 사람",
      state: USER_ORDER_STATE_TEXT[getOrderState(assignment, raw, index, assignments.length)] ?? "",
    })),
  };
};
