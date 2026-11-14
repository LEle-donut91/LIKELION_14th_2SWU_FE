// 안심카드 화면 표시용 유틸리티
import {
  BIRTH_DATE_INPUT_LENGTH,
  BLOOD_TYPE_LABELS,
  SHARE_AUTO_REVOKE_TEXT,
  SHARE_HELP_TYPE_LABELS,
} from "@/features/card/constants/cardConstants";

// 갱신일 표시: "2026-09-20" → "갱신 9/20"
export const formatUpdatedDate = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return `갱신 ${date.getMonth() + 1}/${date.getDate()}`;
};

// 공유 건수 표시: 2 → "지금 공유 중 2건"
export const formatSharingCount = (count = 0) => `지금 공유 중 ${count}건`;

/**
 * =====================================================================
 * [C-01] 기본 정보
 * - 날짜 문자열("YYYY-MM-DD")은 new Date()로 파싱하지 않고 직접 나눠서 사용
 *   (new Date("YYYY-MM-DD")는 UTC 기준으로 해석되어 시간대에 따라 하루가 밀릴 수 있음)
 * =====================================================================
 */

// "YYYY-MM-DD" → { year, month, day } (숫자) / 형식이 다르면 null
const parseDateString = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

// 숫자 두 자리 맞춤: 9 → "09"
const padTwo = (number) => String(number).padStart(2, "0");

// 갱신일 뱃지 표시: "2026-09-20" → "9/20"
export const formatShortDate = (value) => {
  const date = parseDateString(value);
  if (!date) return "";
  return `${date.month}/${date.day}`;
};

// 생년월일 표시: "2000-12-30" → "2000년 12월 30일 출생"
export const formatBirthDate = (value) => {
  const date = parseDateString(value);
  if (!date) return "";
  return `${date.year}년 ${padTwo(date.month)}월 ${padTwo(date.day)}일 출생`;
};

// 혈액형 표시: "AB" → "AB형"
export const formatBloodType = (value) => BLOOD_TYPE_LABELS[value] ?? "";

// 생년월일 저장값 → 입력값: "2000-12-30" → "20001230"
export const toBirthDateInput = (value) => (value ? value.replaceAll("-", "") : "");

// 생년월일 입력값 → 저장값: "20001230" → "2000-12-30"
export const toBirthDateValue = (input) =>
  `${input.slice(0, 4)}-${input.slice(4, 6)}-${input.slice(6, 8)}`;

// 입력 중 정리: 숫자만 남기고 최대 8자리로 자름
export const sanitizeBirthDateInput = (input) =>
  input.replace(/\D/g, "").slice(0, BIRTH_DATE_INPUT_LENGTH);

// 8자리 숫자인지 확인
export const isBirthDateLengthValid = (input) =>
  new RegExp(`^\\d{${BIRTH_DATE_INPUT_LENGTH}}$`).test(input);

// 실제 존재하는 날짜인지 확인: "20000230" → false (2월 30일 없음)
export const isExistingDate = (input) => {
  const year = Number(input.slice(0, 4));
  const month = Number(input.slice(4, 6));
  const day = Number(input.slice(6, 8));

  // Date는 범위를 넘는 값을 다음 달로 넘겨버리므로, 만든 뒤 값이 그대로인지 비교
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

// 오늘 날짜를 저장 형식으로: → "2026-11-10" (로컬 시간 기준)
export const getTodayDateString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${padTwo(today.getMonth() + 1)}-${padTwo(today.getDate())}`;
};

// 미래 날짜인지 확인 (오늘은 허용): 오늘이 2026-11-10이면 "20261111" → true
// - 둘 다 "YYYYMMDD" 8자리 숫자 문자열이라 문자열 비교로 날짜 순서 비교 가능
export const isFutureDate = (input) =>
  input > toBirthDateInput(getTodayDateString());

/**
 * =====================================================================
 * [C-02] 건강 정보
 * =====================================================================
 */

// 목록 카드 설명: ("2024년", " 진단") → "2024년 진단" / 값이 없으면 "" (뒤 문구도 붙이지 않음)
export const formatHealthDescription = (value, suffix = "") =>
  value ? `${value}${suffix}` : "";

/**
 * =====================================================================
 * [C-06] 공유 관리
 * - 시각 문자열("YYYY-MM-DDTHH:mm:ss")은 시간대 표기가 없어 new Date()가 로컬 시간으로 해석함
 *   (C-01 날짜 문자열 "YYYY-MM-DD"처럼 UTC로 밀리지 않음)
 * - shared/utils/dateFormat.js의 formatDateTime은 "10/2(목) 14:00"처럼 요일이 붙어 시안과 달라 별도 작성
 * =====================================================================
 */

// 공유 카드 시각 표시: "2026-10-02T14:00:00" → "10/2 14:00"
export const formatShareDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getMonth() + 1}/${date.getDate()} ${padTwo(date.getHours())}:${padTwo(date.getMinutes())}`;
};

// 자동 회수 문구: "2026-10-02T18:00:00" → "~ 10/2 18:00 자동 회수"
export const formatAutoRevokeText = (value) => {
  const dateTime = formatShareDateTime(value);
  return dateTime ? `~ ${dateTime} ${SHARE_AUTO_REVOKE_TEXT}` : "";
};

// 도움 종류 표시: "HOSPITAL" → "병원 동행"
export const formatHelpType = (value) => SHARE_HELP_TYPE_LABELS[value] ?? "";

// 공유 항목 태그 목록: 같은 항목 유형(informationType)은 한 번만 표시
// 예: [복용약(혈압약), 복용약(당뇨약), 알레르기] → [복용약, 알레르기]
export const getUniqueSharedItems = (sharedItems = []) => {
  const seenTypes = new Set();
  return sharedItems.filter(({ informationType }) => {
    if (seenTypes.has(informationType)) return false;
    seenTypes.add(informationType);
    return true;
  });
};
