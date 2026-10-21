import styles from "@/features/request/components/Footer/SmallFooter.module.css";

function SmallFooter({
  leftType,
  leftTitle,
  rightTitle,
  leftOnClick,
  rightOnClick,
}) {
  return (
    <footer className={styles.component}>
      <button
        onClick={leftOnClick}
        className={`${styles.btn} ${styles[leftType]}`}
      >
        <span className="typoBodyStrong">{leftTitle}</span>
      </button>
      <button
        onClick={rightOnClick}
        className={`${styles.btn} ${styles.primary}`}
      >
        <span className="typoBodyStrong">{rightTitle}</span>
      </button>
    </footer>
  );
}

export default SmallFooter;
