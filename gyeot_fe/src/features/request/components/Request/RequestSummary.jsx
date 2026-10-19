import styles from "@/features/request/components/Request/RequestSummary.module.css";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconHealthy from "@/shared/assets/icons/iconHealthy.svg";
import iconDate from "@/shared/assets/icons/iconDate.svg";

function RequestSummary({
  isChanged,
  title,
  isRequester,
  hasInfo,
  time,
  location,
  information,
  message,
}) {
  return (
    <div className={`${styles.component} ${isChanged ? styles.isChanged : ""}`}>
      <div className={styles.header}>
        <span className={`${styles.title} typoTitleMedium`}>{title}</span>
        {!isRequester ? (
          <div className={`${styles.tag} typoCaptionMedium`}>병원 동행</div>
        ) : (
          <></>
        )}
      </div>
      <div className={`${styles.infoGroup} typoBodyMedium`}>
        <div className={styles.infoRow}>
          <div className={styles.infoTitleGroup}>
            <img className={styles.infoImg} src={iconDate} />
            <span>{isRequester ? "일정" : "시간"}</span>
          </div>
          <span>{time}</span>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoTitleGroup}>
            <img className={styles.infoImg} src={iconLocation} />
            <span>장소</span>
          </div>
          <span>{location}</span>
        </div>
        {hasInfo ? (
          <div className={styles.infoRow}>
            <div className={styles.infoTitleGroup}>
              <img className={styles.infoImg} src={iconHealthy} />
              <span>정보</span>
            </div>
            <span>{information}</span>
          </div>
        ) : (
          <></>
        )}
      </div>
      <span className={`${styles.message} typoBodyMedium`}>{message}</span>
    </div>
  );
}

export default RequestSummary;
