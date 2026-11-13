import {
  getAssigneeFlags,
  getAssigneeFooterKey,
  getAssigneeSafetyInformation,
} from "@/features/request/utils/requestUtils";
import {
  formatCompactDateTimeRange,
  formatShortDateTimeRange,
} from "@/shared/utils/dateFormat";

import { PROPOSAL_STATUS } from "@/features/request/constants/enumConstants";
import { HELP_TYPE_LABELS } from "@/features/request/constants/requestConstants";

import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconHealthy from "@/shared/assets/icons/iconHealthy.svg";

/**
 * =====================================================================
 * [H-03-01] 요청 상세 · 담당자 뷰
 * - 조회 후 데이터 가공 (화면 조건 계산 포함)
 * - displayStatus, actions 는 응답으로 받지만 아직 로직에는 사용하지 않음
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-01] 요청 상세(담당자 뷰) - 데이터 조회 후 가공
export const getAssigneeService = (raw) => {
  const requestState = raw?.status ?? "";

  // 담당자가 확인해야 하는 수정안이 있으면 "요청이 수정됨"
  const isChanged = raw?.latestProposal?.status === PROPOSAL_STATUS.PENDING;
  const flags = getAssigneeFlags({ requestState, isChanged });

  return {
    situationId: raw?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    requestState,
    requestType: HELP_TYPE_LABELS[raw?.helpType] ?? "",
    userName: raw?.requester?.name ?? "",
    message: raw?.description ?? "",

    // RequestSummary에 넘길 시간/장소 목록
    infoList: [
      {
        icon: iconDate,
        label: "시간",
        value: formatCompactDateTimeRange(raw?.startsAt, raw?.endsAt),
      },
      { icon: iconLocation, label: "장소", value: raw?.place ?? "" },
    ],

    // 화면 조건 / 푸터 / 안내 문구
    flags,
    footerKey: getAssigneeFooterKey(flags),
    safetyInformation: getAssigneeSafetyInformation(requestState),
  };
};

/**
 * =====================================================================
 * [N-05] 변경 내용 확인
 * - 조회 후 데이터 가공
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [N-05] 변경 내용 확인 - 데이터 조회 후 가공
// 반환: { situationId, requestId, userName, requestType, beforeInfoList, afterInfoList }
export const getAssigneeReconfirmService = (raw) => {
  const before = raw?.latestProposal?.before;
  const after = raw?.latestProposal?.after;

  return {
    situationId: raw?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    proposalId: raw?.latestProposal?.proposalId ?? "",
    userName: raw?.requester?.name ?? "",
    requestType: HELP_TYPE_LABELS[raw?.helpType] ?? "",

    // 변경 전 일정, 장소, 정보
    beforeInfoList: [
      {
        icon: iconDate,
        label: "일정",
        value: formatShortDateTimeRange(before?.startsAt, before?.endsAt),
      },
      { icon: iconLocation, label: "장소", value: before?.place ?? "" },
      { icon: iconHealthy, label: "정보", value: before?.information ?? "" },
    ],

    // 변경 후 일정, 장소, 정보
    afterInfoList: [
      {
        icon: iconDate,
        label: "일정",
        value: formatShortDateTimeRange(after?.startsAt, after?.endsAt),
      },
      { icon: iconLocation, label: "장소", value: after?.place ?? "" },
      { icon: iconHealthy, label: "정보", value: after?.information ?? "" },
    ],
  };
};
