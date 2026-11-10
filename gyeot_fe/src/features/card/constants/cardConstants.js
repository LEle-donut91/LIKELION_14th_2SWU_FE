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
export const BASIC_INFO_FOOTER_TEXT = {
  DELETE: "삭제",
  UPDATE: "수정",
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