// 안심카드 화면 표시용 유틸리티

// 갱신일 표시: "2026-09-20" → "갱신 9/20"
export const formatUpdatedDate = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return `갱신 ${date.getMonth() + 1}/${date.getDate()}`;
};

// 공유 건수 표시: 2 → "지금 공유 중 2건"
export const formatSharingCount = (count = 0) => `지금 공유 중 ${count}건`;
