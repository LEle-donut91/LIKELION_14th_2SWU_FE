import styles from "@/features/request/components/SafetyCard/SafetyCardDetail.module.css";

function SafetyCardDetail({ title, cardList }) {
  return (
    <div className={styles.component}>
      <span className={`${styles.title} typoBodyStrong`}>{title}</span>

      {/* 배열을 받아 map 메서드로 card div를 동적 렌더링 */}
      {cardList.map((card, index) => (
        <div className={styles.card} key={index}>
          <div className={styles.cardTitleGroup}>
            <span className={`${styles.cardTitle} typoBodyStrong`}>
              {card.cardTitle}
            </span>
            {card.isSensitive && (
              <div className={`${styles.tag} typoCaptionMedium`}>민감</div>
            )}
          </div>
          <div className={styles.infoGroup}>
            <span className={`${styles.firstInfo} typoCaptionMedium`}>
              {card.firstInfo}
            </span>
            <span className={`${styles.secondInfo} typoCaptionMedium`}>
              {card.secondInfo}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SafetyCardDetail;
