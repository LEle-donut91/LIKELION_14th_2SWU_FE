import styles from "@/features/request/components/State/DueDateState.module.css";
import { useTimer } from "@/features/request/hooks/useTimer";
import { parseTimeToSeconds } from "@/features/request/utils/requestUtils";

function DueDateState({ isResponse, title, dueDate }) {
  // "HH:MM:SS" -> 초 변환 후 카운트다운 (응답 기한 모드일 때만 동작)
  const { hour, minute, second } = useTimer(
    parseTimeToSeconds(dueDate),
    isResponse,
  );

  return (
    <div
      className={`${styles.component} ${isResponse ? styles.responseComponent : ""}`}
    >
      <span className={`${styles.title} typoBodySmall`}>{title}</span>
      <span
        className={`${styles.dueDate} ${isResponse ? `${styles.responseDueDate} typoBodyStrong` : "typoBodySmall"}`}
      >
        {isResponse ? `${hour}:${minute}:${second}` : dueDate}
      </span>
    </div>
  );
}

export default DueDateState;
