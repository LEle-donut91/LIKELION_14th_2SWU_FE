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

// C-02 건강 정보 목업 데이터
// ※ request/mock/InfoPreview/getInfoPreviewMock.json의 healthInfo를 복사해 C-02 화면 형태로 변경
//   - 카테고리 키, 필드명, 값은 원본과 동일
//     (disease.name / diagnosedYear, medicine.name / dosage, allergy.name / reaction, caution.name / instruction)
//   - 카테고리마다 항목을 여러 개 등록할 수 있어 객체 → 배열로 변경하고, 항목 구분용 id 추가
//   - updatedAt("9/20") → updatedDate("2026-09-20"): C-01과 같은 "YYYY-MM-DD" 형식으로 변경 (원본이 null이면 null 유지)
//   - isSensitive: 카테고리 단위로 고정(HEALTH_CATEGORY_LIST)되어 있어 제외
//   - isDefault: 공개 정보 미리보기(H-03-02-01)에서 쓰는 값이라 제외
// TODO: API 스펙 확정 후 응답 형태에 맞춰 교체
export const CARD_HEALTH_MOCK = {
  disease: [
    {
      id: "disease-1",
      name: "고혈압",
      diagnosedYear: "2024년",
      updatedDate: "2026-09-20",
    },
  ],
  medicine: [
    {
      id: "medicine-1",
      name: "혈압약",
      dosage: "매일 1정",
      updatedDate: "2026-09-20",
    },
  ],
  allergy: [
    {
      id: "allergy-1",
      name: "페니실린",
      reaction: "두드러기 반응",
      updatedDate: null,
    },
  ],
  caution: [
    {
      id: "caution-1",
      name: "어지러움",
      instruction: "앉아서 휴식 필요",
      updatedDate: null,
    },
  ],
};
