import styles from "@/features/home/components/StatusCard.module.css";

// 상태 카드 1개 (숫자 + 라벨)
function StatusCard({ label, count, isActive, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.statusCard} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <span className="typoTitleMedium">{count}</span>
      <span className="typoBodySmall">{label}</span>
    </button>
  );
}

export default StatusCard;
