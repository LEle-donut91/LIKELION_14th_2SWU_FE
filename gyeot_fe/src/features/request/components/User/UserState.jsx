import styles from "@/features/request/components/User/UserState.module.css";

function UserState({ userName, userState }) {
  return (
    <div className={styles.component}>
      <div className={styles.userImg} />
      <div className={styles.txtContainer}>
        <span className={`${styles.userNameTxt} typoBodyStrong`}>
          {userName}
        </span>
        <span className={`${styles.stateTxt} typoBodySmall`}>{userState}</span>
      </div>
    </div>
  );
}

export default UserState;
