import styles from "@/features/request/components/Request/RequestSummary.module.css";

function RequestSummary({
  isAfterInfo,
  title,
  isRequester,
  infoList = [], // 부모로부터 infoList 배열을 props로 전달받음
  message,
}) {
  return (
    <div className={`${styles.component} ${isAfterInfo ? styles.isChanged : ""}`}>
      <div className={styles.header}>
        <span className={`${styles.title} typoTitleMedium`}>{title}</span>
        {!isRequester && (
          <div className={`${styles.tag} typoCaptionMedium`}>병원 동행</div>
        )}
      </div>

      <div className={`${styles.infoGroup} typoBodyMedium`}>
        {infoList.map((item, index) => (
          <div className={styles.infoRow} key={index}>
            <div className={styles.infoTitleGroup}>
              <img className={styles.infoImg} src={item.icon} />
              <span>{item.label}</span>
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      <span className={`${styles.message} typoBodyMedium`}>{message}</span>
    </div>
  );
}

export default RequestSummary;
