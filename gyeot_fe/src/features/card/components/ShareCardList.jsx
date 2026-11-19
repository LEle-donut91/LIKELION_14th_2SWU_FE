import styles from "@/features/card/components/ShareCardList.module.css";
import ShareCardItem from "@/features/card/components/ShareCardItem";

/**
 * [C-06] 공유 카드 목록 (테두리 박스 1개 안에 카드를 구분선으로 나눠 표시)
 * - R-02-01(이 사람과 공유 중인 정보)에서도 같은 목록을 쓸 수 있도록 C-06 전용 값에 의존하지 않음
 *
 * @param {Array}    items      공유 중 목록 조회 응답의 items
 * @param {number}   pendingId  철회 / 다시 허용 처리 중인 카드 ID (없으면 null)
 * @param {Function} onRevoke   [직접 철회] 클릭 시 동작 (assignmentId 전달)
 * @param {Function} onReallow  [다시 허용] 클릭 시 동작 (assignmentId 전달)
 */
function ShareCardList({ items, pendingId = null, onRevoke, onReallow }) {
  const isAnyPending = pendingId !== null;

  return (
    <ul className={styles.shareCardList}>
      {items.map((item) => (
        <ShareCardItem
          key={item.assignmentId}
          item={item}
          isPending={pendingId === item.assignmentId}
          isDisabled={isAnyPending}
          onRevoke={() => onRevoke?.(item.assignmentId)}
          onReallow={() => onReallow?.(item.assignmentId)}
        />
      ))}
    </ul>
  );
}

export default ShareCardList;
