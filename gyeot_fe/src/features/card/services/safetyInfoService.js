import {
  BASIC_INFO_ITEM_LIST,
  CARD_MENU_KEY_BY_CATEGORY,
} from "@/features/card/constants/cardConstants";

// 안심카드 항목 API 응답 ↔ 화면용 데이터 변환 (부수효과 없는 순수 함수)
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

// 값 끝의 접미어 떼기: ("2024년 진단", " 진단") → "2024년" / 접미어로 끝나지 않으면 그대로
const removeSuffix = (value, suffix) =>
  suffix && value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;

// 값 끝에 접미어 붙이기: ("2024년", " 진단") → "2024년 진단" / 이미 붙어 있으면 그대로
const addSuffix = (value, suffix) =>
  suffix && !value.endsWith(suffix) ? `${value}${suffix}` : value;

// 2-2. 분류별 항목 조회 → C-02·04·05 화면용 데이터 (페이지 설정 key별 항목 목록)
// - typeConfigList: 페이지 설정 목록 (HEALTH_CATEGORY_LIST / LIFE 유형 목록 / MESSAGE_CATEGORY_LIST)
//   각 설정의 informationType, titleKey, descriptionKey, descriptionSuffix를 사용
// → { [설정 key]: [{ id, [titleKey]: title, [descriptionKey]: informationValue, updatedAt }] }
//   예: { disease: [{ id: 11, name: "고혈압", diagnosedYear: "2024년", updatedAt: "2026-09-20T10:00:00" }] }
//   - descriptionSuffix가 있으면 값 끝의 접미어를 떼어 입력칸 값으로 사용 (목록 표시 때 다시 붙임)
export const getSafetyInfoItemsByKeyService = (raw, typeConfigList) => {
  const typesByInformationType = getSafetyInfoItemsService(raw);

  return Object.fromEntries(
    typeConfigList.map((config) => {
      const items = typesByInformationType[config.informationType]?.items ?? [];
      return [
        config.key,
        items.map((item) => ({
          id: item.informationId,
          ...(config.titleKey && { [config.titleKey]: item.title ?? "" }),
          [config.descriptionKey]: removeSuffix(
            item.informationValue ?? "",
            config.descriptionSuffix,
          ),
          updatedAt: item.updatedAt,
        })),
      ];
    }),
  );
};

// 3. 편집 화면 입력값 → 작성·수정 요청 값 (C-02·04·05 공용)
// - config: 편집 중인 페이지 설정 / draft: 필드 키별 입력값 (앞뒤 공백 제거 후)
// → { title, informationValue }
//   - titleKey가 없는 유형(주소·출입 방법)은 title null
//   - descriptionSuffix가 있으면 값 끝에 붙여 보냄 (예: "2025년" → "2025년 진단")
export const toSafetyInfoRequest = (config, draft) => ({
  title: config.titleKey ? draft[config.titleKey] : null,
  informationValue: addSuffix(draft[config.descriptionKey], config.descriptionSuffix),
});