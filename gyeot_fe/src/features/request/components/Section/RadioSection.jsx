import styles from "@/features/request/components/Section/RadioSection.module.css";
import { HELP_TYPE_OPTIONS, HELP_TYPE_LABELS } from "@/features/request/constants/requestConstants";

function RadioSection({ value, onChange }) {

  return (
    <section>
      {/* section 타이틀 */}
      <span className={`${styles.sectionTitle} typoBodyStrong`}>도움 종류</span>

      {/* 라디오 버튼 container */}
      <div className={styles.radioContainer}>
        {/* 도움 종류 라디오 버튼 */}
        {HELP_TYPE_OPTIONS.map((item) => {
          // 사용자가 선택한 항목과 현재 그리는 항목 (item)이 같으면 true, 다르면 false
          const isSelected = value === item;

          return (
            <button
              key={item}
              className={`${styles.radioBtn} ${isSelected ? styles.radioSelected : ""}`} // 선택된 항목과 선택되지 않은 항목 -> 다른 스타일 적용
              onClick={() => onChange?.(item)} // 클릭 시, 선택된 항목 State로 추가
              role="radio"
              aria-checked={isSelected}
            >
              <span className={`${styles.radioTxt} typoBodySmall`}>{HELP_TYPE_LABELS[item]} </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default RadioSection;
