import styles from "@/features/home/components/SituationCard.module.css";
import ProgressBar from "@/features/home/components/ProgressBar";
import DotSeparatedText from "@/features/home/components/DotSeparatedText";
import SituationSchedule from "@/features/home/components/SituationSchedule";
import SituationTagList from "@/features/home/components/SituationTagList";
import {
  formatDateRange,
  getDdayText,
  getProgressRate,
} from "@/features/home/utils/homeFormat";

// 진행 중인 상황 카드
function SituationCard({ situation, onDetailClick }) {
  const {
    title,
    startDate,
    endDate,
    participantCount,
    nextSchedule,
    extraScheduleCount,
    tags,
  } = situation;

  // 참여자 수가 없는 경우(참여 상황 탭) 메타에서 숨김
  const hasParticipantCount = typeof participantCount === "number";

  return (
    <article className={styles.situationCard}>
      <ProgressBar rate={getProgressRate(startDate, endDate)} />

      <div className={styles.situationTitle}>
        <div className={styles.textContainer}>
          <h3 className={`${styles.title} typoTitleMedium`}>{title}</h3>
          <span className={`${styles.ddayTag} typoCaptionMedium`}>
            {getDdayText(endDate)}
          </span>
        </div>
        <DotSeparatedText
          className={`${styles.meta} typoCaptionMedium`}
          items={[
            formatDateRange(startDate, endDate),
            hasParticipantCount && `참여자 ${participantCount}명`,
          ]}
        />
      </div>

      <SituationSchedule
        nextSchedule={nextSchedule}
        extraScheduleCount={extraScheduleCount}
        onMoreClick={onDetailClick}
      />

      <SituationTagList tags={tags} />
    </article>
  );
}

export default SituationCard;
