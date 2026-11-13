import styles from "@/features/card/components/CardTextField.module.css";

/**
 * [C-02] 텍스트 입력 영역 (라벨 + 입력란)
 * - InputSection(request)은 placeholder가 "입력"으로 고정이라 card 전용으로 별도 제작
 * - 스타일은 BirthDateField와 동일
 * @param {string}   id           입력란 id (라벨 연결용, 화면 안에서 고유해야 함)
 * @param {string}   label        라벨 문구 (예: "질환")
 * @param {string}   placeholder  입력란 안내 문구 (예: "질환명")
 * @param {string}   value        입력값
 * @param {Function} onChange     입력값을 전달하는 콜백 (value) => void
 */
function CardTextField({ id, label, placeholder, value, onChange }) {
  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <section className={styles.cardTextField}>
      <label htmlFor={id} className={`${styles.fieldTitle} typoBodyStrong`}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={`${styles.fieldInput} typoBodyMedium`}
        placeholder={placeholder}
        value={value}
        onChange={handleTextChange}
      />
    </section>
  );
}

export default CardTextField;
