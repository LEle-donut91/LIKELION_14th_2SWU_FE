import styles from "@/features/card/components/CardMenuItem.module.css";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import iconRight from "@/shared/assets/icons/iconRight.svg";

// 안심카드 메뉴 카드 1개 (카드 제목 / 설명 / 우측 화살표)
// - subItems: 설명 줄에 점(•)으로 구분해 표시할 텍스트 목록
//   예: ["생년월일 / 혈액형", "갱신 9/20"] → 생년월일 / 혈액형 • 갱신 9/20
//   빈 값은 DotSeparatedText에서 걸러지므로 갱신일이 없으면 점 없이 표시됨
function CardMenuItem({ title, subItems = [], onClick }) {
  return (
    <li>
      <button type="button" className={styles.cardMenuItem} onClick={onClick}>
        <div className={styles.textArea}>
          <p className={`${styles.title} typoBodyStrong`}>{title}</p>
          <DotSeparatedText
            items={subItems}
            className={`${styles.description} typoBodySmall`}
          />
        </div>
        <MaskIcon src={iconRight} size={28} className={styles.arrowIcon} />
      </button>
    </li>
  );
}

export default CardMenuItem;