import styles from "@/features/request/components/User/UserOrder.module.css";
import {
  USER_ORDER_STATE_TEXT,
} from "@/features/request/constants/requestConstants";
import {
  USER_ORDER_STATE,
} from "@/features/request/constants/enumConstants";

function UserOrder({ title, orderList }) {
  return (
    <div className={styles.component}>
      <span className={`${styles.title} typoTitleMedium`}>{title}</span>
      <div className={styles.cardList}>
        {/* 배열을 받아 map 메서드로 card div들을 동적 렌더링 */}
        {orderList.map((item) => {
          // 매핑된 한글 텍스트, 없으면 state 그대로 출력
          const stateText = USER_ORDER_STATE_TEXT[item.state] || item.state;

          // EXPIRED일 때만 expiredTag, 나머지는 defaultTag
          const tagStyle =
            item.state === USER_ORDER_STATE.EXPIRED
              ? styles.expiredTag
              : styles.defaultTag;

          return (
            <div className={styles.card} key={item.order}>
              <div className={styles.titleGroup}>
                <div className={`${styles.order} typoCaptionMedium`}>
                  {item.order}
                </div>
                <span className={`${styles.userName} typoBodyStrong`}>
                  {item.userName}
                </span>
              </div>

              <div className={`${tagStyle} typoCaptionMedium`}>{stateText}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserOrder;
