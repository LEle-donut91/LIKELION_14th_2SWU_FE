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

function DateTimeOption({ type, title, value = {}, onChange }) {
  const fields = OPTION_CONFIGS[type] || [];

  const handleChange = (key, e) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능하도록 처리
    if (onChange) {
      onChange({
        ...value,
        [key]: val,
      });
    }
  };

  return (
    <div className={styles.dateTimeOption}>
      {title && (
        <span className={`${styles.dateTimeTitle} typoBodyStrong`}>{title}</span>
      )}

      <div className={styles.dateTimeGroup}>
        {fields.map((field, index) => (
          <div key={index} className={styles.dateTimeContainer}>
            <input
              type="text"
              className={`${field.className} ${styles.baseInput} typoBodyMedium`}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              value={value[field.key] || ""}
              onChange={(e) => handleChange(field.key, e)}
            />
            <span className={`${styles.dateTimeLabel} typoBodyStrong`}>
              {field.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DateTimeOption;
