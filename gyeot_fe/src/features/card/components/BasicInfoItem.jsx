import styles from "@/features/card/components/BasicInfoItem.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import iconPencil from "@/shared/assets/icons/iconPencil.svg";
import {
  BASIC_INFO_EDIT_BTN_TEXT,
  SENSITIVE_TAG_TEXT,
} from "@/features/card/constants/cardConstants";

/**
 * [C-01 · C-02 · C-04] 정보 목록 카드 1개 (제목 / 민감 태그 / 갱신일 뱃지 / 값 / 수정하기 버튼)
 * @param {string}   title           카드 제목 (예: "생년월일", "고혈압")
 * @param {boolean}  isSensitive     제목 옆 '민감' 태그 노출 여부 (기본값: false)
 * @param {string}   description     값 표시 문구 (C-01: 값이 없으면 BASIC_INFO_EMPTY_TEXT)
 * @param {boolean}  isSingleLine    값을 한 줄로 표시하고 넘치면 말줄임(...) 처리 (기본값: false / C-04 집 주소)
 * @param {string}   updatedDateText 갱신일 뱃지 문구 (예: "9/20") / 빈 값이면 뱃지 숨김
 * @param {Function} onEditClick     '수정하기' 클릭 시 동작
 */
function BasicInfoItem({
  title,
  isSensitive = false,
  description,
  isSingleLine = false,
  updatedDateText,
  onEditClick,
}) {
  return (
    <li className={styles.basicInfoItem}>
      {/* 제목 + 민감 태그 / 갱신일 뱃지 */}
      <div className={styles.titleRow}>
        <div className={styles.titleGroup}>
          <p className={`${styles.title} typoBodyStrong`}>{title}</p>
          {isSensitive && (
            <span className={`${styles.sensitiveTag} typoCaptionMedium`}>
              {SENSITIVE_TAG_TEXT}
            </span>
          )}
        </div>
        {updatedDateText && (
          <span className={`${styles.dateBadge} typoCaptionMedium`}>
            {updatedDateText}
          </span>
        )}
      </div>

      {/* 값 (값이 없으면 안내 문구 / isSingleLine이면 한 줄 말줄임) */}
      <p
        className={`${styles.description} ${isSingleLine ? styles.singleLine : ""} typoBodySmall`}
      >
        {description}
      </p>

      {/* 수정하기 버튼 */}
      <button type="button" className={styles.editBtn} onClick={onEditClick}>
        <span className="typoCaptionMedium">{BASIC_INFO_EDIT_BTN_TEXT}</span>
        <MaskIcon src={iconPencil} size={16} className={styles.editIcon} />
      </button>
    </li>
  );
}

export default BasicInfoItem;
