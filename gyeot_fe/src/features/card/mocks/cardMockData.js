// 안심카드 목업 데이터 (C-03 연락 순서, C-06 공유 관리)
// - C-00·C-01·C-02·C-04·C-05(안심카드 항목)는 safetyInfoMockData.js(명세 응답 형태)를 사용

// C-03 연락 순서 목업 데이터
// TODO: API 연동 후 contactApi.js의 USE_MOCK을 false로 바꾸면 사용하지 않음
// - 비상연락망 조회 API(GET /api/emergency-contacts) 응답의 data와 같은 형태
// - name: 연락 대상이 가입 시 등록한 이름 (아바타 첫 글자에 사용)
// - personalLabel: 사용자가 지정한 표시명 / 없으면 null (카드 이름 칸에 우선 표시)
// - priority: 전체 연락 순서 / guardianPriority: 보호자끼리의 순서 (보호자가 아니면 null)

const GUARDIAN_LIST = [
  { userId: 1, name: "서연", relationshipType: "GUARDIAN", personalLabel: null, priority: 1, guardianPriority: 1 },
  { userId: 2, name: "지우", relationshipType: "GUARDIAN", personalLabel: null, priority: 2, guardianPriority: 2 },
];

const MY_PERSON_LIST = [
  { userId: 11, name: "민재", relationshipType: "MY_PERSON", personalLabel: null, guardianPriority: null },
  { userId: 12, name: "하은", relationshipType: "MY_PERSON", personalLabel: null, guardianPriority: null },
  { userId: 13, name: "하준", relationshipType: "MY_PERSON", personalLabel: "민재의 친구", guardianPriority: null },
];

// 전체 순서(priority)를 앞에서부터 다시 매김
const withPriority = (items) =>
  items.map((item, index) => ({ ...item, priority: index + 1 }));

// 테스트 시나리오를 지정하는 URL 쿼리 키 (예: /card/contact?mock=empty)
export const CONTACT_MOCK_QUERY_KEY = "mock";

// 저장 실패를 흉내 내는 URL 쿼리 키 (예: /card/contact?mockFail=true)
export const CONTACT_MOCK_FAIL_QUERY_KEY = "mockFail";

export const DEFAULT_CONTACT_MOCK_SCENARIO = "default";

// 시나리오 키 → 테스트 데이터
export const CARD_CONTACT_MOCK = {
  // 보호자 + 나의 사람 (C-03 연락 순서)
  default: { items: withPriority([...GUARDIAN_LIST, ...MY_PERSON_LIST.slice(0, 2)]) },
  // 보호자 없음 (C-03 연락 순서 - 보호자 없음)
  noGuardian: { items: withPriority(MY_PERSON_LIST) },
  // 보호자만 있음 (나의 사람 영역에 추가하기 버튼)
  guardianOnly: { items: withPriority(GUARDIAN_LIST) },
  // 아무도 없음 (C-03 연락 순서 - 빈 상태)
  empty: { items: [] },
};

// C-06 공유 관리 목업 데이터
// TODO: API 연동 후 sharingApi.js의 USE_MOCK을 false로 바꾸면 사용하지 않음
// - 공유 중 목록 조회 API(GET /api/sharings) 응답의 data와 같은 형태
// - 받는 사람·항목은 C-02~C-04 목업과 같은 값 사용 (민재·하은, 혈압약·페니실린·나롱이)
// - sharedItems: 삭제된 항목은 서버에서 제외하고 내려줌 (title이 null이면 원래 이름이 없는 유형)

const SHARING_ITEM_LIST = [
  // 공유 중 (시안 첫 번째 카드)
  {
    assignmentId: 40,
    requestId: 31,
    receiver: { userId: 11, name: "민재" },
    helpType: "HOSPITAL",
    startsAt: "2026-10-02T14:00:00",
    accessUntil: "2026-10-02T18:00:00",
    status: "SHARING",
    canReallow: false,
    sharedItems: [
      { informationType: "MEDICATION", typeName: "복용약", title: "혈압약" },
      { informationType: "ALLERGY", typeName: "알레르기", title: "페니실린" },
    ],
  },
  // 공유 중 (같은 유형 항목 2개 → 태그는 한 번만 표시되는지 확인용)
  {
    assignmentId: 41,
    requestId: 32,
    receiver: { userId: 12, name: "하은" },
    helpType: "MEAL",
    startsAt: "2026-10-03T12:00:00",
    accessUntil: "2026-10-03T14:00:00",
    status: "SHARING",
    canReallow: false,
    sharedItems: [
      { informationType: "DISEASE", typeName: "질환", title: "고혈압" },
      { informationType: "MEDICATION", typeName: "복용약", title: "혈압약" },
      { informationType: "MEDICATION", typeName: "복용약", title: "소화제" },
      { informationType: "ADDRESS", typeName: "주소", title: null },
    ],
  },
  // 철회됨 + 다시 허용 가능 (시안 세 번째 카드)
  {
    assignmentId: 52,
    requestId: 38,
    receiver: { userId: 11, name: "민재" },
    helpType: "PET_CARE",
    startsAt: "2026-10-02T14:00:00",
    accessUntil: "2026-10-02T20:00:00",
    status: "REVOKED",
    canReallow: true,
    sharedItems: [
      { informationType: "ADDRESS", typeName: "주소", title: null },
      { informationType: "ENTRY_METHOD", typeName: "출입 방법", title: null },
      { informationType: "PET", typeName: "반려동물", title: "나롱이" },
    ],
  },
  // 철회됨 + 다시 허용 불가 (담당자가 바뀌는 등 canReallow = false)
  {
    assignmentId: 53,
    requestId: 39,
    receiver: { userId: 12, name: "하은" },
    helpType: "CHECK_IN",
    startsAt: "2026-10-04T10:00:00",
    accessUntil: "2026-10-04T11:00:00",
    status: "REVOKED",
    canReallow: false,
    sharedItems: [
      { informationType: "BIRTH_DATE", typeName: "생년월일", title: null },
      { informationType: "BLOOD_TYPE", typeName: "혈액형", title: null },
    ],
  },
];

// 테스트 시나리오를 지정하는 URL 쿼리 키 (예: /card/share?mock=empty)
export const SHARING_MOCK_QUERY_KEY = "mock";

// 철회 / 다시 허용 실패를 흉내 내는 URL 쿼리 키 (예: /card/share?mockFail=true)
export const SHARING_MOCK_FAIL_QUERY_KEY = "mockFail";

export const DEFAULT_SHARING_MOCK_SCENARIO = "default";

// 시나리오 키 → 테스트 데이터
export const CARD_SHARING_MOCK = {
  // 공유 중 2건 + 철회됨(다시 허용 가능) 1건 (C-06 공유 관리)
  default: { items: SHARING_ITEM_LIST.slice(0, 3) },
  // 철회됨만 (다시 허용 가능 / 불가)
  revokedOnly: { items: SHARING_ITEM_LIST.slice(2) },
  // 공유 중인 카드 없음 (C-06 공유 관리 - 공유 중인 정보 없음)
  empty: { items: [] },
};

// 다시 허용 목업 응답에 쓸 공유 항목 찾기 (assignmentId 기준)
export const findSharingMockItem = (assignmentId) =>
  SHARING_ITEM_LIST.find((item) => item.assignmentId === assignmentId);