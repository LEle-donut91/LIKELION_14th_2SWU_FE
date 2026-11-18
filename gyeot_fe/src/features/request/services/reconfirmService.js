import { HELP_TYPE_LABELS } from "@/features/request/constants/requestFormConstants";
import { formatShortDateTimeRange } from "@/shared/utils/dateFormat";
import {
  buildInformationItem,
  buildPlaceItem,
  buildScheduleItem,
} from "@/features/request/utils/infoListBuilders";

// 변경 전/후 일정, 장소, 정보 목록
const toProposalInfoList = (proposal) => [
  buildScheduleItem(
    "일정",
    proposal?.startsAt,
    proposal?.endsAt,
    formatShortDateTimeRange,
  ),
  buildPlaceItem(proposal?.place),
  buildInformationItem(proposal?.informations),
];

// [N-05] 변경 내용 확인 - 담당자 재확인 화면용 가공
export const getAssigneeReconfirmService = (response = {}) => {
  const raw = response?.data ?? response ?? {};

  return {
    situationId: raw?.situation?.situationId ?? raw?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    proposalId: raw?.latestProposal?.proposalId ?? "",
    userName: raw?.requester?.name ?? "",
    requestType: HELP_TYPE_LABELS[raw?.helpType] ?? "",
    beforeInfoList: toProposalInfoList(raw?.latestProposal?.before),
    afterInfoList: toProposalInfoList(raw?.latestProposal?.after),
  };
};
