import styles from "@/features/request/components/Header/StepHeader.module.css";
import iconLeft from "@/shared/assets/icons/iconLeft.svg";

function StepHeader({ title, step, onClick }) {
  return (
    <header className={styles.stepHeader}>
      <button className={styles.backBtn} onClick={onClick}>
        <img className={styles.backBtnImg} src={iconLeft} />
      </button>
      <div className={`${styles.title} typoDisplaySmall`}>{title}</div>
      <div className={`${styles.step} typoBodyMedium`}>{step} / 2</div>
    </header>
  );
}

export default StepHeader;
