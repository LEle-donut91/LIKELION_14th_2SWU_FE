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

// C-04 생활 정보 목업 데이터
// ※ request/mock/InfoPreview/getInfoPreviewMock.json의 lifeInfo를 복사해 C-04 화면 형태로 변경
//   - 유형 키, 필드명, 값은 원본과 동일
//     (address.value, entranceMethod.value, pet.name / care)
//   - API(분류별 항목 조회)가 유형마다 items 배열로 내려주므로 모든 유형을 배열로 변경하고, 항목 구분용 id 추가
//     (집 주소·출입 방법은 1개만 등록 가능 → 배열이 비어 있으면 '등록된 정보가 없어요' 카드 표시)
//   - updatedAt("9/20") → updatedDate("2026-09-20"): C-01·C-02와 같은 "YYYY-MM-DD" 형식으로 변경
//   - isSensitive: 유형 단위로 고정(LIFE_SECTION_LIST)되어 있어 제외
//   - isDefault: 공개 정보 미리보기(H-03-02-01)에서 쓰는 값이라 제외
// TODO: API 스펙 확정 후 응답 형태에 맞춰 교체
export const CARD_LIFE_MOCK = {
  address: [
    {
      id: "address-1",
      value: "서울특별시 화랑로 621 서울여자대학교 조형예술관 000호",
      updatedDate: "2026-09-20",
    },
  ],
  entranceMethod: [
    {
      id: "entranceMethod-1",
      value: "공동현관문 비밀번호 0000*",
      updatedDate: "2026-09-20",
    },
  ],
  pet: [
    {
      id: "pet-1",
      name: "나롱이",
      care: "하루에 3번 끼니 제공",
      updatedDate: "2026-09-20",
    },
  ],
};

// C-05 미리 남기는 말 목업 데이터
// ※ request/mock/InfoPreview/getInfoPreviewMock.json의 messageInfo를 복사해 C-05 화면 형태로 변경
//   - 카테고리 키, 필드명은 원본과 동일 (preference.value, document.value)
//   - 원본에 없는 title(항목 이름, API 필수값) 추가
//   - 원본 값("내용 값")은 자리표시라 시안 값으로 교체
//     (선호·부탁은 시안도 "항목 / 값(사용자 입력)" 자리표시라 같은 문구 사용)
//   - 카테고리마다 항목을 여러 개 등록할 수 있어 객체 → 배열로 변경하고, 항목 구분용 id 추가
//   - updatedAt("9/20") → updatedDate("2026-09-20"): C-01·C-02·C-04와 같은 "YYYY-MM-DD" 형식으로 변경
//   - isSensitive: 카테고리 단위로 고정(MESSAGE_CATEGORY_LIST)되어 있어 제외
//   - isDefault: 공개 정보 미리보기(H-03-02-01)에서 쓰는 값이라 제외
// TODO: API 스펙 확정 후 응답 형태에 맞춰 교체
export const CARD_MESSAGE_MOCK = {
  preference: [
    {
      id: "preference-1",
      title: "항목",
      value: "값(사용자 입력)",
      updatedDate: "2026-09-20",
    },
  ],
  document: [
    {
      id: "document-1",
      title: "보험 증빙 서류",
      value: "장롱 3번째 서랍 안",
      updatedDate: "2026-09-20",
    },
  ],
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
