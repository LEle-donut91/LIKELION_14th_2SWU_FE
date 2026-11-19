import styles from "@/features/home/components/ActionButton.module.css";

// 전체 너비 버튼
// variant: "primary"(olive-500) | "secondary"(olive-200)
function ActionButton({
  children,
  variant = "primary",
  isDisabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`${styles.actionBtn} ${styles[variant]} typoBodyStrong`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default ActionButton;
