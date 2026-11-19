import styles from "@/shared/components/main-header/MainHeader.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import iconNotification from "@/shared/assets/icons/iconNotification.svg";
import iconProfile from "@/shared/assets/icons/iconProfile.svg";

/**
 * 메인 페이지 공통 헤더 (헤더 1)
 * - 사용 화면: H-00(홈), R-00, R-03, N-03, C-00, S-00
 * - 왼쪽 타이틀(명조 Bold 24) + 오른쪽 알림 · 프로필(설정) 아이콘
 * - 타이틀에 줄바꿈(\n)을 넣으면 두 줄로 표시 (예: 홈 "나의 곁과\n함께 하고 있어요.")
 *
 * @param {string}   title             왼쪽 페이지 타이틀 (필수)
 * @param {boolean}  hasAlarmButton    오른쪽 '알림' 아이콘 노출 여부 (기본값: false)
 * @param {boolean}  hasSettingButton  오른쪽 '프로필(설정)' 아이콘 노출 여부 (기본값: false)
 * @param {Function} onAlarmClick      '알림' 클릭 시 동작
 * @param {Function} onSettingClick    '프로필(설정)' 클릭 시 동작
 */
function MainHeader({
  title,
  hasAlarmButton = false,
  hasSettingButton = false,
  onAlarmClick,
  onSettingClick,
}) {
  const hasRightButton = hasAlarmButton || hasSettingButton;

  return (
    <header className={styles.header}>
      {/* 왼쪽 타이틀 (폰트: index.css의 typoDisplayMedium 사용) */}
      <h1 className={`typoDisplayMedium ${styles.title}`}>{title}</h1>

      {/* 오른쪽 아이콘 영역 (버튼이 하나라도 있을 때만 노출) */}
      {hasRightButton && (
        <div className={styles.rightArea}>
          {hasAlarmButton && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onAlarmClick}
              aria-label="알림"
            >
              <MaskIcon src={iconNotification} size={28} />
            </button>
          )}
          {hasSettingButton && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onSettingClick}
              aria-label="설정"
            >
              <MaskIcon src={iconProfile} size={28} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default MainHeader;
