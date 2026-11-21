// 응답 기한 입력값 객체 (DueDateValue)를 분 단위 총합으로 환산 (없는 키/null은 0으로 취급)
export const toMinutes = (d) =>
  (parseInt(d?.days, 10) || 0) * 24 * 60 +
  (parseInt(d?.hours, 10) || 0) * 60 +
  (parseInt(d?.minutes, 10) || 0);
