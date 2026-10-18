import styles from "@/features/home/components/HelpFloatingButton.module.css";
import MaskIcon from "@/features/home/components/MaskIcon";
import iconPlus from "@/shared/assets/icons/IconPlus.svg";

// 도움 요청 플로팅 버튼
function HelpFloatingButton({ onClick }) {
  return (
    <button
      type="button"
      className={`${styles.helpFloatingBtn} typoCaptionMedium`}
      onClick={onClick}
    >
      <MaskIcon src={iconPlus} size={24} />
      도움
    </button>
  );
}

export default HelpFloatingButton;
