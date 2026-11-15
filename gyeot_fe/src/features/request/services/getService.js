// 대상 후보 조회 API 관련
export const getRequestTargetsService = (raw) =>
  (raw?.data?.items ?? []).map((item) => ({
    id: String(item.userId), // id는 폼의 userId와 === 비교하므로 문자열로 통일
    userName: item.name,
    isGuardian: Boolean(item.isGuardian),
  }));
