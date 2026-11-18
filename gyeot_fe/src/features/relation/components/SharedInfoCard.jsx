import iconClock from "@/shared/assets/icons/iconClock.svg";
import { SHARE_STATUS } from "@/features/relation/constants/sharedInfo";
import styles from "./SharedInfoCard.module.css";

/**
 * 공유 정보 카드 한 장
 * @param {object}   info       { title, startAt, endAt, items, status }
 * @param {string}   variant    "sharing" 내가 공유 중 / "received" 받은 정보
 * @param {Function} onToggle   직접 철회 / 다시 허용 버튼 클릭 시 동작 (sharing만)
 */
function SharedInfoCard({ info, variant = "sharing", onToggle }) {
  const isReceived = variant === "received";
  const isWithdrawn = info.status === SHARE_STATUS.WITHDRAWN; // 철회됨 상태

  // 카드 색: 받은 정보 / 철회됨 / 공유 중
  const cardClass = isReceived ? styles.received : isWithdrawn ? styles.withdrawn : "";

  return (
    <div className={`${styles.card} ${cardClass}`}>
      {/* 제목 줄 */}
      <div className={styles.top}>
        <strong className={styles.title}>
          {info.title} · {info.startAt}
        </strong>
        {isWithdrawn && <span className={styles.withdrawnBadge}>철회됨</span>}
      </div>

      {/* 언제까지 */}
      <p className={styles.until}>
        {!isWithdrawn && <img src={iconClock} alt="" width={12} height={12} />}
        ~ {info.endAt}
        {!isReceived && !isWithdrawn && " 자동 회수"}
      </p>

      {/* 받은 정보는 구분선 없이 태그만 */}
      {!isReceived && <hr className={styles.divider} />}

      <div className={styles.bottom}>
        {/* 공유 항목 태그 */}
        <div className={styles.tags}>
          {info.items.map((item) => (
            <span key={item} className={styles.tag}>
              {item}
            </span>
          ))}
        </div>

        {/* 직접 철회 / 다시 허용 (내가 공유 중인 정보만) */}
        {!isReceived && (
          <button
            type="button"
            className={isWithdrawn ? styles.allowBtn : styles.withdrawBtn}
            onClick={() => onToggle(info.id)}
          >
            {isWithdrawn ? "다시 허용" : "직접 철회"}
          </button>
        )}
      </div>
    </div>
  );
}

export default SharedInfoCard;