import styles from "@/features/request/components/Request/RequestStep.module.css";
import { REQUEST_STATE } from "@/features/request/constants/enumConstants";
import {
  REQUEST_STEP_LABELS,
  REQUEST_STEP_ORDER,
} from "@/features/request/constants/requestConstants";
import { getRequestStepStyle } from "@/features/request/utils/getStyles";

/**
 * @param isRequester 현재 사용자가 요청자인지 여부를 나타내는 Boolean(true/false) 값
 * @param state 현재 요청의 진행 상태
 */
function RequestStep({ isRequester, state }) {
  // 요청자 화면일 때만 "요청" 단계 표시
  const steps = isRequester
    ? REQUEST_STEP_ORDER
    : REQUEST_STEP_ORDER.filter((step) => step !== REQUEST_STATE.REQUESTED);

  return (
    <div className={styles.component}>
      {steps.map((step) => (
        <div
          key={step}
          className={`${styles.cardstep} ${getRequestStepStyle(step, state, styles)}`}
        >
          <span className="typoCaptionMedium">{REQUEST_STEP_LABELS[step]}</span>
        </div>
      ))}
    </div>
  );
}

export default RequestStep;
