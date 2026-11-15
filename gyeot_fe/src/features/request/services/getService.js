import {
  INFO_PREVIEW_SECTIONS,
  MS_PER_MINUTE,
} from "@/features/request/constants/requestConstants";
import { formatMonthDay, formatShortDateTime } from "@/shared/utils/dateFormat";
import {
  toMinutes,
  getInformationSelectionFlags,
} from "@/features/request/utils/requestUtils";

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
  const categories = (raw?.data?.categories ?? []).map((category, index) => ({
    key: category.category,
    title: category.categoryName,
    description: INFO_PREVIEW_SECTIONS[index]?.description,
    items: category.items.map((item) => {
      const updatedText =
        item.updated && item.updatedAt
          ? `, ${formatMonthDay(item.updatedAt)} 갱신`
          : "";
      return {
        id: item.informationId,
        label: item.typeName,
        title: item.title || item.typeName,
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
