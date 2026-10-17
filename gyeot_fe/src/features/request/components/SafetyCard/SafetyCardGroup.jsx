import styles from "@/features/request/components/SafetyCard/SafetyCardGroup.module.css";
import backBtn from "@/features/request/assets/backBtn.svg";

function SafyCardGroup({title, information, onClick}) {
  return (
    <button className={styles.cardBtn} onClick={onClick}>
      <div className={styles.txtContainer}>
        <span className={`${styles.title} typoBodyStrong`}>{title}</span>
        <span className={`${styles.information} typoBodySmall`}>{information}</span>
      </div>
      <div className={styles.imgContainer}>
        <img className={styles.arrowImg} src={backBtn} />
      </div>
    </button>
  );
}

export default SafyCardGroup;
