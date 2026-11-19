import { REQUEST_STATE } from "@/features/request/constants/enumConstants";
import {
  formatShortDateTime,
  formatShortDateTimeRange,
} from "@/shared/utils/dateFormat";
import {
  formatLocalDateTime,
  toDateFromInput,
  toDateTimeInput,
} from "@/features/request/utils/dateTimeFormat";
import {
  flattenInformationItems,
  toUniqueNumberIds,
} from "@/features/request/utils/getSafetyCardInfo";
import {
  buildInformationItem,
  buildPlaceItem,
  buildScheduleItem,
} from "@/features/request/utils/infoListBuilders";

// [H-03-01-02] 요청 수정 - 수정 폼 초기값 가공 (수정안이 있으면 수정안 기준)
export const getEditFormService = (response = {}) => {
  const raw = response?.data ?? response ?? {};
  const isEditing = raw.latestProposal != null;
  const draft = isEditing ? raw.latestProposal.after : raw;

  return {
    situationId: raw.situation?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    isEditing,
    userName: raw.currentAssignment?.target?.name ?? "",
    dueDate: draft?.endsAt ? formatShortDateTime(draft.endsAt) : "",
    helpType: raw.helpType,
    initialRequestForm: {
      startDateTime: toDateTimeInput(draft?.startsAt),
      endDateTime: toDateTimeInput(draft?.endsAt),
      location: draft?.place ?? null,
    },
  };
};

// [H-03-01-02] 요청 수정 - 변경 전/후 비교 화면 가공
export const getEditCheckService = (
  response = {},
  requestForm = {},
  informationOptions,
) => {
  const raw = response?.data ?? response ?? {};
  const target = raw.currentAssignment?.target;
  const start = toDateFromInput(requestForm.startDateTime);
  const end = toDateFromInput(requestForm.endDateTime);
  const selectedItems = flattenInformationItems(informationOptions).filter(
    (item) => requestForm.informationIds?.includes(item.informationId),
  );

  return {
    situationId: raw.situation?.situationId ?? "",
    requestId: raw.requestId ?? "",
    isConfirmRequired: raw.status === REQUEST_STATE.ACCEPTED,
    userName: target?.name ?? "",
    userPart: target ? (target.isGuardian ? "보호자" : "나의 사람") : "",
    beforeInfoList: [
      buildScheduleItem(
        "일정",
        raw.startsAt,
        raw.endsAt,
        formatShortDateTimeRange,
      ),
      buildPlaceItem(raw.place),
      buildInformationItem(
        raw.informations ?? raw.latestProposal?.before?.informations,
      ),
    ],
    afterInfoList: [
      buildScheduleItem("일정", start, end, formatShortDateTimeRange),
      buildPlaceItem(requestForm.location),
      buildInformationItem(
        selectedItems.map((item) => ({ name: item.typeName })),
      ),
    ],
  };
};

// 공개 항목이 기존 선택(selected)과 달라졌는지 비교
const hasInformationChanged = (informationIds, informationOptions) => {
  const beforeIds = new Set(
    flattenInformationItems(informationOptions)
      .filter((item) => item.selected)
      .map((item) => Number(item.informationId)),
  );
  return (
    informationIds.length !== beforeIds.size ||
    informationIds.some((id) => !beforeIds.has(id))
  );
};

// 폼 필드 키 -> API 필드 키 (일시)
const DATE_FIELD_MAP = [
  ["startDateTime", "startsAt"],
  ["endDateTime", "endsAt"],
];

// 기존 수정안 또는 요청과 비교해 변경된 필드만 전송
export const patchEditService = (
  requestId,
  requestForm,
  response,
  informationOptions,
) => {
  const raw = response?.data ?? {};
  const before = raw.latestProposal?.after ?? raw;
  const payload = {};

  for (const [formKey, apiKey] of DATE_FIELD_MAP) {
    const date = toDateFromInput(requestForm[formKey]);
    if (date && date.getTime() !== new Date(before[apiKey]).getTime()) {
      payload[apiKey] = formatLocalDateTime(date);
    }
  }

  if (requestForm.location !== before.place)
    payload.place = requestForm.location;

  const informationIds = toUniqueNumberIds(requestForm.informationIds);
  if (hasInformationChanged(informationIds, informationOptions)) {
    payload.informationIds = informationIds;
  }

  return { requestId: Number(requestId), payload };
};
