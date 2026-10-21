import styles from "@/features/request/components/Section/SelectSection.module.css";
import iconDown from "@/shared/assets/icons/iconDown.svg";

function SelectSection({ title, text, border, width, onClick }) {
  return (
    <section className={styles.selectSection}>
      {/* section 타이틀 */}
      <span className={`${styles.sectionTitle} typoBodyStrong`}>{title}</span>

      {/* 버튼 (선택 시트 표시) */}
      <button
        onClick={onClick}
        className={`${styles.sectionBtn} ${styles[border]} ${styles[width]}`}
      >
        <span className="typoBodyMedium">{text}</span>
        <img src={iconDown} />
      </button>
    </section>
  );
}

export default SelectSection;
