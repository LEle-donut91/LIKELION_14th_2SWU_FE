/**
 * [request/ 공통] 시간 관련 숫자 상수
 * 분/밀리초 단위 환산, 응답 기한·시작 시간 제약 등
 */

// 1분(Minute)을 밀리초(Millisecond) 단위로 환산하기 위한 상수
export const MS_PER_MINUTE = 60 * 1000;

// 시간/응답 기한 관련 Number 타입 상수
export const DUE_DATE_MIN_MINUTES = 60; // 응답 기한 최소 1시간
export const DUE_DATE_MAX_MINUTES = 3 * 24 * 60; // 응답 기한 최대 3일
export const DUE_DATE_DEFAULT_MINUTES = 24 * 60; // 응답 기한 기본값 24시간
export const START_MIN_LEAD_MINUTES = 60; // 시작까지 최소 1시간
