import styles from "@/features/situation/components/PastSituationItem.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import iconSituation from "@/shared/assets/icons/IconSituation.svg";
import { formatMonthDayRange } from "@/features/situation/utils/situationFormat";

// 지난 상황 목록의 한 줄 (아이콘 · 제목 · 기간 · 요청 수 · 종료 태그)
function PastSituationItem({ situation, onClick }) {
  const { title, startDate, endDate, requestCount } = situation;

  return (
    <li>
      <button type="button" className={styles.pastItemBtn} onClick={onClick}>
        <span className={styles.profile}>
          <MaskIcon src={iconSituation} size={18} />
        </span>

        <span className={styles.textContainer}>
          <span className={`${styles.title} typoBodyStrong`}>{title}</span>
          <DotSeparatedText
            className={`${styles.meta} typoBodySmall`}
            items={[
              formatMonthDayRange(startDate, endDate),
              `요청 ${requestCount}건`,
            ]}
          />
        </span>

        <span className={`${styles.endTag} typoCaptionMedium`}>종료</span>
      </button>
    </li>
  );
}

export default PastSituationItem;
