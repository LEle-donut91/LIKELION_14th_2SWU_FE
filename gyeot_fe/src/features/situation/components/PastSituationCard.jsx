import styles from "@/features/situation/components/PastSituationCard.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import iconRight from "@/shared/assets/icons/iconRight.svg";
import { formatMonthDayDashRange } from "@/features/situation/utils/situationFormat";

/**
 * H-04 지난 상황 카드 (제목 · 기간 · 참여자 수 또는 "OO님의 상황" · 오른쪽 화살표)
 * - situation : { title, startDate, endDate, isOwner, ownerName, participantCount }
 */
function PastSituationCard({ situation, onClick }) {
  const { title, startDate, endDate, isOwner, ownerName, participantCount } =
    situation;

  return (
    <li>
      <button type="button" className={styles.pastSituationCard} onClick={onClick}>
        <span className={styles.textContainer}>
          <span className={`${styles.title} typoBodyStrong`}>{title}</span>
          <DotSeparatedText
            className={`${styles.meta} typoCaptionMedium`}
            items={[
              formatMonthDayDashRange(startDate, endDate),
              isOwner ? `참여자 ${participantCount}명` : `${ownerName}님의 상황`,
            ]}
          />
        </span>
        <MaskIcon className={styles.rightIcon} src={iconRight} size={20} />
      </button>
    </li>
  );
}

export default PastSituationCard;
