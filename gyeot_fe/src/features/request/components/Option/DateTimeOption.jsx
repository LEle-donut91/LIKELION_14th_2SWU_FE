import styles from "@/features/request/components/Option/DateTimeOption.module.css";
import { OPTION_CONFIGS } from "@/features/request/constants/requestConstants";

/**
 * sections: [{ type: "date" | "time" | "dueDate", title: "날짜" }, ...]
 * 배열 순서대로 입력 그룹을 렌더링하고, 모든 그룹은 하나의 value 객체를 공유
 */
function DateTimeOption({ sections = [], value, onChange }) {
  const current = value ?? {};

  const handleChange = (key, e) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능하도록 처리
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
            {(OPTION_CONFIGS[type] || []).map((field) => (
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
