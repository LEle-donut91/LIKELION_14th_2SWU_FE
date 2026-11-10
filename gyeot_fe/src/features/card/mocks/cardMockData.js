// C-00 안심카드 목업 데이터 (API 스펙 확정 전 화면 확인용)
// TODO: API 스펙 확정 후 응답 형태에 맞춰 교체
// - updatedDate: 항목별 마지막 갱신일 (CARD_MENU_SECTION_LIST의 item.key 기준)
// - sharingCount: 지금 공유 중인 건수

export const CARD_SUMMARY_MOCK = {
  updatedDate: {
    basic: "2026-09-20",
    health: "2026-09-20",
    life: "2026-09-20",
    message: "2026-09-20",
  },
  sharingCount: 2,
};

// C-01 기본 정보 목업 데이터
// TODO: API 스펙 확정 후 응답 형태에 맞춰 교체
// - 키: BASIC_INFO_KEY 값과 동일
// - value: 저장값 (생년월일 "YYYY-MM-DD", 혈액형 BLOOD_TYPE_LABELS의 key) / 값이 없으면 null
// - updatedDate: 항목별 마지막 갱신일 ("YYYY-MM-DD") / 없으면 null
export const CARD_BASIC_MOCK = {
  birthDate: {
    value: "2000-12-30",
    updatedDate: "2026-09-20",
  },
  bloodType: {
    value: "AB",
    updatedDate: "2026-09-20",
  },
};
