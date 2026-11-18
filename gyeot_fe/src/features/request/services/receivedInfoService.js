import { formatPaddedShortDateTime } from "@/shared/utils/dateFormat";
import {
  getSafetyCardInfoTitle,
  getSafetyCardInfoValue,
  getSafetyCardBadgeText,
  getSafetyCardInfoUnavailableMsg,
} from "@/features/request/utils/getSafetyCardInfo";

const toCardItem = (item) => ({
  id: item.informationId,
  cardTitle: getSafetyCardInfoTitle(item),
  isSensitive: Boolean(item.sensitive),
  firstInfo: getSafetyCardInfoValue(item.informationValue),
  secondInfo: getSafetyCardBadgeText(item),
});

// [H-03-01-01] 전달받은 정보 조회 API 응답 가공
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
      : getSafetyCardInfoUnavailableMsg(raw?.unavailableReason),

    // 분류별 항목 -> SafetyCardDetail props
    safetyCardDetails: (raw?.categories ?? []).map((category) => ({
      title: category.categoryName,
      cardList: (category.items ?? []).map(toCardItem),
    })),
  };
};
