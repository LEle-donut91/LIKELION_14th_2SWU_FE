import styles from "@/features/situation/components/ThanksMessageCard.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import iconRight from "@/shared/assets/icons/iconRight.svg";

/**
 * N-04 감사 메시지 카드 (제목 · 안내 문구 · 오른쪽 화살표)
 * - 요청자: "감사 메시지 쓰기" / 담당자: "받은 감사 메시지"
 */
function ThanksMessageCard({ title, description, onClick }) {
  return (
    <button type="button" className={styles.thanksMessageCard} onClick={onClick}>
      <span className={styles.textContainer}>
        <span className={`${styles.title} typoBodyStrong`}>{title}</span>
        <span className={`${styles.description} typoBodySmall`}>
          {description}
        </span>
      </span>
      <MaskIcon className={styles.rightIcon} src={iconRight} size={28} />
    </button>
  );
}

export default ThanksMessageCard;
