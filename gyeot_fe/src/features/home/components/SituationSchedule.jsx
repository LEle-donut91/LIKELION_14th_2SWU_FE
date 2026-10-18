import styles from "@/features/home/components/SituationSchedule.module.css";
import MaskIcon from "@/features/home/components/MaskIcon";
import DotSeparatedText from "@/features/home/components/DotSeparatedText";
import iconRight from "@/shared/assets/icons/IconRight.svg";
import { formatDateTime } from "@/features/home/utils/homeFormat";

// 상황 카드 내 스케줄 컨테이너 (다음 일정 요약 + 자세히 보기)
function SituationSchedule({ nextSchedule, extraScheduleCount, onMoreClick }) {
  const assigneeText = nextSchedule?.assigneeName
    ? `${nextSchedule.assigneeName}님`
    : "담당자 없음";

  return (
    <div className={styles.situationSchedule}>
      <div className={`${styles.topContainer} typoBodyMedium`}>
        {nextSchedule ? (
          <>
            <DotSeparatedText
              items={[
                formatDateTime(nextSchedule.dateTime),
                assigneeText,
                `${nextSchedule.typeName} 일정`,
              ]}
            />
            <p className={styles.text}>
              {extraScheduleCount > 0
                ? `외 ${extraScheduleCount}건이 예정되어 있어요.`
                : "예정되어 있어요."}
            </p>
          </>
        ) : (
          <p className={styles.text}>예정된 일정이 없어요.</p>
        )}
      </div>

      <button
        type="button"
        className={`${styles.btnMore} typoCaptionMedium`}
        onClick={onMoreClick}
      >
        자세히 보기
        <MaskIcon src={iconRight} size={12} />
      </button>
    </div>
  );
}

export default SituationSchedule;
