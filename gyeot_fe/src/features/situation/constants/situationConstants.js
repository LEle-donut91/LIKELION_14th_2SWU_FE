// 상황 화면에서 사용하는 상수 정의

// 상황 화면에서 이동하는 경로 (App.jsx 라우트 기준, 주석은 화면 코드)
export const SITUATION_NAVIGATION_PATH = {
  SITUATION_LIST: "/situation", // S-00 상황 목록
  SITUATION_CREATE: "/situation/create", // H-01 상황 만들기
  SITUATION_DETAIL: "/situation/detail", // H-03 상황 상세
  PAST_SITUATION: "/situation/past", // H-04 지난 상황
  PAST_SITUATION_DETAIL: "/situation/past/detail", // N-04 지난 상황 상세
};

// H-01 상황 종류 (종류 선택 시트)
// key: 서버 요청에 쓸 값 (API 명세 확정 후 맞춰서 수정)
export const SITUATION_TYPE_OPTIONS = [
  {
    key: "HOSPITAL",
    label: "병원 이용",
    description: "진료·검사·입원 등 병원에 갈 때",
  },
  {
    key: "RECOVERY",
    label: "회복",
    description: "수술이나 치료 뒤 회복하는 기간",
  },
  {
    key: "ABSENCE",
    label: "부재",
    description: "출장·여행 등으로 집을 비울 때",
  },
  { key: "ETC", label: "기타", description: "직접 입력" },
];

// '기타' 직접 입력 최대 글자 수
export const SITUATION_TYPE_ETC_MAX_LENGTH = 15;

// 선택 전 표시 문구
export const SITUATION_SELECT_PLACEHOLDER = "선택";
