// 날짜/시간 입력(DateTimeOption) 공통 설정
// features/request/constants/requestConstants.js의 날짜·시간 설정을 shared용으로 복사 (요청 쪽 원본은 그대로 유지)

// 날짜 입력칸 설정
const DATE_CONFIGS = [
  {
    key: "year",
    placeholder: "2026",
    maxLength: 4,
    label: "년",
    className: "yearInput",
    min: 1,
  },
  {
    key: "month",
    placeholder: "00",
    maxLength: 2,
    label: "월",
    className: "dateTimeInput",
    min: 1,
    max: 12,
  },
  {
    key: "day",
    placeholder: "00",
    maxLength: 2,
    label: "일",
    className: "dateTimeInput",
    min: 1,
    max: 31,
  },
];

// 시간 입력칸 설정
const TIME_CONFIGS = [
  {
    key: "hour",
    placeholder: "00",
    maxLength: 2,
    label: "시",
    className: "dateTimeInput",
    min: 0,
    max: 23,
  },
  {
    key: "minute",
    placeholder: "00",
    maxLength: 2,
    label: "분",
    className: "dateTimeInput",
    min: 0,
    max: 59,
  },
];

export const DATE_TIME_OPTION_CONFIGS = {
  date: DATE_CONFIGS,
  time: TIME_CONFIGS,
};

// 날짜/시간 입력 필드 최소값 목록
export const DATE_TIME_MIN_LIMITS = [...DATE_CONFIGS, ...TIME_CONFIGS].reduce(
  (acc, item) => ({ ...acc, [item.key]: item.min }),
  {},
);

// 날짜/시간 입력 필드 최대값 목록
export const DATE_TIME_MAX_LIMITS = [...DATE_CONFIGS, ...TIME_CONFIGS].reduce(
  (acc, item) => ({ ...acc, [item.key]: item.max }),
  {},
);
