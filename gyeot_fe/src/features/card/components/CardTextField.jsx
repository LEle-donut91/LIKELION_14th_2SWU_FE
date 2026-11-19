import { useLayoutEffect, useRef } from "react";
import styles from "@/features/card/components/CardTextField.module.css";

// 여러 줄 입력란 높이 맞추기
// - 한 줄에서 시작해 줄이 늘어나면 아래로 커지고, maxRows 줄을 넘으면 그 높이에서 멈추고 스크롤
// - 줄 높이·padding은 CSS(typoBodyMedium 등)에서 읽어 오므로 글꼴 설정이 바뀌어도 그대로 동작
// - box-sizing(content-box / border-box) 어느 쪽이든 같은 높이가 되도록 계산
const resizeTextarea = (textarea, maxRows) => {
  const style = window.getComputedStyle(textarea);
  const lineHeight = parseFloat(style.lineHeight);
  const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const borderY =
    parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  const isBorderBox = style.boxSizing === "border-box";

  // 줄이 줄어든 경우도 다시 재기 위해 높이를 초기화한 뒤 내용 높이 측정
  // (scrollHeight = 내용 높이 + 위아래 padding)
  textarea.style.height = "auto";
  const contentHeight = textarea.scrollHeight - paddingY;
  const maxContentHeight = lineHeight * maxRows;
  const nextContentHeight = Math.min(contentHeight, maxContentHeight);

  textarea.style.height = `${
    isBorderBox ? nextContentHeight + paddingY + borderY : nextContentHeight
  }px`;
  textarea.style.overflowY =
    contentHeight > maxContentHeight ? "auto" : "hidden";
};

/**
 * [C-02 · C-04 · C-05] 텍스트 입력 영역 (라벨 + 입력란)
 * - InputSection(request)은 placeholder가 "입력"으로 고정이라 card 전용으로 별도 제작
 * - 스타일은 BirthDateField와 동일
 * @param {string}   id           입력란 id (라벨 연결용, 화면 안에서 고유해야 함)
 * @param {string}   label        라벨 문구 (예: "질환")
 * @param {string}   placeholder  입력란 안내 문구 (예: "질환명")
 * @param {string}   value        입력값
 * @param {Function} onChange     입력값을 전달하는 콜백 (value) => void
 * @param {boolean}  isMultiline  여러 줄 입력란(textarea)으로 그릴지 (기본값: false → 한 줄 input)
 *                                한 줄 높이에서 시작해 내용에 맞춰 커지고, maxRows 줄부터 스크롤
 * @param {number}   maxRows      여러 줄 입력란이 커질 수 있는 최대 줄 수 (기본값: 5)
 * @param {number}   maxLength    입력 가능한 최대 글자 수 (기본값: 없음)
 */
function CardTextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  isMultiline = false,
  maxRows = 5,
  maxLength,
}) {
  const textareaRef = useRef(null);

  // 입력값이 바뀔 때마다 여러 줄 입력란 높이 다시 맞추기 (화면에 그리기 전에 처리해 깜빡임 방지)
  useLayoutEffect(() => {
    if (isMultiline && textareaRef.current) {
      resizeTextarea(textareaRef.current, maxRows);
    }
  }, [value, isMultiline, maxRows]);

  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <section className={styles.cardTextField}>
      <label htmlFor={id} className={`${styles.fieldTitle} typoBodyStrong`}>
        {label}
      </label>
      {isMultiline ? (
        <textarea
          ref={textareaRef}
          id={id}
          rows={1}
          className={`${styles.fieldInput} ${styles.fieldTextarea} typoBodyMedium`}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={handleTextChange}
        />
      ) : (
        <input
          id={id}
          type="text"
          className={`${styles.fieldInput} typoBodyMedium`}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={handleTextChange}
        />
      )}
    </section>
  );
}

export default CardTextField;