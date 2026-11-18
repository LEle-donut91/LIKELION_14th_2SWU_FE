/**
 * [DateTimeOption] 날짜/시간/응답 기한 입력 설정
 * 입력칸 설정, 필드 key 목록, 최소/최대값 제한
 */

// 시트에 주입할 DateTimeOption 입력 그룹 설정 (날짜/시간)
export const DATE_TIME_SECTIONS = [
  { type: "date", title: "날짜" },
  { type: "time", title: "시간" },
];

// 시트에 주입할 DateTimeOption 입력 그룹 설정 (응답기한)
export const DUE_DATE_SECTIONS = [{ type: "dueDate", title: "응답기한" }];

// DateTimeOption 컴포넌트 - 날짜 입력칸 설정
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

// DateTimeOption 컴포넌트 - 시간 입력칸 설정
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

// DateTimeOption 컴포넌트 - 응답 기한 입력칸 설정
const DUE_DATE_CONFIGS = [
  {
    key: "days",
    placeholder: "00",
    maxLength: 2,
    label: "일",
    className: "dateTimeInput",
    min: 0,
  },
  {
    key: "hours",
    placeholder: "00",
    maxLength: 2,
    label: "시간",
    className: "dateTimeInput",
    min: 0,
    max: 23,
  },
  {
    key: "minutes",
    placeholder: "00",
    maxLength: 2,
    label: "분",
    className: "dateTimeInput",
    min: 0,
    max: 59,
  },
];

// DateTimeOption 컴포넌트의 종류별(날짜/시간/응답기한) 입력 필드 설정 (최종 설정 객체)
export const DATE_TIME_OPTION_CONFIGS = {
  date: DATE_CONFIGS,
  time: TIME_CONFIGS,
  dueDate: DUE_DATE_CONFIGS,
};

// 날짜/시간 입력 필드의 key 목록 (["year", "month", "day", "hour", "minute"])
export const DATE_TIME_KEYS = [...DATE_CONFIGS, ...TIME_CONFIGS].map(
  (item) => item.key,
);

// 응답 기한 입력 필드의 key 목록 (["days", "hours", "minutes"])
export const DUE_DATE_KEYS = DUE_DATE_CONFIGS.map((item) => item.key);

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

// 응답 기한 입력 필드 최소값 목록
export const DUE_DATE_MIN_LIMITS = DUE_DATE_CONFIGS.reduce(
  (acc, item) => ({ ...acc, [item.key]: item.min }),
  {},
);

// 응답 기한 입력 필드 최대값 목록
export const DUE_DATE_MAX_LIMITS = DUE_DATE_CONFIGS.reduce(
  (acc, item) => ({ ...acc, [item.key]: item.max }),
  {},
);
