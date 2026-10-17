import styles from "@/features/request/components/Header/DefaultHeader.module.css";
import backBtn from "@/features/request/assets/backBtn.svg";
import { useNavigate } from "react-router-dom";

function DefaultHeader({ title, subBtnTitle }) {
  const navigate = useNavigate();
  return (
    <header className={styles.defaultHeader}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <img className={styles.backBtnImg} src={backBtn} />
      </button>
      <div className={`${styles.title} typoDisplaySmall`}>{title}</div>
      <button className={`${styles.subBtn} typoBodyMedium`}>{subBtnTitle ? subBtnTitle : ""}</button>
    </header>
  );
}

export default DefaultHeader;
