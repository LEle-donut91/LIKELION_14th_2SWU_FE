import styles from "@/features/request/components/Section/SelectSection.module.css";
import iconDown from "@/shared/assets/icons/iconDown.svg";

function SelectSection({ title, text, width, onClick }) {
  // 텍스트가 존재하고 "한 명 선택/선택"이 아닐 때만 active 스타일 적용
  const isSelected =
    text && text !== "선택" && text !== "한 명 선택" && text.trim() !== "";
  const borderStyle = isSelected ? styles.borderActive : styles.borderDefault;
  const txtStyle = isSelected ? styles.txtActive : styles.txtDefault;

  return (
    <section className={styles.selectSection}>
      {/* section 타이틀 */}
      <span className={`${styles.sectionTitle} typoBodyStrong`}>{title}</span>

      {/* 버튼 (선택 시트 표시) */}
      <button
        onClick={onClick}
        className={`${styles.sectionBtn} ${borderStyle} ${styles[width]}`}
      >
        <span className={`${txtStyle} typoBodyMedium`}>{text}</span>
        <img src={iconDown} />
      </button>
    </section>
  );
}

export default SelectSection;
