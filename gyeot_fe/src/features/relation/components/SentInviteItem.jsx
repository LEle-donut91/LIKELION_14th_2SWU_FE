import PersonItem from "@/features/relation/components/PersonItem";
import { INVITE_STATUS } from "@/features/relation/constants/relation";
import styles from "./SentInviteItem.module.css";

// 보낸 초대 한 줄 (대기 상태일 때만 취소/다시 초대 버튼 노출)
export default function SentInviteItem({ invite, onCancel, onResend }) {
  const status = INVITE_STATUS[invite.status]; // 상태 라벨·타입 조회
  const isPending = invite.status === "PENDING";

  return (
    <div className={styles.wrap}>
      <PersonItem
        name={invite.name}
        color="olive" // 보낸 초대 아바타 올리브
        sub={isPending ? `${invite.remainDays}일 유효` : undefined}
        badge={<span className={`${styles.badge} ${styles[status.type]}`}>{status.label}</span>}
      />

      {isPending && (
        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.cancel}`} onClick={() => onCancel(invite.id)}>
            취소
          </button>
          <button type="button" className={styles.btn} onClick={() => onResend(invite.id)}>
            다시 초대
          </button>
        </div>
      )}
    </div>
  );
}