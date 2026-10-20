import styles from "@/features/request/components/Header/ExitHeader.module.css";
import iconClose from "@/shared/assets/icons/iconClose.svg";

function ExitHeader({ title, onClick }) {
  return (
    <header className={styles.exitHeader}>
      <div className={`${styles.title} typoDisplaySmall`}>{title}</div>
      <button className={styles.closeBtn} onClick={onClick}>
        <img className={styles.btnImg} src={iconClose} />
      </button>
    </header>
  );
}

export default ExitHeader;
