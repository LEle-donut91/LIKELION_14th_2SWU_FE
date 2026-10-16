import styles from "@/features/request/components/Section/InputSection.module.css";

function InputSection({ title, size, value, onChange }) {
  return (
    <section>
      {/* section 타이틀 */}
      <span className={`${styles.sectionTitle} typoBodyStrong`}>{title}</span>

      {/* 내용 입력 칸 (size 값에 따라 input 또는 textarea 렌더링) */}
      {size === "large" ? (
        <textarea 
          className={`${styles.sectionTextarea} typoBodyMedium ${value ? styles.hasValue : ''}`}
          placeholder="입력"
          value={value}
          onChange={onChange}
        />
      ) : (
        <input 
          type="text"
          className={`${styles.sectionInput} typoBodyMedium ${value ? styles.hasValue : ''}`}
          placeholder="입력"
          value={value}
          onChange={onChange}
        />
      )}
    </section>
  );
}

export default InputSection;
