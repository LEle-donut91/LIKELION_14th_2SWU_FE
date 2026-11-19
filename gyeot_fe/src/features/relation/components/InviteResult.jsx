import { useNavigate } from "react-router-dom";
import iconMailOff from "@/shared/assets/icons/iconMailOff.svg";
import iconClock from "@/shared/assets/icons/iconClock.svg";
import iconCheckCircle from "@/shared/assets/icons/iconCheckCircle.svg";
import iconCloseCircle from "@/shared/assets/icons/iconCloseCircle.svg";
import { RECEIVED_INVITE_RESULT } from "@/features/relation/constants/relation";
import styles from "./InviteResult.module.css";

// 상태별 아이콘
const RESULT_ICONS = {
  CANCELED: iconMailOff,
  EXPIRED: iconClock,
  ACCEPTED: iconCheckCircle,
  REJECTED: iconCloseCircle,
};

/**
 * 받은 초대가 대기 상태가 아닐 때 보여주는 결과 화면
 * @param {string} status  CANCELED / EXPIRED / ACCEPTED / REJECTED
 */
function InviteResult({ status }) {
  const navigate = useNavigate();
  const result = RECEIVED_INVITE_RESULT[status]; // 상태별 문구
  const tone = styles[status.toLowerCase()]; // 상태별 색 (canceled, expired 등)

  return (
    <div className={`${styles.wrap} ${tone}`}>
      {/* 큰 원 + 가운데 아이콘 */}
      <div className={styles.circle}>
        <span className={styles.iconBox}>
          <img src={RESULT_ICONS[status]} alt="" width={20} height={20} />
        </span>
      </div>

      {/* 안내 카드 */}
      <div className={styles.card}>
        <span className={styles.badge}>{result.badge}</span>
        <h2 className={styles.title}>{result.title}</h2>
        <p className={styles.description}>{result.description}</p>
      </div>

      {/* 홈으로 */}
      <button type="button" className={styles.homeBtn} onClick={() => navigate("/home")}>
        홈으로
      </button>
    </div>
  );
}

export default InviteResult;