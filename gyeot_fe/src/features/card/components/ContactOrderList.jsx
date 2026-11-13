import { Reorder } from "motion/react";
import styles from "@/features/card/components/ContactOrderList.module.css";
import ContactOrderItem from "@/features/card/components/ContactOrderItem";

// 드래그로 순서를 바꿀 수 있는 연락 순서 목록 (섹션 하나 단위)
// - 보호자 / 나의 사람 목록을 각각 따로 그려서, 섹션을 넘어가는 이동은 일어나지 않음
// - contacts: 현재 순서대로 정렬된 연락 대상 목록
// - startRank: 첫 번째 카드의 순위 (나의 사람 목록은 보호자 수 + 1부터 시작)
// - isDragDisabled: true면 드래그를 시작할 수 없음 (저장 중)
// - onReorder: 드래그 중 순서가 바뀔 때마다 새 배열을 전달
// - onReorderEnd: 드래그를 놓았을 때 실행 (순서 저장)
// - emptyContent: 목록이 비었을 때 대신 보여줄 요소 (없으면 아무것도 그리지 않음)
function ContactOrderList({
  contacts,
  startRank = 1,
  isSubVisible = false,
  isDragDisabled = false,
  onReorder,
  onReorderEnd,
  emptyContent = null,
}) {
  if (contacts.length === 0) {
    return emptyContent;
  }

  return (
    <Reorder.Group
      as="ul"
      axis="y"
      values={contacts}
      onReorder={onReorder}
      className={styles.contactOrderList}
    >
      {contacts.map((contact, index) => (
        <ContactOrderItem
          key={contact.userId}
          contact={contact}
          rank={startRank + index}
          isSubVisible={isSubVisible}
          isDragDisabled={isDragDisabled}
          onDragEnd={onReorderEnd}
        />
      ))}
    </Reorder.Group>
  );
}

export default ContactOrderList;
