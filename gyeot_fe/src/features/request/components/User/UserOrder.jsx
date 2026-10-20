import styles from "@/features/request/components/User/UserOrder.module.css";

function UserOrder({ order, userName, isExpired, state }) {
  return (
    <div className={styles.component}>
      <div className={styles.card}>
        <div className={styles.titleGroup}>
          <div className={`${styles.order} typoCaptionMedium`}>{order}</div>
          <span className={`${styles.userName} typoBodyStrong`}>
            {userName}
          </span>
        </div>
        {isExpired ? (
          <div className={`${styles.expiredTag} typoCaptionMedium`}>
            기한 경과
          </div>
        ) : (
          <div className={`${styles.defaultTag} typoCaptionMedium`}>
            {state}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserOrder;
