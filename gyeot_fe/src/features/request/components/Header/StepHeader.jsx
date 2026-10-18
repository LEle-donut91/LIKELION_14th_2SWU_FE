import styles from "@/features/request/components/Header/StepHeader.module.css";
import backBtn from "@/features/request/assets/backBtn.svg";

function StepHeader({ title, step, onClick }) {
  return (
    <header className={styles.stepHeader}>
      <button className={styles.backBtn} onClick={onClick}>
        <img className={styles.backBtnImg} src={backBtn} />
      </button>
      <div className={`${styles.title} typoDisplaySmall`}>{title}</div>
      <div className={`${styles.step} typoBodyMedium`}>{step} / 2</div>
    </header>
  );
}

export default StepHeader;
