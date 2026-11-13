import styles from "@/features/card/components/CardAddButton.module.css";
import { CARD_ADD_BTN_TEXT } from "@/features/card/constants/cardConstants";

/**
 * 안심카드 공통 '추가하기' 텍스트 버튼 (C-02 건강 정보, C-03 연락 순서 등)
 * - 부모가 flex column일 때 가운데 정렬됨
 * @param {Function} onClick  클릭 시 동작
 * @param {string}   label    버튼 문구 (기본값: "추가하기")
 */
function CardAddButton({ onClick, label = CARD_ADD_BTN_TEXT }) {
  return (
    <button type="button" className={styles.cardAddButton} onClick={onClick}>
      <span className="typoBodySmall">{label}</span>
    </button>
  );
}

export default CardAddButton;
