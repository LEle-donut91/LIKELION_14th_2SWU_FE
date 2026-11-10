import styles from "@/features/situation/components/JoinedSituationCard.module.css";
import ProgressBar from "@/shared/components/SituationCard/ProgressBar";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import { formatDateRange, getProgressRate } from "@/shared/utils/dateFormat";

/**
 * H-03-05 참여자 시점의 상황 카드 (진행 바 · 제목 · 기간 · 누구의 상황인지 · 참여 중)
 * - situation : { title, startDate, endDate, ownerName }
 */
function JoinedSituationCard({ situation }) {
  const { title, startDate, endDate, ownerName } = situation;

  return (
    <article className={styles.joinedSituationCard}>
      <ProgressBar rate={getProgressRate(startDate, endDate)} />

      <div className={styles.textContainer}>
        <div className={styles.titleRow}>
          <h3 className={`${styles.title} typoTitleMedium`}>{title}</h3>
          <span className={`${styles.stepTag} typoCaptionMedium`}>
            참여 중
          </span>
        </div>
        <DotSeparatedText
          className={`${styles.meta} typoCaptionMedium`}
          items={[
            formatDateRange(startDate, endDate),
            `${ownerName}님의 상황`,
          ]}
        />
      </div>
    </article>
  );
}

export default JoinedSituationCard;
