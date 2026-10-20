import styles from "@/features/request/components/User/UserState.module.css";

function UserState({ userName, isDone }) {
  return (
    <div className={styles.component}>
      <div className={styles.userImg} />
      <div className={styles.txtContainer}>
        <span className={`${styles.userNameTxt} typoBodyStrong`}>
          {userName}
        </span>
        <span className={`${styles.stateTxt} typoBodySmall`}>
          {isDone ? "*요청사항을 완료했어요!" : "*수정사항을 확인 중이에요."}
        </span>
      </div>
    </div>
  );
}

export default UserState;
