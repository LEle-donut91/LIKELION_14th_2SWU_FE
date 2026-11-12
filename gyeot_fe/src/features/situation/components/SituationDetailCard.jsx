import styles from "@/features/situation/components/SituationDetailCard.module.css";
import ProgressBar from "@/shared/components/SituationCard/ProgressBar";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import {
  formatDateRange,
  getDdayText,
  getProgressRate,
} from "@/shared/utils/dateFormat";

/**
 * H-03 상황 상세 상단 카드 (진행 바 · 제목 · 디데이 · 진행 중 · 기간 · 참여자 수)
 * - situation        : { title, startDate, endDate }
 * - participantCount : 참여자 수
 */
function SituationDetailCard({ situation, participantCount }) {
  const { title, startDate, endDate } = situation;

  return (
    <article className={styles.situationDetailCard}>
      <ProgressBar rate={getProgressRate(startDate, endDate)} />

      <div className={styles.textContainer}>
        <div className={styles.titleRow}>
          <h2 className={`${styles.title} typoTitleMedium`}>{title}</h2>
          <span className={`${styles.ddayTag} typoCaptionMedium`}>
            {getDdayText(endDate)}
          </span>
          <span className={`${styles.stepTag} typoCaptionMedium`}>
            진행 중
          </span>
        </div>
        <DotSeparatedText
          className={`${styles.meta} typoCaptionMedium`}
          items={[
            formatDateRange(startDate, endDate),
            `참여자 ${participantCount}명`,
          ]}
        />
      </div>
    </article>
  );
}

export default SituationDetailCard;
