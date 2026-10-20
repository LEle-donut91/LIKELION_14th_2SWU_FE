import styles from "@/features/request/components/User/UserOrder.module.css";

// 영어 상태 값을 한글 텍스트로 변환해 주는 매핑 객체
const STATE_TEXT_MAP = {
  EXPIRED: "기한 경과",
  WAITING: "응답 대기",
  DIFFICULTY: "어려움",
  CANCEL: "취소",
};

function UserOrder({ order, userName, state }) {
  // state에 대응하는 한글 텍스트를 가져오고, 없으면 state 그대로 출력
  const stateText = STATE_TEXT_MAP[state] || state;

  // EXPIRED("기한 경과")일 때만 expiredTag, 나머지는 모두 defaultTag 적용
  const tagStyle = state === "EXPIRED" ? styles.expiredTag : styles.defaultTag;

  return (
    <div className={styles.component}>
      <div className={styles.card}>
        <div className={styles.titleGroup}>
          <div className={`${styles.order} typoCaptionMedium`}>{order}</div>
          <span className={`${styles.userName} typoBodyStrong`}>
            {userName}
          </span>
        </div>

        <div className={`${tagStyle} typoCaptionMedium`}>{stateText}</div>
      </div>
    </div>
  );
}

export default UserOrder;
