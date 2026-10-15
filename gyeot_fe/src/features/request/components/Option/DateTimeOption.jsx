import styles from "@/features/request/components/Option/DateTimeOption.module.css";

// type별 입력 필드 설정 데이터
const OPTION_CONFIGS = {
  date: [
    { placeholder: "0000", maxLength: 4, label: "년", className: styles.yearInput },
    { placeholder: "00", maxLength: 2, label: "월", className: styles.dateTimeInput },
    { placeholder: "00", maxLength: 2, label: "일", className: styles.dateTimeInput },
  ],
  time: [
    { placeholder: "00", maxLength: 2, label: "시", className: styles.dateTimeInput },
    { placeholder: "00", maxLength: 2, label: "분", className: styles.dateTimeInput },
  ],
  dueDate: [
    { placeholder: "00", maxLength: 2, label: "일", className: styles.dateTimeInput },
    { placeholder: "00", maxLength: 2, label: "시간", className: styles.dateTimeInput },
    { placeholder: "00", maxLength: 2, label: "분", className: styles.dateTimeInput },
  ],
};

function DateTimeOption({ type, title }) {
  const fields = OPTION_CONFIGS[type] || [];

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
            />
            <span className={`${styles.dateTimeLabel} typoBodyStrong`}>
              {field.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateTimeOption;
