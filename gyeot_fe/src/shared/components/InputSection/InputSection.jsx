import styles from "@/shared/components/InputSection/InputSection.module.css";

function InputSection({
  title,
  isRequired,
  size,
  value,
  onChange,
  onFocus,
  readOnly,
  placeholder = "입력", // 안내 문구 (shared 복사본에서 추가, 기본값은 요청 화면과 동일)
  maxLength,
}) {
  return (
    <section className={styles.inputSection}>
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
      {/* 내용 입력 칸 (size 값에 따라 input 또는 textarea 렌더링) */}
      {size === "large" ? (
        <textarea
          className={`${styles.sectionTextarea} typoBodyMedium ${value ? styles.hasValue : ""}`}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          readOnly={readOnly}
        />
      ) : (
        <input
          type="text"
          className={`${styles.sectionInput} typoBodyMedium ${value ? styles.hasValue : ""}`}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          readOnly={readOnly}
        />
      )}
    </section>
  );
}

export default InputSection;
