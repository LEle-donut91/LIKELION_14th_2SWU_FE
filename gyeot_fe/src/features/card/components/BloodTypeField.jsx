import styles from "@/features/card/components/BloodTypeField.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import iconRadioOn from "@/shared/assets/icons/iconRadioOn.svg";
import iconRadioOff from "@/shared/assets/icons/iconRadioOff.svg";
import {
  BLOOD_TYPE_LABELS,
  BLOOD_TYPE_OPTIONS,
} from "@/features/card/constants/cardConstants";

/**
 * [C-01] 혈액형 선택 영역 (라벨 + 라디오 카드 목록)
 * @param {string}   title     라벨 문구 (예: "혈액형")
 * @param {string}   value     선택된 혈액형 값 (BLOOD_TYPE_OPTIONS 중 하나) / 미선택이면 ""
 * @param {Function} onChange  선택한 값을 전달하는 콜백 (value) => void
 */
function BloodTypeField({ title, value, onChange }) {
  return (
    <section className={styles.bloodTypeField}>
      <span className={`${styles.fieldTitle} typoBodyStrong`}>{title}</span>

      <div className={styles.optionList} role="radiogroup" aria-label={title}>
        {BLOOD_TYPE_OPTIONS.map((option) => {
          // 사용자가 선택한 항목과 현재 그리는 항목이 같으면 true
          const isSelected = value === option;

          return (
            <label key={option} className={styles.optionItem}>
              <input
                type="radio"
                name="bloodType"
                className={styles.optionInput}
                value={option}
                checked={isSelected}
                onChange={() => onChange(option)}
              />
              <span
                className={`${isSelected ? styles.selectedTxt : styles.optionTxt} typoBodyStrong`}
              >
                {BLOOD_TYPE_LABELS[option]}
              </span>
              <MaskIcon
                src={isSelected ? iconRadioOn : iconRadioOff}
                size={28}
                className={isSelected ? styles.radioOnIcon : styles.radioOffIcon}
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}

export default BloodTypeField;
