import styles from "@/features/request/components/SafetyCard/SafetyCardDetail.module.css";

function SafetyCardDetail({ title, isSensitive, firstInfo, secondInfo }) {
  return (
    <div className={styles.component}>
      <div className={styles.titleGroup}>
        <span className={`${styles.title} typoBodyStrong`}>{title}</span>
        {isSensitive && (
          <div className={`${styles.tag} typoCaptionMedium`}>민감</div>
        )}
      </div>
      <div className={styles.infoGroup}>
        <span className={`${styles.firstInfo} typoCaptionMedium`}>
          {firstInfo}
        </span>
        <span className={`${styles.secondInfo} typoCaptionMedium`}>
          {secondInfo}
        </span>
      </div>
    </div>
  );
}

export default SafetyCardDetail;
