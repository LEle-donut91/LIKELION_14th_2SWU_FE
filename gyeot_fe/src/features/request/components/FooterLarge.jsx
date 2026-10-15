import styles from "@/features/request/components/FooterLarge.module.css";

function FooterLarge({title, type}) {
  return (
      <footer>
        <button className={`${styles.footerBtn} ${styles[type]}`}>
          <span className={`${styles.btnTxt} typoBodyStrong`}>{title}</span>
        </button>
      </footer>
  );
}

export default FooterLarge;
