import { MS_PER_MINUTE } from "@/features/request/constants/timeConstants";
import { formatMonthDay, formatShortDateTime } from "@/shared/utils/dateFormat";
import { toMinutes } from "@/features/request/utils/dueDateUtils";
import {
  getCategoryDescription,
  getSafetyCardInfoTitle,
  getSafetyCardInfoValue,
  getInformationSelectionFlags,
} from "@/features/request/utils/getSafetyCardInfo";

const toInformationItem = (item) => {
  const updatedText =
    item.updated && item.updatedAt
      ? `, ${formatMonthDay(item.updatedAt)} 갱신`
      : "";
  return {
    id: item.informationId,
    label: item.typeName,
    title: getSafetyCardInfoTitle(item),
    description: `${getSafetyCardInfoValue(item.informationValue)}${updatedText}`,
    isSensitive: item.sensitive,
    isDefault: item.selected,
  };
};

const toCategory = (category) => ({
  key: category.category,
  title: category.categoryName,
  description: getCategoryDescription(category.items),
  items: category.items.map(toInformationItem),
});

// 공개 항목 선택지 조회 API 응답 가공 (+ 현재 폼의 선택 상태/접근 기한 계산)
export const getInformationOptionsService = (raw, requestForm) => {
  const categories = (raw?.data?.categories ?? []).map(toCategory);
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
