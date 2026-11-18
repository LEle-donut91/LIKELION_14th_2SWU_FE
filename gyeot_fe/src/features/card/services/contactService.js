import { CONTACT_RELATIONSHIP_TYPE } from "@/features/card/constants/cardConstants";

// 비상연락망 API 응답 → 화면용 데이터 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }

// 관계 유형별로 나누고 전체 순위(priority) 순으로 정렬
const getContactsByType = (items, relationshipType) =>
  items
    .filter((item) => item.relationshipType === relationshipType)
    .sort((a, b) => a.priority - b.priority);

// 1. 비상연락망 조회 → C-03 그룹별 연락 대상 목록
// → { guardians: [...], myPeople: [...] } (각 원소는 조회 응답의 items 원소 그대로)
//   - 화면은 그룹별 목록을 따로 그려 그룹 안에서만 순서를 바꿈 (보호자는 항상 앞)
//   - 둘 다 빈 배열이면 빈 상태 화면 (에러 아님)
export const getEmergencyContactsService = (raw) => {
  const items = raw?.data?.items ?? [];

  return {
    guardians: getContactsByType(items, CONTACT_RELATIONSHIP_TYPE.GUARDIAN),
    myPeople: getContactsByType(items, CONTACT_RELATIONSHIP_TYPE.MY_PERSON),
  };
};
