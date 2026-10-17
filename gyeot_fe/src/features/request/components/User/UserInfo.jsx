import styles from "@/features/request/components/User/UserInfo.module.css";
import userImg from "@/features/request/assets/userImg.svg";
import circle from "@/features/request/assets/circle.svg";

function UserInfo({ isAgain, state, userName, part }) {
  return (
    <div className={styles.userInfo}>
      <img className={styles.userImg} src={userImg} />
      <div className={styles.txtContainer}>
        {isAgain ? (
          <>
            <div className={styles.subTxtContainer}>
              <span className={`${styles.userNameTxt} typoBodyStrong`}>
                {userName}
              </span>
              <div className={styles.circleContainer}>
                <img src={circle} alt="" />
              </div>
              <span className={`${styles.partTxt} typoCaptionMedium`}>{part}</span>
            </div>
            <span className={`${styles.stateTxt} typoBodySmall`}>{state}</span>
          </>
        ) : (
          <>
            <span className={`${styles.stateTxt} typoBodySmall`}>{state}</span>
            <div className={styles.subTxtContainer}>
              <span className={`${styles.userNameTxt} typoBodyStrong`}>
                {userName}
              </span>
              <div className={styles.circleContainer}>
                <img src={circle} alt="" />
              </div>
              <span className={`${styles.partTxt} typoCaptionMedium`}>{part}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserInfo;
