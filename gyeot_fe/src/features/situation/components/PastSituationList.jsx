import styles from "@/features/situation/components/PastSituationList.module.css";
import PastSituationItem from "@/features/situation/components/PastSituationItem";

// 지난 상황 목록 카드 (목록 + "지난 기록은 여기까지에요")
function PastSituationList({ situations, onItemClick }) {
  return (
    <div className={styles.pastList}>
      {situations.length > 0 && (
        <ul className={styles.itemList}>
          {situations.map((situation) => (
            <PastSituationItem
              key={situation.id}
              situation={situation}
              onClick={() => onItemClick?.(situation.id)}
            />
          ))}
        </ul>
      )}
      <p className={`${styles.endText} typoDisplaySmall`}>
        {situations.length > 0
          ? "지난 기록은 여기까지에요"
          : "지난 기록이 없어요"}
      </p>
    </div>
  );
}

export default PastSituationList;
