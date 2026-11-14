import styles from "@/features/situation/components/SituationDetailCard.module.css";
import ProgressBar from "@/shared/components/SituationCard/ProgressBar";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import {
  formatDateRange,
  getDdayText,
  getProgressRate,
} from "@/shared/utils/dateFormat";

/**
 * H-03 상황 상세 상단 카드 (진행 바 · 제목 · 기간)
 * - 정보 주인(H-03-01): 디데이 + '진행 중' + 참여자 수
 * - 참여자(H-03-02)  : '참여 중' + "OO님의 상황"
 *
 * - situation        : { title, startDate, endDate, ownerName }
 * - isOwner          : 정보 주인 시점 여부
 * - participantCount : 참여자 수 (정보 주인 시점에서만 표시)
 */
function SituationDetailCard({ situation, isOwner, participantCount }) {
  const { title, startDate, endDate, ownerName } = situation;

  return (
    <article className={styles.situationDetailCard}>
      <ProgressBar rate={getProgressRate(startDate, endDate)} />

      <div className={styles.textContainer}>
        <div className={styles.titleRow}>
          <h2 className={`${styles.title} typoTitleMedium`}>{title}</h2>
          {isOwner && (
            <span className={`${styles.ddayTag} typoCaptionMedium`}>
              {getDdayText(endDate)}
            </span>
          )}
          <span className={`${styles.stepTag} typoCaptionMedium`}>
            {isOwner ? "진행 중" : "참여 중"}
          </span>
        </div>
        <DotSeparatedText
          className={`${styles.meta} typoCaptionMedium`}
          items={[
            formatDateRange(startDate, endDate),
            isOwner ? `참여자 ${participantCount}명` : `${ownerName}님의 상황`,
          ]}
        />
      </div>
    </article>
  );
}

export default SituationDetailCard;
