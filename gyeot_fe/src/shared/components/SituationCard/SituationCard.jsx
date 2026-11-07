import styles from "@/shared/components/SituationCard/SituationCard.module.css";
import ProgressBar from "@/shared/components/SituationCard/ProgressBar";
import SituationSchedule from "@/shared/components/SituationCard/SituationSchedule";
import SituationTagList from "@/shared/components/SituationCard/SituationTagList";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import iconCalendar from "@/shared/assets/icons/iconCalendar.svg";
import {
  formatDateRange,
  formatDateTime,
  getDdayText,
  getProgressRate,
} from "@/shared/utils/dateFormat";

/**
 * 진행 중인 상황 카드 (공통)
 * - 사용 화면: H-00(홈), S-00(상황 목록)
 *
 * @param {object}   situation         상황 데이터
 * @param {object}   [upcomingSchedule] 카드 하단 '다음 일정' 줄 데이터 { dateTime, title, assigneeName }
 *                                      S-00에서만 넘기고, 넘기지 않으면 줄이 보이지 않음 (H-00)
 * @param {Function} onDetailClick     '자세히 보기' 클릭 시 동작
 */
function SituationCard({ situation, upcomingSchedule, onDetailClick }) {
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
      <div className={styles.cardHeader}>
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
      </div>

      <SituationSchedule
        nextSchedule={nextSchedule}
        extraScheduleCount={extraScheduleCount}
        onMoreClick={onDetailClick}
      />

      <SituationTagList tags={tags} />

      {upcomingSchedule && (
        <p className={styles.upcomingSchedule}>
          <img
            className={styles.calendarIcon}
            src={iconCalendar}
            alt=""
            aria-hidden="true"
          />
          <span>
            <strong className={styles.upcomingLabel}>다음 일정</strong>
            {[
              "",
              formatDateTime(upcomingSchedule.dateTime),
              upcomingSchedule.title,
              upcomingSchedule.assigneeName,
            ]
              .filter((text, index) => index === 0 || text)
              .join(" · ")}
          </span>
        </p>
      )}
    </article>
  );
}

export default SituationCard;
