import styles from "@/features/request/components/Footer/LargeFooter.module.css";

function LargeFooter({ title, type, onClick }) {

  return (
    <footer className={styles.largeFooter}>
      <button
        onClick={onClick}
        className={`${styles.footerBtn} ${styles[type]}`}
      >
        <span className={`${styles.btnTxt} typoBodyStrong`}>{title}</span>
      </button>
    </footer>
  );
}

export default LargeFooter;
