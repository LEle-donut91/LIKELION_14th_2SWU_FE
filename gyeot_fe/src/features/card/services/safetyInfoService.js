import {
  BASIC_INFO_ITEM_LIST,
  CARD_MENU_KEY_BY_CATEGORY,
} from "@/features/card/constants/cardConstants";

// 안심카드 항목 API 응답 → 화면용 데이터 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }

// 1. 안심카드 메인 조회 → C-00 메뉴 카드용 데이터
// → { lastUpdatedAt: { basic, health, life, message }, sharingCount }
//   - lastUpdatedAt의 key: CARD_MENU_SECTION_LIST의 item.key
//   - 값: "YYYY-MM-DDTHH:mm:ss" / 분류에 항목이 없으면 null (갱신일 숨김)
export const getSafetyInfoSummaryService = (raw) => {
  const categories = raw?.data?.categories ?? [];

  const lastUpdatedAt = Object.fromEntries(
    categories
      .filter(({ category }) => CARD_MENU_KEY_BY_CATEGORY[category])
      .map(({ category, lastUpdatedAt: value }) => [
        CARD_MENU_KEY_BY_CATEGORY[category],
        value ?? null,
      ]),
  );

  return {
    lastUpdatedAt,
    sharingCount: raw?.data?.sharingCount ?? 0,
  };
};

// 2. 분류별 항목 조회 → 항목 유형(informationType)별로 찾기 쉬운 형태 (C-01·02·04·05 공용)
// → { [informationType]: { informationType, typeName, sensitive, multiple, titleRequired, items } }
//   - items: [{ informationId, title, informationValue, updatedAt }] / 없으면 빈 배열
export const getSafetyInfoItemsService = (raw) => {
  const types = raw?.data?.types ?? [];

  return Object.fromEntries(
    types.map((type) => [type.informationType, { ...type, items: type.items ?? [] }]),
  );
};

// 2-1. 분류별 항목 조회(BASIC) → C-01 기본 정보 화면용 데이터
// → { birthDate: { informationId, value, updatedAt } | null, bloodType: ... | null }
//   - key: BASIC_INFO_KEY 값 / 등록한 항목이 없으면 null
//   - 생년월일·혈액형은 1개만 등록하는 유형이라 첫 번째 항목만 사용
export const getBasicInfoService = (raw) => {
  const typesByInformationType = getSafetyInfoItemsService(raw);

  return Object.fromEntries(
    BASIC_INFO_ITEM_LIST.map(({ key, informationType }) => {
      const item = typesByInformationType[informationType]?.items[0];
      return [
        key,
        item
          ? {
              informationId: item.informationId,
              value: item.informationValue,
              updatedAt: item.updatedAt,
            }
          : null,
      ];
    }),
  );
};