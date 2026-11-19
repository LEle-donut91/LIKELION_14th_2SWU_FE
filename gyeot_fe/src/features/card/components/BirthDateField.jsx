import styles from "@/features/card/components/BirthDateField.module.css";
import {
  BIRTH_DATE_INPUT_LENGTH,
  BIRTH_DATE_PLACEHOLDER,
} from "@/features/card/constants/cardConstants";
import { sanitizeBirthDateInput } from "@/features/card/utils/cardFormat";

/**
 * [C-01] 생년월일 입력 영역 (라벨 + 입력란)
 * - InputSection(request)은 placeholder가 고정이라 card 전용으로 별도 제작
 * - 숫자만 최대 8자리까지 입력됨 (형식/날짜 검증은 [수정] 클릭 시 페이지에서 처리)
 * @param {string}   title     라벨 문구 (예: "생년월일")
 * @param {string}   value     입력값 ("YYYYMMDD" 형태, 입력 중에는 8자리 미만일 수 있음)
 * @param {Function} onChange  정리된 입력값을 전달하는 콜백 (value) => void
 */
function BirthDateField({ title, value, onChange }) {
  const handleBirthDateChange = (e) => {
    onChange(sanitizeBirthDateInput(e.target.value));
  };

  return (
    <section className={styles.birthDateField}>
      <label
        htmlFor="birthDateInput"
        className={`${styles.fieldTitle} typoBodyStrong`}
      >
        {title}
      </label>
      <input
        id="birthDateInput"
        type="text"
        inputMode="numeric"
        maxLength={BIRTH_DATE_INPUT_LENGTH}
        className={`${styles.fieldInput} typoBodyMedium`}
        placeholder={BIRTH_DATE_PLACEHOLDER}
        value={value}
        onChange={handleBirthDateChange}
      />
    </section>
  );
}

export default BirthDateField;
