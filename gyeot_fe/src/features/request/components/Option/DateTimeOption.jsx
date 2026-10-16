import styles from "@/features/request/components/Option/DateTimeOption.module.css";

// type별 입력 필드 설정 데이터
const OPTION_CONFIGS = {
  date: [
    { placeholder: "0000", maxLength: 4, label: "년", className: styles.yearInput, key: "year" },
    { placeholder: "00", maxLength: 2, label: "월", className: styles.dateTimeInput, key: "month" },
    { placeholder: "00", maxLength: 2, label: "일", className: styles.dateTimeInput, key: "day" },
  ],
  time: [
    { placeholder: "00", maxLength: 2, label: "시", className: styles.dateTimeInput, key: "hour" },
    { placeholder: "00", maxLength: 2, label: "분", className: styles.dateTimeInput, key: "minute" },
  ],
  dueDate: [
    { placeholder: "00", maxLength: 2, label: "일", className: styles.dateTimeInput, key: "days" },
    { placeholder: "00", maxLength: 2, label: "시간", className: styles.dateTimeInput, key: "hours" },
    { placeholder: "00", maxLength: 2, label: "분", className: styles.dateTimeInput, key: "minutes" },
  ],
};

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
            <span className={`${styles.dateTimeTitle} typoBodyStrong`}>{title}</span>
          )}

          <div className={styles.dateTimeGroup}>
            {(OPTION_CONFIGS[type] || []).map((field) => (
              <div key={field.key} className={styles.dateTimeContainer}>
                <input
                  type="text"
                  className={`${field.className} ${styles.baseInput} typoBodyMedium`}
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
