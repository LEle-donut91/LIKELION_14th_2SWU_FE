import styles from "@/features/home/components/StatusCardList.module.css";
import StatusCard from "@/features/home/components/StatusCard";
import { STATUS_CARD_LIST } from "@/features/home/constants/homeConstants";

// 상단 상태 카드 4개 (응답요청 · 담당없음 · 예정일정 · 공유중)
// onCardClick(path, key): 클릭한 카드의 이동 경로와 키 전달
function StatusCardList({ summary, onCardClick }) {
  return (
    <div className={styles.statusCardList}>
      {STATUS_CARD_LIST.map(({ key, label, isUrgent, path }) => {
        const count = summary?.[key] ?? 0;

        return (
          <StatusCard
            key={key}
            label={label}
            count={count}
            isActive={isUrgent && count > 0}
            onClick={() => onCardClick?.(path, key)}
          />
        );
      })}
    </div>
  );
}

export default StatusCardList;
