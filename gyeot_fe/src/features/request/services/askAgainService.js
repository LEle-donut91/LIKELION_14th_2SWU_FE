import { HELP_TYPE_LABELS } from "@/features/request/constants/requestFormConstants";
import { USER_ORDER_STATE_TEXT } from "@/features/request/constants/requestDetailConstants";
import { formatShortDateTimeRange } from "@/shared/utils/dateFormat";
import { toDateTimeInput } from "@/features/request/utils/dateTimeFormat";
import {
  toMinutes,
} from "@/features/request/utils/dueDateFormat";
import {
  flattenInformationItems,
  toUniqueNumberIds,
} from "@/features/request/utils/getSafetyCardInfo";
import { getOrderState } from "@/features/request/utils/getRequestDetail";
import {
  buildInformationItem,
  buildPlaceItem,
  buildScheduleItem,
} from "@/features/request/utils/infoListBuilders";

// [N-06] 다시 부탁하기 - 이전 요청에서 선택됐던 공개 정보 요약 항목
export const getAskAgainInformationService = (response) => {
  const selectedItems = flattenInformationItems(response).filter(
    (item) => item.selected,
  );
  return buildInformationItem(
    selectedItems.map((item) => ({ name: item.typeName })),
  );
};

// [N-06] 다시 부탁하기 - 이전 요청 상세 가공 (요약 카드 / 대상 이력 / 폼 초기값)
export const getAskAgainDetailService = (response) => {
  const raw = response?.data ?? {};
  const assignments = raw.assignments ?? [];
  return {
    reqType: HELP_TYPE_LABELS[raw.helpType] ?? "",
    reqMsg: raw.description ?? "",
    initialForm: {
      situationId:
        raw.situation?.situationId != null
          ? String(raw.situation.situationId)
          : null,
      situationStartDate: raw.situation?.startAt ?? null,
      situationEndDate: raw.situation?.endAt ?? null,
      helpType: raw.helpType ?? null,
      startDateTime: toDateTimeInput(raw.startsAt),
      endDateTime: toDateTimeInput(raw.endsAt),
      location: raw.place ?? null,
      content: raw.description ?? null,
    },
    infoList: [
      buildScheduleItem(
        "일정",
        raw.startsAt,
        raw.endsAt,
        formatShortDateTimeRange,
      ),
      buildPlaceItem(raw.place),
    ],
    userRecord: assignments.map((assignment, index) => ({
      name: assignment.target?.name ?? "",
      part: assignment.target?.isGuardian ? "보호자" : "나의 사람",
      state:
        USER_ORDER_STATE_TEXT[
          getOrderState(assignment, raw, index, assignments.length)
        ] ?? "",
    })),
  };
};

// [N-06] 다시 부탁하기 - 요청 API 요청 body 가공
export const postAskAgainService = (
  requestId,
  form,
) => {
  return {
    requestId,
    payload: {
      targetUserId: Number(form.userId),
      ...(form.dueDate !== null && {
        responseDeadlineHours: toMinutes(form.dueDate) / 60,
      }),
      informationIds: toUniqueNumberIds(form.informationIds),
    },
  };
};
