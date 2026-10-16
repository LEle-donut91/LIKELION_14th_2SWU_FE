import styles from "@/features/request/components/Header/StepHeader.module.css";
import backBtn from "@/features/request/assets/backBtn.svg";
import { useNavigate } from 'react-router-dom';

function StepHeader({title, step}) {
  const navigate = useNavigate();
  return (
    <header>
      <button onClick={() => navigate(-1)}>
        <img className={styles.backBtn} src={backBtn} />
      </button>
      <div className={`${styles.title} typoDisplaySmall`}>{title}</div>
      <div className={`${styles.step} typoBodyMedium`}>{step} / 2</div>
    </header>
  );
}

export default StepHeader;
