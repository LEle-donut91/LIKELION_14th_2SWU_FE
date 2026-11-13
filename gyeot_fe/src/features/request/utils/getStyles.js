import {
  REQUEST_STEP_ORDER,
  REQUEST_ENDED_STATES,
} from "@/features/request/constants/requestConstants";

/**
 * RequestStep 컴포넌트의 진행 상태에 따른 스타일 클래스명을 반환
 */
export function getRequestStepStyle(step, currentState, styles) {
  // 취소/만료 상태라면 모든 단계를 이전 단계 스타일로 통일
  if (REQUEST_ENDED_STATES.includes(currentState)) return styles.previous;

  // cur: 현재 상태가 몇 번째 단계인지 / idx: 지금 그리는 단계가 몇 번째인지
  const cur = REQUEST_STEP_ORDER.indexOf(currentState);
  const idx = REQUEST_STEP_ORDER.indexOf(step);

  // 현재 단계 -> current / 지나간 단계 -> previous / 앞으로 올 단계 -> future
  if (idx === cur) return styles.current;
  return idx < cur ? styles.previous : styles.future;
}
