// 안심카드 항목 API 목업 데이터 (safetyInfoApi.js의 USE_MOCK에서 사용)
// - API 명세서(11/16) 'D 공통 값'과 각 API 응답 예시 기준. 서버 필드명·enum 그대로 사용
// - 화면용 형태로 바꾸는 일은 service에서 처리 (여기서는 서버 응답 형태만 유지)
// - 날짜·시간은 "YYYY-MM-DDTHH:mm:ss" (KST, 시간대 표기 없음)
// TODO: API 연동 후 safetyInfoApi.js의 USE_MOCK을 false로 바꾸면 사용하지 않음

// 분류 (메인 조회 응답 순서: BASIC → HEALTH → LIFE → ADVANCE_MESSAGE 고정)
export const SAFETY_INFO_CATEGORY_MOCK = [
  { category: "BASIC", categoryName: "기본 정보" },
  { category: "HEALTH", categoryName: "건강 정보" },
  { category: "LIFE", categoryName: "생활 정보" },
  { category: "ADVANCE_MESSAGE", categoryName: "미리 남기는 말" },
];

// 항목 유형 ('D 공통 값' 항목 유형 표 순서)
// - category: 이 유형이 속한 분류 (응답에는 내려오지 않고 목업 내부에서 분류별로 묶을 때만 사용)
// - sensitive: 민감정보 여부 / multiple: 여러 개 등록 가능 여부 / titleRequired: 이름(title) 입력 여부
export const SAFETY_INFO_TYPE_MOCK = [
  { informationType: "BIRTH_DATE", category: "BASIC", typeName: "생년월일", sensitive: false, multiple: false, titleRequired: false },
  { informationType: "BLOOD_TYPE", category: "BASIC", typeName: "혈액형", sensitive: false, multiple: false, titleRequired: false },
  { informationType: "DISEASE", category: "HEALTH", typeName: "질환", sensitive: true, multiple: true, titleRequired: true },
  { informationType: "MEDICATION", category: "HEALTH", typeName: "복용약", sensitive: true, multiple: true, titleRequired: true },
  { informationType: "ALLERGY", category: "HEALTH", typeName: "알러지", sensitive: true, multiple: true, titleRequired: true },
  { informationType: "CAUTION", category: "HEALTH", typeName: "주의사항", sensitive: false, multiple: true, titleRequired: true },
  { informationType: "ADDRESS", category: "LIFE", typeName: "주소", sensitive: true, multiple: false, titleRequired: false },
  { informationType: "ENTRY_METHOD", category: "LIFE", typeName: "출입 방법", sensitive: true, multiple: false, titleRequired: false },
  { informationType: "PET", category: "LIFE", typeName: "반려동물", sensitive: false, multiple: true, titleRequired: true },
  { informationType: "PREFERENCE_REQUEST", category: "ADVANCE_MESSAGE", typeName: "선호·부탁", sensitive: false, multiple: true, titleRequired: true },
  { informationType: "DOCUMENT_LOCATION", category: "ADVANCE_MESSAGE", typeName: "준비 문서 보관 위치", sensitive: false, multiple: true, titleRequired: true },
];

// 처음 등록되어 있는 항목 (작성순)
// - 값은 기존 화면 목업(cardMockData.js)과 명세 응답 예시를 따름
// - 메인 조회의 lastUpdatedAt이 명세 예시와 같게 나오도록 updatedAt을 맞춤
//   (BASIC 09-20 10:00 / HEALTH 10-01 09:30 / LIFE 09-25 18:00 / ADVANCE_MESSAGE 항목 없음 → null)
// - 빈 유형 확인용: ALLERGY(명세 예시처럼 빈 배열), MEDICATION(작성 예시 '혈압약'을 추가해 볼 수 있도록 비워 둠)
export const SAFETY_INFO_ITEM_MOCK = [
  { informationId: 1, informationType: "BIRTH_DATE", title: null, informationValue: "2000-12-30", updatedAt: "2026-09-20T10:00:00" },
  { informationId: 2, informationType: "BLOOD_TYPE", title: null, informationValue: "AB", updatedAt: "2026-09-20T10:00:00" },
  { informationId: 11, informationType: "DISEASE", title: "고혈압", informationValue: "2024년 진단", updatedAt: "2026-09-20T10:00:00" },
  { informationId: 13, informationType: "CAUTION", title: "어지러움", informationValue: "앉아서 휴식 필요", updatedAt: "2026-10-01T09:30:00" },
  { informationId: 21, informationType: "ADDRESS", title: null, informationValue: "서울특별시 화랑로 621 서울여자대학교 조형예술관 000호", updatedAt: "2026-09-20T10:00:00" },
  { informationId: 22, informationType: "ENTRY_METHOD", title: null, informationValue: "공동현관문 비밀번호 0000*", updatedAt: "2026-09-20T10:00:00" },
  { informationId: 23, informationType: "PET", title: "나롱이", informationValue: "하루에 3번 끼니 제공", updatedAt: "2026-09-25T18:00:00" },
];

// 메인 조회의 공유 중 건수 (공유 API는 이 목업과 연결하지 않으므로 고정값)
export const SAFETY_INFO_SHARING_COUNT_MOCK = 2;

// 성공 응답 message (명세 응답 예시 문구)
export const SAFETY_INFO_MOCK_MESSAGE = {
  CREATE: "항목을 추가했습니다.",
  UPDATE: "항목을 수정했습니다.",
  DELETE: "항목을 삭제했습니다.",
};

// 실패 응답 (명세 'D 에러 코드' 표 기준)
export const SAFETY_INFO_MOCK_ERROR = {
  INVALID_INPUT: { status: 400, code: "INVALID_INPUT", message: "입력값이 올바르지 않습니다." },
  SAFETY_INFO_NOT_FOUND: { status: 404, code: "SAFETY_INFO_NOT_FOUND", message: "존재하지 않는 안심카드 항목입니다." },
  SAFETY_INFO_ALREADY_EXISTS: { status: 409, code: "SAFETY_INFO_ALREADY_EXISTS", message: "이미 등록된 항목입니다.\n기존 항목을 수정해 주세요." },
};

// 실패 응답을 흉내 내는 URL 쿼리 키 (예: /card/basic?mockFail=true)
// - 작성: 409 SAFETY_INFO_ALREADY_EXISTS / 수정·삭제: 404 SAFETY_INFO_NOT_FOUND
export const SAFETY_INFO_MOCK_FAIL_QUERY_KEY = "mockFail";