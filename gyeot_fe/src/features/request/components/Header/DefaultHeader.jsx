import styles from "@/features/request/components/Header/DefaultHeader.module.css";
import backBtn from "@/features/request/assets/backBtn.svg";

function DefaultHeader({ title, subBtnTitle, onClick }) {
  return (
    <header className={styles.defaultHeader}>
      <button className={styles.backBtn} onClick={onClick}>
        <img className={styles.backBtnImg} src={backBtn} />
      </button>
      <div className={`${styles.title} typoDisplaySmall`}>{title}</div>
      <button className={`${styles.subBtn} typoBodyMedium`}>{subBtnTitle ? subBtnTitle : ""}</button>
    </header>
  );
}

export default DefaultHeader;
