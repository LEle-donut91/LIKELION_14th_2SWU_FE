import styles from "@/features/home/components/ProgressBar.module.css";

// 진행률 바 (두께 4px, olive-400 + gray-100)
function ProgressBar({ rate }) {
  return (
    <div
      className={styles.progressBar}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rate}
    >
      <div className={styles.fill} style={{ width: `${rate}%` }} />
    </div>
  );
}

export default ProgressBar;
