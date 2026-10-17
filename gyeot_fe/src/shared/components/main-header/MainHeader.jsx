import styles from "@/shared/components/main-header/MainHeader.module.css";

/**
 * 메인 페이지 공통 헤더 (헤더 1)
 * - 사용 화면: H-00(홈), R-00, R-03, N-03, C-00, S-00
 * - 알림 / 설정 버튼은 H-00에만 있으므로 노출 여부를 props로 받음
 *
 * @param {string}   title             왼쪽 페이지 타이틀 (필수)
 * @param {boolean}  hasAlarmButton    오른쪽 '알림' 버튼 노출 여부 (기본값: false)
 * @param {boolean}  hasSettingButton  오른쪽 '설정' 버튼 노출 여부 (기본값: false)
 * @param {Function} onAlarmClick      '알림' 클릭 시 동작
 * @param {Function} onSettingClick    '설정' 클릭 시 동작
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
      {/* 왼쪽 타이틀 */}
      <h1 className={styles.title}>{title}</h1>

      {/* 오른쪽 버튼 영역 (버튼이 하나라도 있을 때만 노출) */}
      {hasRightButton && (
        <div className={styles.rightArea}>
          {hasAlarmButton && (
            <button
              type="button"
              className={styles.headerBtn}
              onClick={onAlarmClick}
              aria-label="알림"
            >
              알림
            </button>
          )}
          {hasSettingButton && (
            <button
              type="button"
              className={styles.headerBtn}
              onClick={onSettingClick}
              aria-label="설정"
            >
              설정
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default MainHeader;
