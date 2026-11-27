import { REQUEST_STATE, PROPOSAL_STATUS } from "@/features/request/constants/enumConstants";
import {
  formatShortDateTime,
  formatShortDateTimeRange,
} from "@/shared/utils/dateFormat";
import {
  toDateFromInput,
  toDateTimeInput,
} from "@/features/request/utils/dateTimeFormat";
import {
  flattenInformationItems,
} from "@/features/request/utils/getSafetyCardInfo";
import {
  buildInformationItem,
  buildPlaceItem,
  buildScheduleItem,
} from "@/features/request/utils/infoListBuilders";
import { getEditChanges } from "@/features/request/utils/getEditChanges";

// [H-03-01-02] 요청 수정 - 수정 폼 초기값 가공 (수정안이 있으면 수정안 기준)
export const getEditFormService = (response = {}) => {
  const raw = response?.data ?? response ?? {};
  const isEditing = raw.latestProposal?.status === PROPOSAL_STATUS.PENDING;
  const draft = isEditing ? raw.latestProposal.after : raw;

  return {
    situationId: raw.situation?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    isEditing,
    userName: raw.currentAssignment?.target?.name ?? "",
    dueDate: draft?.endsAt ? formatShortDateTime(draft.endsAt) : "",
    helpType: raw.helpType,
    initialRequestForm: {
      situationStartDate: raw.situation?.startAt ?? null,
      situationEndDate: raw.situation?.endAt ?? null,
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
  const isEditing = raw.latestProposal?.status === PROPOSAL_STATUS.PENDING;
  const draft = isEditing ? raw.latestProposal.after : raw;
  const informationItems = flattenInformationItems(informationOptions);

  // 변경 전 Card의 "정보" 항목: 수정안 여부와 관계없이 선택지 API의 기존 공개 항목을 표시한다.
  const beforeInformations = informationItems
    .filter((item) => item.selected)
    .map((item) => ({ name: item.typeName }));
  
  const start = toDateFromInput(requestForm.startDateTime);
  const end = toDateFromInput(requestForm.endDateTime);
  const selectedItems = informationItems.filter(
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
        draft.startsAt,
        draft.endsAt,
        formatShortDateTimeRange,
      ),
      buildPlaceItem(draft.place),
      buildInformationItem(beforeInformations),
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

// 기존 수정안 또는 요청과 비교해 변경된 필드만 전송
export const patchEditService = (
  requestId,
  requestForm,
  response,
  informationOptions,
) => {
  // 수정 전 비교 기준을 폼과 같은 형태(startDateTime·endDateTime·location)로 가져온다.
  // before는 기존 일정·장소를 의미
  // 최근 수정안이 있으면 latestProposal.after, 없으면 원래 요청 값을 사용한다.
  const before = getEditFormService(response).initialRequestForm;

  // 여기의 informationIds는 PATCH 전송 시 변경 여부를 판단하는 비교 기준
  // 서버가 selected로 표시한 기존에 선택된 항목만 남긴 뒤(filter), ID만 추출(map).
  const raw = response?.data ?? response ?? {};
  const isEditing = raw.latestProposal?.status === PROPOSAL_STATUS.PENDING;
  const informationIds = isEditing
    ? (raw.latestProposal.after.informations ?? []).map((item) => item.informationId)
    : flattenInformationItems(informationOptions)
        .filter((item) => item.selected)
        .map((item) => item.informationId);

  // 일정·장소 기준값(before)에 기존 공개 항목 ID를 합쳐 비교 기준 객체를 만든다.
  // 현재 입력값(requestForm)과 비교해 바뀐 필드만 PATCH 요청 데이터로 만든다.
  // 예: 장소만 바뀌면 { place: "새 장소" }, 공개 항목을 모두 해제하면 { informationIds: [] }.
  const payload = getEditChanges(requestForm, { ...before, informationIds });

  return { requestId: Number(requestId), payload };
};
