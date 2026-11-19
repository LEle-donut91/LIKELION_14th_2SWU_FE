import {
  RECEIVED_INFO_TITLE_RULE,
  RECEIVED_INFO_TITLE_RULE_BY_TYPE,
  RECEIVED_INFO_BADGE_TEXT,
  RECEIVED_INFO_UNAVAILABLE_MESSAGE,
  RECEIVED_INFO_DEFAULT_UNAVAILABLE_MESSAGE,
} from "@/features/request/constants/receivedInfoConstants";
import {
  formatMonthDay,
  formatFullKoreanDate,
} from "@/shared/utils/dateFormat";
import { ISO_DATE_ONLY } from "@/shared/constants/dateTimeConstants";

/**
 * [공개 정보] 공개 항목 선택 유틸
 * 분류별 선택 ID 처리 · 민감/기본값 판단 · 선택 항목 요약 텍스트
 * 항목 이름 / 내용 / 갱신·추가 표시 / 접근 종료 문구 결정
 */

// 항목 이름 결정: title / typeName을 유형별 규칙대로 조합 (title이 없으면 typeName만)
export const getSafetyCardInfoTitle = ({
  informationType,
  typeName,
  title,
}) => {
  const rule =
    RECEIVED_INFO_TITLE_RULE_BY_TYPE[informationType] ??
    RECEIVED_INFO_TITLE_RULE.TITLE_FIRST;

  if (!title || rule === RECEIVED_INFO_TITLE_RULE.TYPE_ONLY)
    return typeName ?? "";
  if (rule === RECEIVED_INFO_TITLE_RULE.TITLE_ONLY) return title;
  if (rule === RECEIVED_INFO_TITLE_RULE.TYPE_FIRST)
    return `${typeName} ${title}`;
  return `${title} ${typeName}`;
};

// 항목 내용 결정: "0000-00-00" 형태면 "0000년 00월 00일"로, 아니면 그대로
export const getSafetyCardInfoValue = (informationValue) => {
  if (!ISO_DATE_ONLY.test(informationValue)) return informationValue ?? "";

  // 날짜만 있는 ISO 문자열은 UTC로 해석되므로, 로컬(KST) 자정으로 맞춰서 변환
  const formatted = formatFullKoreanDate(`${informationValue}T00:00:00`);
  return formatted.includes("NaN") ? informationValue : formatted;
};

// 항목 우측 표시 결정
// updated 우선 -> "9/20 갱신" / added만 true -> "추가됨" / 둘 다 false -> 표시 없음
export const getSafetyCardBadgeText = ({ added, updated, updatedAt }) => {
  if (updated) {
    return `${formatMonthDay(updatedAt)} ${RECEIVED_INFO_BADGE_TEXT.UPDATED_DATE_SUFFIX}`;
  }
  if (added) return RECEIVED_INFO_BADGE_TEXT.ADDED;
  return "";
};

// 접근 종료 화면 문구 결정 (unavailableReason 기준)
export const getSafetyCardInfoUnavailableMsg = (unavailableReason) =>
  RECEIVED_INFO_UNAVAILABLE_MESSAGE[unavailableReason] ??
  RECEIVED_INFO_DEFAULT_UNAVAILABLE_MESSAGE;

// 분류에 속한 항목 이름으로 안내 문구 생성 (예: "질환, 알러지가 포함되어 있어요.")
export const getCategoryDescription = (items) => {
  const names = [...new Set(items.map((item) => item.typeName))].join(", ");
  if (!names) return "";

  // 한글 음절은 28개 종성 단위로 반복되며, 나머지가 0이면 받침이 없다.
  const hasFinalConsonant =
    (names.charCodeAt(names.length - 1) - "가".charCodeAt(0)) % 28 !== 0;
  return `${names}${hasFinalConsonant ? "이" : "가"} 포함되어 있어요.`;
};

// 전체 선택 목록에서 해당 분류에 속한 ID만 추출
// selectedIds: 사용자가 체크한 ID 목록 -> [12, 34, 56]
// items: 해당 분류의 항목 목록 -> (기본 정보, 건강 정보, 생활 정보, 미리 남기는 말)
export const getCategoryInformationIds = (selectedIds, items) =>
  selectedIds.filter((id) => items.some((item) => item.id === id));

// 다른 분류의 선택은 유지하고 해당 분류의 선택만 교체
// 예: 12번 체크 해제 후 14번 체크 -> 기존 선택 12, 34, 56 -> 14, 34, 56
export const replaceCategoryInformationIds = (selectedIds, items, nextIds) => {
  const categoryIds = items.map((item) => item.id);
  return [...selectedIds.filter((id) => !categoryIds.includes(id)), ...nextIds];
};

// 선택한 공개 항목의 민감정보 포함 여부와 기본값 일치 여부
export const getInformationSelectionFlags = (
  informationOptions,
  selectedIds,
) => {
  const { defaultIds = [], sensitiveIds = [] } = informationOptions ?? {};
  return {
    isSensitiveIncluded: sensitiveIds.some((id) => selectedIds.includes(id)),
    isDefaultChecked:
      Boolean(informationOptions) &&
      selectedIds.length === defaultIds.length &&
      defaultIds.every((id) => selectedIds.includes(id)),
  };
};

// 선택된 ID 목록(checkedList)과 원본 데이터 목록(dataList)을 받아서,
// 선택된 항목들의 title을 쉼표(,)로 연결하여 반환
export const getSelectedTitles = (checkedList, dataList) => {
  if (!checkedList || checkedList.length === 0) return "해당 없음";

  // new Set(...)은 중복된 값을 하나씩만 남기는 문법
  return [
    ...new Set(
      dataList
        .filter((item) => checkedList.includes(item.id)) // 1. 선택된 항목만 남김
        .map((item) => item.label),
    ),
  ] // 2. 표시할 이름만 추출
    .join(", ");
};

// 이름은 중복 없이 최대 2개 표시하고, 나머지 건수에는 중복 항목도 포함한다.
export const getInformationSummary = (informations = []) => {
  const items = informations ?? [];
  const names = [...new Set(items.map((item) => item.name))].slice(0, 2);
  const summary = names.join(", ");

  return items.length > 2
    ? `${summary} 외 ${items.length - names.length}건`
    : summary;
};

// ID 목록을 중복 없는 숫자 배열로 변환 (API payload용)
export const toUniqueNumberIds = (ids) => [...new Set((ids ?? []).map(Number))];

// 공개 항목 선택지 API 응답에서 모든 분류의 항목을 하나의 배열로 평탄화
export const flattenInformationItems = (response) =>
  (response?.data?.categories ?? []).flatMap(
    (category) => category.items ?? [],
  );
