import styles from "@/features/request/components/InputSection.module.css";

function InputSection({ title, size }) {
  return (
    <section>
      {/* section 타이틀 */}
      <span className={`${styles.sectionTitle} typoBodyStrong`}>{title}</span>

      {/* 내용 입력 칸 (size 값에 따라 input 또는 textarea 렌더링) */}
      {size === "large" ? (
        <textarea 
          className={styles.sectionTextarea}
          placeholder="입력"
        />
      ) : (
        <input 
          type="text"
          className={styles.sectionInput}
          placeholder="입력"
        />
      )}
    </section>
  );
}

export default InputSection;
