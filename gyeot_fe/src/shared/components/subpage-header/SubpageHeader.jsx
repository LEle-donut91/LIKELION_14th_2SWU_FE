import { useNavigate } from "react-router-dom";
import styles from "@/shared/components/subpage-header/SubpageHeader.module.css";

/**
 * 서브페이지 공통 헤더
 * @param {string}   title           중앙 페이지 타이틀 (필수)
 * @param {boolean}  hasBackButton   왼쪽 '뒤로' 버튼 노출 여부 (기본값: true)
 * @param {boolean}  hasCloseButton  오른쪽 '닫기' 버튼 노출 여부 (기본값: false)
 * @param {boolean}  hasMoreButton   오른쪽 '...' 버튼 노출 여부 (기본값: false)
 * @param {string}   morePath        '...' 클릭 시 이동할 연관 서브페이지 경로
 * @param {Function} onBackClick     '뒤로' 클릭 시 동작 (미전달 시 이전 페이지로 이동)
 * @param {Function} onCloseClick    '닫기' 클릭 시 동작 (미전달 시 이전 페이지로 이동)
 * @param {Function} onMoreClick     '...' 클릭 시 동작 (미전달 시 morePath로 이동)
 */
function SubpageHeader({
  title,
  hasBackButton = true,
  hasCloseButton = false,
  hasMoreButton = false,
  morePath,
  onBackClick,
  onCloseClick,
  onMoreClick,
}) {
  const navigate = useNavigate();

  // '뒤로' 버튼: 별도 동작이 전달되지 않으면 브라우저 히스토리 기준 이전 페이지로 이동
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    navigate(-1);
  };

  // '닫기' 버튼: 별도 동작이 전달되지 않으면 서브페이지를 닫고 이전 페이지로 이동
  const handleCloseClick = () => {
    if (onCloseClick) {
      onCloseClick();
      return;
    }
    navigate(-1);
  };

  // '...' 버튼: 별도 동작이 전달되지 않으면 연관 서브페이지(morePath)로 이동
  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick();
      return;
    }
    if (morePath) {
      navigate(morePath);
    }
  };

  return (
    <header className={styles.header}>
      {/* 왼쪽 영역 */}
      <div className={styles.leftArea}>
        {hasBackButton && (
          <button
            type="button"
            className={styles.headerBtn}
            onClick={handleBackClick}
            aria-label="뒤로 가기"
          >
            뒤로
          </button>
        )}
      </div>

      {/* 중앙 타이틀 */}
      <h1 className={`typoBodyStrong ${styles.title}`}>{title}</h1>

      {/* 오른쪽 영역 */}
      <div className={styles.rightArea}>
        {hasCloseButton && (
          <button
            type="button"
            className={styles.headerBtn}
            onClick={handleCloseClick}
            aria-label="닫기"
          >
            닫기
          </button>
        )}
        {hasMoreButton && (
          <button
            type="button"
            className={styles.headerBtn}
            onClick={handleMoreClick}
            aria-label="더보기"
          >
            ...
          </button>
        )}
      </div>
    </header>
  );
}

export default SubpageHeader;