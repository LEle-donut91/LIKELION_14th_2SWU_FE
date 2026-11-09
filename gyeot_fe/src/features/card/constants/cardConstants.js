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
