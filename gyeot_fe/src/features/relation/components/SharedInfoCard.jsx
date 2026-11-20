import iconClock from "@/shared/assets/icons/iconClock.svg";
import { SHARE_STATUS } from "@/features/relation/constants/sharedInfo";
import styles from "./SharedInfoCard.module.css";

/**
 * 공유 정보 카드 한 장
 * @param {object}   info       { id, title, startAt, endAt, items, status, canReallow }
 * @param {string}   variant    "sharing" 내가 공유 중 / "received" 받은 정보
 * @param {Function} onToggle   직접 철회 / 다시 허용 버튼 클릭 시 동작 (sharing만)
 * @param {boolean}  disabled   처리 중이면 버튼 잠금
 * @param {Function} onClick    카드 선택 시 동작 (받은 정보 → 요청 상세 이동)
 */
function SharedInfoCard({ info, variant = "sharing", onToggle, disabled = false, onClick }) {
  const isReceived = variant === "received";
  const isWithdrawn = info.status === SHARE_STATUS.WITHDRAWN; // 철회됨 상태
  const showButton = !isReceived && (!isWithdrawn || info.canReallow); // 철회됨인데 다시 허용 불가면 버튼 숨김

  // 카드 색: 받은 정보 / 철회됨 / 공유 중
  const cardClass = isReceived ? styles.received : isWithdrawn ? styles.withdrawn : "";

  return (
    <div
      className={`${styles.card} ${cardClass}`}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined} // 키보드 엔터로도 선택
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={onClick ? { cursor: "pointer" } : undefined} // 누를 수 있는 카드만 손가락 커서
    >
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
        {showButton && (
          <button
            type="button"
            className={isWithdrawn ? styles.allowBtn : styles.withdrawBtn}
            onClick={() => onToggle(info)}
            disabled={disabled}
          >
            {isWithdrawn ? "다시 허용" : "직접 철회"}
          </button>
        )}
      </div>
    </div>
  );
}

export default SharedInfoCard;