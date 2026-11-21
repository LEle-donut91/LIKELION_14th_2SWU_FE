import styles from "@/features/home/components/ScheduleItem.module.css";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import { formatDateTime } from "@/shared/utils/dateFormat";

// 다가오는 일정 (스케줄 리스트)
// - 일시가 없으면(null) 일시를 비워 둠 (잘못된 날짜 표시 방지)
function ScheduleItem({ schedule }) {
  const { dateTime, typeName, assigneeName } = schedule;

  return (
    <li className={styles.scheduleItem}>
      <strong className={`${styles.title} typoBodyStrong`}>
        {dateTime ? formatDateTime(dateTime) : null}
      </strong>
      <DotSeparatedText
        className={`${styles.data} typoBodySmall`}
        items={[typeName, assigneeName ?? "담당자 없음"]}
      />
    </li>
  );
}

export default ScheduleItem;