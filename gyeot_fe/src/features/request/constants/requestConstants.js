// 시트에 주입할 DateTimeOption 입력 그룹 설정
export const DATE_TIME_SECTIONS = [
  { type: "date", title: "날짜" },
  { type: "time", title: "시간" },
];
export const DUE_DATE_SECTIONS = [{ type: "dueDate", title: "응답기한" }];

// 도움 종류 option 배열
export const OPTIONS = [
  "병원 동행",
  "식사",
  "장보기",
  "반려동물",
  "연락/안부",
  "기타",
];

// DateTimeOption 컴포넌트의 type별 입력 필드 설정 데이터
export const OPTION_CONFIGS = {
  date: [
    {
      placeholder: "0000",
      maxLength: 4,
      label: "년",
      className: "yearInput",
      key: "year",
    },
    {
      placeholder: "00",
      maxLength: 2,
      label: "월",
      className: "dateTimeInput",
      key: "month",
    },
    {
      placeholder: "00",
      maxLength: 2,
      label: "일",
      className: "dateTimeInput",
      key: "day",
    },
  ],
  time: [
    {
      placeholder: "00",
      maxLength: 2,
      label: "시",
      className: "dateTimeInput",
      key: "hour",
    },
    {
      placeholder: "00",
      maxLength: 2,
      label: "분",
      className: "dateTimeInput",
      key: "minute",
    },
  ],
  dueDate: [
    {
      placeholder: "00",
      maxLength: 2,
      label: "일",
      className: "dateTimeInput",
      key: "days",
    },
    {
      placeholder: "00",
      maxLength: 2,
      label: "시간",
      className: "dateTimeInput",
      key: "hours",
    },
    {
      placeholder: "00",
      maxLength: 2,
      label: "분",
      className: "dateTimeInput",
      key: "minutes",
    },
  ],
};

// 민감정보 항목의 ID 목록 정의
export const SENSITIVE_KEYS = [
  "disease",
  "medicine",
  "allergy",
  "address",
  "entranceMethod",
];


// [H-03-01-B] 요청 상태에 따른 RequestState 컴포넌트 설정 데이터 매핑
export const REQUEST_STATE_CONFIG = {
  cancel: { title: "요청 취소", information: "요청자가 취소했어요." },
  expired: { title: "요청 만료", information: "요청이 만료됐어요." },
  pass: { title: "요청 취소", information: "다른 사용자에게 요청이 넘어갔어요." },
};
