// 활성 관계 응답 → 화면에서 쓰기 좋은 모양으로 변환 (useRelationshipsQuery의 select에서 사용)

const RELATIONSHIP_TYPE = {
  GUARDIAN: "GUARDIAN", // 서로의 보호자
  MY_PERSON: "MY_PERSON", // 내가 등록한 나의 사람
};

// 관계 한 건 → 화면용 사람 정보
const toPerson = (item) => ({
  id: item.relationshipId, // 관계 ID (상세 이동·해제에 사용)
  userId: item.userId,
  name: item.name,
  type: item.relationshipType,
  label: item.personalLabel ?? "", // 나만 보는 관계 형태 (없으면 빈 문자열)
  priority: item.guardianPriority, // 보호자 연락 순서 (나의 사람이면 null)
});

/**
 * 활성 관계 목록을 보호자 / 나의 사람으로 나눔
 * → { guardians: 연락 순서대로 정렬, myPeople }
 */
export const getRelationshipsService = (response) => {
  const items = response.data?.items ?? [];

  const guardians = items
    .filter((item) => item.relationshipType === RELATIONSHIP_TYPE.GUARDIAN)
    .sort((a, b) => a.guardianPriority - b.guardianPriority) // 1순위부터
    .map(toPerson);

  const myPeople = items
    .filter((item) => item.relationshipType === RELATIONSHIP_TYPE.MY_PERSON)
    .map(toPerson);

  return { guardians, myPeople };
};