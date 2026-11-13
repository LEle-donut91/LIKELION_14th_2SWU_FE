// 안심카드 화면에서 사용하는 상수 정의

// 안심카드에서 이동하는 화면 경로 (App.jsx 라우트 기준, 주석은 화면 코드)
export const CARD_NAVIGATION_PATH = {
  BASIC: "/card/basic", // C-01 기본 정보
  HEALTH: "/card/health", // C-02 건강 정보
  CONTACT: "/card/contact", // C-03 연락 선호
  LIFE: "/card/life", // C-04 생활 정보
  MESSAGE: "/card/message", // C-05 미리 남기는 말
  SHARE: "/card/share", // C-06 공유 관리
};

// 카드 공통
// '추가하기' 텍스트 버튼 문구 (CardAddButton 기본값)
export const CARD_ADD_BTN_TEXT = "추가하기";

// C-00 메뉴 구성 (고정 텍스트)
// - key: mock/API 데이터에서 해당 항목 값을 찾는 키
// - description: 카드 설명 (공유 관리는 공유 건수로 동적 생성하므로 없음)
// - hasUpdatedDate: 설명 뒤에 '갱신 M/D' 노출 여부
export const CARD_MENU_SECTION_LIST = [
  {
    key: "info",
    title: "정보 관리",
    items: [
      {
        key: "basic",
        title: "기본 정보",
        description: "생년월일 / 혈액형",
        path: CARD_NAVIGATION_PATH.BASIC,
        hasUpdatedDate: true,
      },
      {
        key: "health",
        title: "건강 정보",
        description: "질환 / 복용약 / 알러지 / 주의사항",
        path: CARD_NAVIGATION_PATH.HEALTH,
        hasUpdatedDate: true,
      },
      {
        key: "life",
        title: "생활 정보",
        description: "주소 / 출입 방법 / 반려동물",
        path: CARD_NAVIGATION_PATH.LIFE,
        hasUpdatedDate: true,
      },
      {
        key: "message",
        title: "미리 남기는 말",
        description: "선호 / 문서",
        path: CARD_NAVIGATION_PATH.MESSAGE,
        hasUpdatedDate: true,
      },
    ],
  },
  {
    key: "etc",
    title: "기타 정보 관리",
    items: [
      {
        key: "contact",
        title: "연락 선호",
        description: "비상연락망 / 연락 순서",
        path: CARD_NAVIGATION_PATH.CONTACT,
        hasUpdatedDate: false,
      },
      {
        key: "share",
        title: "공유 관리",
        path: CARD_NAVIGATION_PATH.SHARE,
        hasUpdatedDate: false,
      },
    ],
  },
];

/**
 * =====================================================================
 * [C-01] 기본 정보
 * =====================================================================
 */

// 기본 정보 항목 키 (mock/API 데이터의 항목 키와 동일)
export const BASIC_INFO_KEY = {
  BIRTH_DATE: "birthDate",
  BLOOD_TYPE: "bloodType",
};

// 기본 정보 목록 구성 (화면에 그릴 순서대로)
// - title: 목록 카드 제목 / 편집 화면 헤더 제목 / 입력 영역 라벨에 공용 사용
export const BASIC_INFO_ITEM_LIST = [
  { key: BASIC_INFO_KEY.BIRTH_DATE, title: "생년월일" },
  { key: BASIC_INFO_KEY.BLOOD_TYPE, title: "혈액형" },
];

// 값이 없을 때 목록 카드 설명 칸에 보여줄 문구
export const BASIC_INFO_EMPTY_TEXT = "등록된 정보가 없어요";

// 목록 카드의 수정 버튼 문구
export const BASIC_INFO_EDIT_BTN_TEXT = "수정하기";

// 편집 화면 하단 버튼 문구
// - ADD: C-02에서 '추가하기'로 들어온 상태일 때 오른쪽 버튼 문구
export const BASIC_INFO_FOOTER_TEXT = {
  DELETE: "삭제",
  UPDATE: "수정",
  ADD: "추가",
};

// 생년월일 입력 설정 (YYYYMMDD 8자리)
export const BIRTH_DATE_INPUT_LENGTH = 8;
export const BIRTH_DATE_PLACEHOLDER = "예: 20001230";

// 혈액형: 서버 응답/요청에 쓰는 값(key), 한글 매핑(value)
export const BLOOD_TYPE_LABELS = {
  A: "A형",
  AB: "AB형",
  B: "B형",
  O: "O형",
};

// 라디오 버튼으로 그릴 혈액형 값 목록 (BLOOD_TYPE_LABELS 선언 순서대로)
// -> ["A", "AB", "B", "O"]
export const BLOOD_TYPE_OPTIONS = Object.keys(BLOOD_TYPE_LABELS);

// 입력 검증 실패 시 토스트 문구
export const BASIC_INFO_TOAST_MESSAGE = {
  BIRTH_DATE_LENGTH: "생년월일 8자리를 입력해 주세요.",
  BIRTH_DATE_INVALID: "존재하지 않는 날짜예요. 다시 확인해 주세요.",
  BIRTH_DATE_FUTURE: "오늘 이후 날짜는 입력할 수 없어요.",
  BLOOD_TYPE_REQUIRED: "혈액형을 선택해 주세요.",
};

// 삭제 확인 모달 문구 (descriptionLines: 배열의 각 원소 = 한 줄)
export const BASIC_INFO_DELETE_MODAL = {
  title: "삭제 요청",
  descriptionLines: [
    "요청사항에서 공유 중인 경우,",
    "상대방의 접근 권한이 모두 회수됩니다.",
    "또한, 삭제 이전 상태로 돌아올 수 없습니다.",
  ],
  cancelText: "취소",
  confirmText: "삭제",
};

/**
 * =====================================================================
 * [C-02] 건강 정보
 * - 목록 카드 '수정하기', 하단 [삭제][수정] 버튼, 삭제 확인 모달 문구는
 *   C-01 상수를 함께 사용 (BASIC_INFO_EDIT_BTN_TEXT / BASIC_INFO_FOOTER_TEXT / BASIC_INFO_DELETE_MODAL)
 * =====================================================================
 */

// 페이지(목록 화면) 헤더 제목
export const HEALTH_INFO_PAGE_TITLE = "건강 정보";

// 민감 항목 태그 문구 (BasicInfoItem에서 isSensitive가 true일 때 표시)
export const SENSITIVE_TAG_TEXT = "민감";

// 건강 정보 카테고리 키 (mock/API 데이터의 카테고리 키와 동일)
export const HEALTH_CATEGORY_KEY = {
  DISEASE: "disease",
  MEDICINE: "medicine",
  ALLERGY: "allergy",
  CAUTION: "caution",
};

// 건강 정보 카테고리 구성 (화면에 그릴 순서대로)
// - title: 섹션 제목 / 편집 화면 헤더 제목
// - isSensitive: 서비스에서 민감 항목으로 지정된 카테고리인지 (목록 카드에 '민감' 표시)
// - titleKey: 목록 카드 제목으로 쓸 필드 키
// - descriptionKey: 목록 카드 설명으로 쓸 필드 키
// - descriptionSuffix: 설명 값 뒤에 붙일 문구 (예: "2024년" → "2024년 진단")
// - fields: 편집 화면 입력 필드 (위에서부터 그리는 순서)
//   - isRequired: true면 비어 있을 때 [수정] 클릭 시 requiredMessage 토스트
export const HEALTH_CATEGORY_LIST = [
  {
    key: HEALTH_CATEGORY_KEY.DISEASE,
    title: "질환",
    isSensitive: true,
    titleKey: "name",
    descriptionKey: "diagnosedYear",
    descriptionSuffix: " 진단",
    fields: [
      {
        key: "name",
        label: "질환",
        placeholder: "질환명",
        isRequired: true,
        requiredMessage: "질환명을 입력해 주세요.",
      },
      {
        key: "diagnosedYear",
        label: "진단일",
        placeholder: "예: 2025년",
        isRequired: false,
      },
    ],
  },
  {
    key: HEALTH_CATEGORY_KEY.MEDICINE,
    title: "복용약",
    isSensitive: true,
    titleKey: "name",
    descriptionKey: "dosage",
    descriptionSuffix: "",
    fields: [
      {
        key: "name",
        label: "복용약",
        placeholder: "약 이름",
        isRequired: true,
        requiredMessage: "약 이름을 입력해 주세요.",
      },
      {
        key: "dosage",
        label: "복용법",
        placeholder: "예: 아침 1정",
        isRequired: false,
      },
    ],
  },
  {
    key: HEALTH_CATEGORY_KEY.ALLERGY,
    title: "알러지",
    isSensitive: true,
    titleKey: "name",
    descriptionKey: "reaction",
    descriptionSuffix: "",
    fields: [
      {
        key: "name",
        label: "알러지",
        placeholder: "알러지명",
        isRequired: true,
        requiredMessage: "알러지명을 입력해 주세요.",
      },
      {
        key: "reaction",
        label: "반응",
        placeholder: "예: 두드러기",
        isRequired: false,
      },
    ],
  },
  {
    key: HEALTH_CATEGORY_KEY.CAUTION,
    title: "주의사항",
    isSensitive: false,
    titleKey: "name",
    descriptionKey: "instruction",
    descriptionSuffix: "",
    fields: [
      {
        key: "name",
        label: "주의사항",
        placeholder: "증상",
        isRequired: true,
        requiredMessage: "증상을 입력해 주세요.",
      },
      {
        key: "instruction",
        label: "대처법",
        placeholder: "예: 앉아서 휴식 필요",
        isRequired: false,
      },
    ],
  },
];

/**
 * =====================================================================
 * [C-03] 연락 순서
 * =====================================================================
 */

// 연락 대상 관계 유형 (비상연락망 조회 API의 relationshipType 값과 동일)
export const CONTACT_RELATIONSHIP_TYPE = {
  GUARDIAN: "GUARDIAN",
  MY_PERSON: "MY_PERSON",
};

// 관계 유형별 표시 문구 (섹션 제목 / 카드 보조 텍스트에 공용 사용)
export const CONTACT_RELATIONSHIP_LABELS = {
  GUARDIAN: "서로의 보호자",
  MY_PERSON: "나의 사람",
};

// 헤더 제목
export const CONTACT_ORDER_TITLE = "연락 순서";

// 순위 뱃지 뒤에 붙는 문구: 1 → "1순위"
export const CONTACT_ORDER_RANK_SUFFIX = "순위";

// C-03에서 이동하는 화면 경로 (App.jsx 라우트 기준, 주석은 화면 코드 / 기능 번호)
export const CONTACT_ORDER_NAVIGATION_PATH = {
  MY_PERSON_INVITE: "/relation/acquaintance-invite", // R-01 나의 사람 초대 (F-01)
  GUARDIAN_REQUEST: "/relation/guardian-request", // N-02 보호자 요청 (F-26)
};

// 하단 안내 문구
// - WITH_GUARDIAN: 줄 단위 배열, 한 줄 안의 항목은 점으로 구분해 표시
// - WITHOUT_GUARDIAN: 문단 단위 배열, 문단 안의 항목은 줄바꿈으로 표시
export const CONTACT_ORDER_NOTICE = {
  WITH_GUARDIAN: [
    ["보호자는 항상 맨 앞에 와요"], ["길게 눌러 끌면 순서를 바꿀 수 있어요."]
  ],
  WITHOUT_GUARDIAN: [
    ["보호자를 등록하면 항상 맨 앞에 와요."],
    ["다음 순서로 자동으로 넘어가지 않아요.", "요청자가 직접 정해요."],
  ],
};

// 연락할 사람이 아무도 없을 때 빈 상태 화면 문구 (descriptionLines: 배열의 각 원소 = 한 줄)
export const CONTACT_ORDER_EMPTY = {
  title: "아직 연락할 사람이 없어요",
  descriptionLines: [
    "나의 사람이나 서로의 보호자를 맺으면",
    "여기서 연락 순서를 정할 수 있어요",
  ],
  inviteBtnText: "나의 사람 초대하기",
  guardianRequestBtnText: "보호자 요청하기",
};

// 토스트 문구
export const CONTACT_ORDER_TOAST_MESSAGE = {
  SAVE_SUCCESS: "순서를 바꿨어요",
};
