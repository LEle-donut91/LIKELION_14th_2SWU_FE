import styles from "@/features/request/components/Footer/LargeFooter.module.css";
import { useNavigate } from "react-router-dom";

function LargeFooter({ title, type, onClick }) {
  const navigate = useNavigate();

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
