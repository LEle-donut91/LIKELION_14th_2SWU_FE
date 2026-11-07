import {
  getTargetFlags,
  getTargetFooterKey,
  getTargetGuideLines,
  getTargetNotice,
} from "@/features/request/utils/requestUtils";

import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";

/**
 * =====================================================================
 * [H-03-01-B] 요청 상세 · 대상자 뷰
 * - 조회 후 데이터 가공 (화면 조건 계산 포함)
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// 요청 상세(대상자 뷰) - 데이터 조회 후 가공
export const getTargetService = (raw) => {
  const targetState = raw?.targetState ?? "";
  const flags = getTargetFlags(targetState);

  return {
    situationId: raw?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    targetState,
    userName: raw?.userName ?? "",
    requestType: raw?.requestType ?? "",
    message: raw?.message ?? "",
    dueDate: raw?.dueDate ?? "",

    // RequestSummary에 넘길 시간/장소 목록
    infoList: [
      { icon: iconDate, label: "시간", value: raw?.time ?? "" },
      { icon: iconLocation, label: "장소", value: raw?.location ?? "" },
    ],

    // 화면 조건 / 알림 / 푸터 / 안내 문구
    flags,
    notice: getTargetNotice(flags, targetState),
    footerKey: getTargetFooterKey(flags),
    guideLines: getTargetGuideLines(flags),
  };
};
