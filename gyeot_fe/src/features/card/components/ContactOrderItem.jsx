import { Reorder, useDragControls } from "motion/react";
import styles from "@/features/card/components/ContactOrderItem.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import iconDrag from "@/shared/assets/icons/iconDrag.svg";
import {
  CONTACT_ORDER_RANK_SUFFIX,
  CONTACT_RELATIONSHIP_LABELS,
  CONTACT_RELATIONSHIP_TYPE,
} from "@/features/card/constants/cardConstants";

// 연락 순서 카드 1개 (아바타 / 이름 / 관계 / 순위 뱃지 / 드래그 핸들)
// - contact: 비상연락망 조회 API의 items 원소 1개
// - rank: 화면에 표시할 전체 순위 (목록에서 계산해서 전달)
// - isSubVisible: 이름 아래 관계 문구 노출 여부 (보호자가 있을 때만 표시)
// - isDragDisabled: true면 핸들을 눌러도 드래그가 시작되지 않음 (저장 중)
// - onDragEnd: 드래그를 놓았을 때 실행 (순서 저장)
function ContactOrderItem({
  contact,
  rank,
  isSubVisible = false,
  isDragDisabled = false,
  onDragEnd,
}) {
  // 카드 전체가 아니라 핸들을 눌렀을 때만 드래그가 시작되도록 직접 제어
  const dragControls = useDragControls();

  const isGuardian = contact.relationshipType === CONTACT_RELATIONSHIP_TYPE.GUARDIAN;

  // 이름 칸: 사용자가 지정한 표시명 우선, 없으면 가입 시 등록한 이름
  const displayName = contact.personalLabel || contact.name;

  // 아바타: 가입 시 등록한 이름의 첫 글자 (예: 표시명 "민재의 친구", 이름 "하준" → "하")
  const avatarText = contact.name?.[0] ?? "";

  const handleDragHandlePointerDown = (event) => {
    if (isDragDisabled) return;
    dragControls.start(event);
  };

  return (
    <Reorder.Item
      as="li"
      value={contact}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      className={`${styles.contactOrderItem} ${isGuardian ? styles.guardian : styles.myPerson}`}
    >
      <span className={`${styles.avatar} typoBodyStrong`} aria-hidden="true">
        {avatarText}
      </span>

      <div className={styles.textArea}>
        <p className={`${styles.name} typoBodyStrong`}>{displayName}</p>
        {isSubVisible && (
          <p className={`${styles.sub} typoBodySmall`}>
            {CONTACT_RELATIONSHIP_LABELS[contact.relationshipType]}
          </p>
        )}
      </div>

      <span className={`${styles.rankBadge} typoCaptionMedium`}>
        {rank}
        {CONTACT_ORDER_RANK_SUFFIX}
      </span>

      <button
        type="button"
        className={styles.dragHandle}
        onPointerDown={handleDragHandlePointerDown}
        aria-disabled={isDragDisabled}
        aria-label={`${displayName} 연락 순서 바꾸기`}
      >
        <MaskIcon src={iconDrag} size={20} />
      </button>
    </Reorder.Item>
  );
}

export default ContactOrderItem;
