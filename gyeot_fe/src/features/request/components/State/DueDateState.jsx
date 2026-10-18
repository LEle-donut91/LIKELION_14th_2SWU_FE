import styles from "@/features/request/components/State/DueDateState.module.css";

function DueDateState({ isResponse, title, dueDate }) {
  return (
    <div
      className={`${styles.component} ${isResponse ? styles.responseComponent : ""}`}
    >
      <span className={`${styles.title} typoBodySmall`}>{title}</span>
      <span
        className={`${styles.dueDate} ${isResponse ? `${styles.responseDueDate} typoBodyStrong` : "typoBodySmall"}`}
      >
        {dueDate}
      </span>
    </div>
  );
}

export default DueDateState;
