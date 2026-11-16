// ID의 문자열/숫자 타입에 관계없이 선택한 항목을 조회한다.

// 사용자가 선택한 요청 대상
export const getSelectedUser = (users, userId) =>
  users?.find((item) => String(item.id) === String(userId));

// 사용자가 선택한 상황
export const getSelectedSituation = (situations, situationId) =>
  situations?.find((item) => String(item.id) === String(situationId));
