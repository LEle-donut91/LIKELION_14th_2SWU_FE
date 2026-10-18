import styles from "@/features/request/components/Request/RequestStep.module.css";
/**
 * @param isRequester 현재 사용자가 요청자인지 여부를 나타내는 Boolean(true/false) 값
 * @param state 현재 요청의 진행 상태를 나타내는 문자열 값 ("request", "accept", "progress", "done", "cancel")
 */
function RequestStep({ isRequester, state }) {
  // 스타일 결정 함수
  const getStyle = (step) => {
    // "cancel"(취소) 상태라면, 모든 항목의 스타일이 styles.previous(이전 단계 스타일)로 통일
    if (state === "cancel") return styles.previous;

    // order 배열을 통해 전체 진행 순서(요청 -> 수락 -> 진행 -> 완료)를 정의
    const order = ["request", "accept", "progress", "done"];

    // cur: 현재 시스템의 상태(state)가 몇 번째 단계인지(인덱스)
    // idx: 지금 그려내고 있는 특정 단계(step)가 몇 번째인지(인덱스)
    const cur = order.indexOf(state),
      idx = order.indexOf(step);

    // 현재 그리는 카드의 단계가 현재 상태와 같은 단계라면 current 스타일
    // 현재 상태보다 과거 단계라면 previous 스타일
    // 현재 상태보다 미래 단계라면 future 스타일
    return idx === cur
      ? styles.current
      : idx < cur
        ? styles.previous
        : styles.future;
  };

  return (
    <div className={styles.component}>
      {/* 요청자 화면일 때만 "요청" 단계 표시 */}
      {isRequester && (
        <div className={`${styles.cardstep} ${getStyle("request")}`}>
          <span className="typoCaptionMedium">요청</span>
        </div>
      )}
      <div className={`${styles.cardstep} ${getStyle("accept")}`}>
        <span className="typoCaptionMedium">수락</span>
      </div>
      <div className={`${styles.cardstep} ${getStyle("progress")}`}>
        <span className="typoCaptionMedium">진행</span>
      </div>
      <div className={`${styles.cardstep} ${getStyle("done")}`}>
        <span className="typoCaptionMedium">완료</span>
      </div>
    </div>
  );
}

export default RequestStep;
