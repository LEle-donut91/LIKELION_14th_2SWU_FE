import { CARD_MENU_KEY_BY_CATEGORY } from "@/features/card/constants/cardConstants";

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
