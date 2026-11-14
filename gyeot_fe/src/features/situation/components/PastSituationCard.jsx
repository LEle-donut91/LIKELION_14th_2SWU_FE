import styles from "@/features/situation/components/PastSituationCard.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import iconRight from "@/shared/assets/icons/iconRight.svg";
import { formatMonthDayDashRange } from "@/features/situation/utils/situationFormat";

/**
 * 지난 상황 카드 (제목 · 기간 · 참여자 수 또는 "OO님의 상황")
 * - H-04 목록  : onClick을 넘기면 버튼 + 오른쪽 화살표
 * - N-04 상세  : onClick 없이 쓰면 화살표 없는 정보 카드
 * - situation : { title, startDate, endDate, isOwner, ownerName, participantCount }
 */
function PastSituationCard({ situation, onClick }) {
  const { title, startDate, endDate, isOwner, ownerName, participantCount } =
    situation;
  const isClickable = Boolean(onClick);
  const CardTag = isClickable ? "button" : "div";

  return (
    <CardTag
      {...(isClickable && { type: "button", onClick })}
      className={`${styles.pastSituationCard} ${
        isClickable ? styles.clickableCard : ""
      }`}
    >
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
      {isClickable && (
        <MaskIcon className={styles.rightIcon} src={iconRight} size={20} />
      )}
    </CardTag>
  );
}

export default PastSituationCard;
