import styles from "@/features/request/components/User/UserInfo.module.css";
import iconPoint from "@/shared/assets/icons/iconPoint.svg";

function UserInfo({ isAgain, state, userName, part }) {
  return (
    <div className={styles.userInfo}>
      <div className={styles.userImg} />
      <div className={styles.txtContainer}>
        {isAgain ? (
          <>
            <div className={styles.subTxtContainer}>
              <span className={`${styles.userNameTxt} typoBodyStrong`}>
                {userName}
              </span>
              <div className={styles.circleContainer}>
                <img className={styles.pointImg} src={iconPoint} alt="" />
              </div>
              <span className={`${styles.partTxt} typoCaptionMedium`}>
                {part}
              </span>
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
                <img src={iconPoint} alt="" />
              </div>
              <span className={`${styles.partTxt} typoCaptionMedium`}>
                {part}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserInfo;
