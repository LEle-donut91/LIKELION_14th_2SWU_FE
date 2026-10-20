import styles from "@/features/request/components/User/UserOrder.module.css";

// 영어 상태 값을 한글 텍스트로 변환해 주는 매핑 객체
const STATE_TEXT_MAP = {
  EXPIRED: "기한 경과",
  WAITING: "응답 대기",
  DIFFICULTY: "어려움",
  CANCEL: "취소",
};

function UserOrder({ orderList }) {
  return (
    <div className={styles.component}>
      {/* 배열을 받아 map 메서드로 card div들을 동적 렌더링 */}
      {orderList.map((item, index) => {
        // state에 대응하는 한글 텍스트를 가져오고, 없으면 state 그대로 출력
        const stateText = STATE_TEXT_MAP[item.state] || item.state;

        // EXPIRED("기한 경과")일 때만 expiredTag, 나머지는 모두 defaultTag 적용
        const tagStyle = item.state === "EXPIRED" ? styles.expiredTag : styles.defaultTag;

        return (
          <div className={styles.card} key={index}>
            <div className={styles.titleGroup}>
              <div className={`${styles.order} typoCaptionMedium`}>{item.order}</div>
              <span className={`${styles.userName} typoBodyStrong`}>
                {item.userName}
              </span>
            </div>

            <div className={`${tagStyle} typoCaptionMedium`}>{stateText}</div>
          </div>
        );
      })}
    </div>
  );
}

export default UserOrder;
