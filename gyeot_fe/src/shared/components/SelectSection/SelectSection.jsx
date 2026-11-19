import styles from "@/shared/components/SelectSection/SelectSection.module.css";
import iconDown from "@/shared/assets/icons/iconDown.svg";

// isSelected: 선택 상태를 직접 지정할 때 사용 (미전달 시 기존처럼 text로 판단)
//   예) H-04 사람 별 보기는 기본 문구가 "전체"라 text만으로는 선택 여부를 알 수 없음
function SelectSection({ title, isRequired, text, width, onClick, isSelected: isSelectedProp }) {
  // 텍스트가 존재하고 "한 명 선택/선택"이 아닐 때만 active 스타일 적용
  const isSelected =
    isSelectedProp ??
    (text && text !== "선택" && text !== "한 명 선택" && text.trim() !== "");
  const borderStyle = isSelected ? styles.borderActive : styles.borderDefault;
  const txtStyle = isSelected ? styles.txtActive : styles.txtDefault;

  return (
    <section className={styles.selectSection}>
      {/* section 타이틀 (isRequired가 true일 때만 필수 표시 "*" 추가) */}
      <span className={`${styles.sectionTitle} typoBodyStrong`}>
        {title}
        {isRequired && (
          <>
            {" "}
            <span className={styles.requiredMark}>*</span>
          </>
        )}
      </span>

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
