import styles from "@/shared/components/Button/Button.module.css";

/**
 * 공용 전체 너비 버튼 (디자인 시스템 버튼 컴포넌트 기준)
 * - home의 ActionButton과 props가 같아 import만 바꾸면 교체 가능
 *   (children / variant / isDisabled / onClick 동일, size는 생략 시 기존과 같은 large)
 *
 * @param {ReactNode} children    버튼 문구
 * @param {string}    variant     "primary"(olive-500) | "secondary"(olive-200) | "tertiary"(흰 배경 + olive-200 테두리)
 * @param {string}    size        "large"(굵은 글씨, 기본값) | "small"(보통 글씨, 낮은 높이)
 * @param {boolean}   isDisabled  비활성 여부 (true면 variant와 관계없이 회색 버튼)
 * @param {Function}  onClick     클릭 시 동작
 * @param {string}    type        button 태그의 type (기본값: "button")
 * @param {string}    className   바깥에서 위치·여백을 조정할 때 추가하는 클래스
 */
function Button({
  children,
  variant = "primary",
  size = "large",
  isDisabled = false,
  onClick,
  type = "button",
  className = "",
}) {
  // 크기별 글꼴: large는 typoBodyStrong(굵게), small은 typoBodyMedium(보통)
  const typoClassName = size === "small" ? "typoBodyMedium" : "typoBodyStrong";

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${typoClassName} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
