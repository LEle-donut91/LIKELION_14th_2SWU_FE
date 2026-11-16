import styles from "@/features/request/components/State/DueDateState.module.css";
import { useTimer } from "@/features/request/hooks/useTimer";
import { parseTimeToSeconds } from "@/features/request/utils/requestUtils";

function DueDateState({ isResponse, isDeadline = false, title, dueDate }) {
  const { hour, minute, second } = useTimer(
    isDeadline ? 0 : parseTimeToSeconds(dueDate),
    isResponse,
    isDeadline ? dueDate : null,
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
