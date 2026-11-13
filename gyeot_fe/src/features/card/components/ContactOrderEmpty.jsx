import styles from "@/features/card/components/ContactOrderEmpty.module.css";
import Button from "@/shared/components/Button/Button";
import resImgLock from "@/shared/assets/images/resImgLock.png";
import { CONTACT_ORDER_EMPTY } from "@/features/card/constants/cardConstants";

/**
 * [C-03] 연락할 사람이 아무도 없을 때 빈 상태 (일러스트 / 제목 / 설명 / 버튼 2개)
 * @param {Function} onInviteClick           [나의 사람 초대하기] 클릭 시 동작
 * @param {Function} onGuardianRequestClick  [보호자 요청하기] 클릭 시 동작
 */
function ContactOrderEmpty({ onInviteClick, onGuardianRequestClick }) {
  return (
    <div className={styles.contactOrderEmpty}>
      <img className={styles.image} src={resImgLock} alt="" />

      <div className={styles.textArea}>
        {/* 제목: 명조 typoDisplaySmall에 굵기만 덮어씀 */}
        <p className={`${styles.title} typoDisplaySmall`}>
          {CONTACT_ORDER_EMPTY.title}
        </p>
        <p className={`${styles.description} typoDisplaySmall`}>
          {CONTACT_ORDER_EMPTY.descriptionLines.map((line) => (
            <span key={line} className={styles.descriptionLine}>
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className={styles.btnGroup}>
        <Button variant="primary" onClick={onInviteClick}>
          {CONTACT_ORDER_EMPTY.inviteBtnText}
        </Button>
        <Button variant="tertiary" onClick={onGuardianRequestClick}>
          {CONTACT_ORDER_EMPTY.guardianRequestBtnText}
        </Button>
      </div>
    </div>
  );
}

export default ContactOrderEmpty;
