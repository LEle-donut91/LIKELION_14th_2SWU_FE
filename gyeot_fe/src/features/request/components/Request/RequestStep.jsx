import styles from "@/features/request/components/Request/RequestStep.module.css";
import {
  REQUEST_STATE,
  REQUEST_STEP_LABELS,
  REQUEST_STEP_ORDER,
} from "@/features/request/constants/requestConstants";

/**
 * @param isRequester 현재 사용자가 요청자인지 여부를 나타내는 Boolean(true/false) 값
 * @param state 현재 요청의 진행 상태 (REQUEST_STATE 값: "request", "accept", "progress", "done", "cancel")
 */
function RequestStep({ isRequester, state }) {
  // 스타일 결정 함수
  const getStyle = (step) => {
    // 취소 상태라면 모든 단계를 이전 단계 스타일로 통일
    if (state === REQUEST_STATE.CANCEL) return styles.previous;

    // cur: 현재 상태가 몇 번째 단계인지 / idx: 지금 그리는 단계가 몇 번째인지
    const cur = REQUEST_STEP_ORDER.indexOf(state);
    const idx = REQUEST_STEP_ORDER.indexOf(step);

    // 현재 단계 -> current / 지나간 단계 -> previous / 앞으로 올 단계 -> future
    if (idx === cur) return styles.current;
    return idx < cur ? styles.previous : styles.future;
  };

  // 요청자 화면일 때만 "요청" 단계 표시
  const steps = isRequester
    ? REQUEST_STEP_ORDER
    : REQUEST_STEP_ORDER.filter((step) => step !== REQUEST_STATE.REQUEST);

  return (
    <div className={styles.component}>
      {steps.map((step) => (
        <div key={step} className={`${styles.cardstep} ${getStyle(step)}`}>
          <span className="typoCaptionMedium">{REQUEST_STEP_LABELS[step]}</span>
        </div>
      ))}
    </div>
  );
}

export default RequestStep;
