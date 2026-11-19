// 관계 API 목업 데이터 (relationshipApi.js의 USE_MOCK = true일 때만 사용)
// - 응답 형태는 API 명세서 F-28 '활성 관계 조회' 예시와 동일

export const MOCK_RELATIONSHIPS = {
  items: [
    { relationshipId: 10, userId: 2, name: "서연", relationshipType: "GUARDIAN", personalLabel: "언니", guardianPriority: 1 },
    { relationshipId: 12, userId: 4, name: "지우", relationshipType: "GUARDIAN", personalLabel: null, guardianPriority: 2 },
    { relationshipId: 13, userId: 5, name: "영철", relationshipType: "GUARDIAN", personalLabel: null, guardianPriority: 3 },
    { relationshipId: 11, userId: 3, name: "민재", relationshipType: "MY_PERSON", personalLabel: "친구", guardianPriority: null },
    { relationshipId: 14, userId: 6, name: "하은", relationshipType: "MY_PERSON", personalLabel: "이웃", guardianPriority: null },
  ],
};