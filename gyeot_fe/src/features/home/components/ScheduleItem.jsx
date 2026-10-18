import styles from "@/features/home/components/ScheduleItem.module.css";
import DotSeparatedText from "@/features/home/components/DotSeparatedText";
import { formatDateTime } from "@/features/home/utils/homeFormat";

// 다가오는 일정 (스케줄 리스트)
function ScheduleItem({ schedule }) {
  const { dateTime, typeName, assigneeName } = schedule;

  return (
    <li className={styles.scheduleItem}>
      <strong className={`${styles.title} typoBodyStrong`}>
        {formatDateTime(dateTime)}
      </strong>
      <DotSeparatedText
        className={`${styles.data} typoBodySmall`}
        items={[typeName, assigneeName ?? "담당자 없음"]}
      />
    </li>
  );
}

export default ScheduleItem;
