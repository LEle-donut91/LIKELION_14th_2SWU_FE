import styles from "@/features/request/components/Header/DefaultHeader.module.css";
import iconLeft from "@/shared/assets/icons/iconLeft.svg";

function DefaultHeader({ title, subBtnTitle, onClick, onSubBtnClick }) {
  return (
    <header className={styles.defaultHeader}>
      <button className={styles.backBtn} onClick={onClick}>
        <img className={styles.backBtnImg} src={iconLeft} />
      </button>
      <div className={`${styles.title} typoDisplaySmall`}>{title}</div>
      <button className={`${styles.subBtn} typoBodyMedium`} onClick={onSubBtnClick}>
        {subBtnTitle ? subBtnTitle : ""}
      </button>
    </header>
  );
}

export default DefaultHeader;
