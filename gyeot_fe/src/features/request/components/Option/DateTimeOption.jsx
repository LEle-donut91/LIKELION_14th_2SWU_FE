import styles from "@/features/request/components/Option/DateTimeOption.module.css";
import { DATE_TIME_OPTION_CONFIGS } from "@/features/request/constants/requestConstants";
import { getValidatedNumericValue } from "@/features/request/utils/requestUtils";

/**
 * sections: [{ type: "date" | "time" | "dueDate", title: "날짜" }, ...]
 * 배열 순서대로 입력 그룹을 렌더링하고, 모든 그룹은 하나의 value 객체를 공유
 */
function DateTimeOption({ sections = [], value, onChange }) {
  const current = value ?? {};

  const handleChange = (key, e) => {
    // 입력된 시간/날짜값 검증 및 보정
    const val = getValidatedNumericValue(key, e.target.value);
    onChange?.({ ...current, [key]: val });
  };

  return (
    <div className={styles.optionList}>
      {sections.map(({ type, title }) => (
        <div key={type} className={styles.dateTimeOption}>
          {title && (
            <span className={`${styles.dateTimeTitle} typoBodyStrong`}>
              {title}
            </span>
          )}

          <div className={styles.dateTimeGroup}>
            {(DATE_TIME_OPTION_CONFIGS[type] || []).map((field) => (
              <div key={field.key} className={styles.dateTimeContainer}>
                <input
                  type="text"
                  className={`${styles[field.className]} ${styles.baseInput} typoBodyMedium`}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  value={current[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e)}
                />
                <span className={`${styles.dateTimeLabel} typoBodyStrong`}>
                  {field.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DateTimeOption;
