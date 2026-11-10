import styles from "@/features/card/components/BasicInfoItem.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import iconPencil from "@/shared/assets/icons/iconPencil.svg";
import { BASIC_INFO_EDIT_BTN_TEXT } from "@/features/card/constants/cardConstants";

/**
 * [C-01] 기본 정보 목록 카드 1개 (제목 / 갱신일 뱃지 / 값 / 수정하기 버튼)
 * @param {string}   title           카드 제목 (예: "생년월일")
 * @param {string}   description     값 표시 문구 (값이 없으면 BASIC_INFO_EMPTY_TEXT)
 * @param {string}   updatedDateText 갱신일 뱃지 문구 (예: "9/20") / 빈 값이면 뱃지 숨김
 * @param {Function} onEditClick     '수정하기' 클릭 시 동작
 */
function BasicInfoItem({ title, description, updatedDateText, onEditClick }) {
  return (
    <li className={styles.basicInfoItem}>
      {/* 제목 + 갱신일 뱃지 */}
      <div className={styles.titleRow}>
        <p className={`${styles.title} typoBodyStrong`}>{title}</p>
        {updatedDateText && (
          <span className={`${styles.dateBadge} typoCaptionMedium`}>
            {updatedDateText}
          </span>
        )}
      </div>

      {/* 값 (값이 없으면 안내 문구) */}
      <p className={`${styles.description} typoBodySmall`}>{description}</p>

      {/* 수정하기 버튼 */}
      <button type="button" className={styles.editBtn} onClick={onEditClick}>
        <span className="typoCaptionMedium">{BASIC_INFO_EDIT_BTN_TEXT}</span>
        <MaskIcon src={iconPencil} size={16} className={styles.editIcon} />
      </button>
    </li>
  );
}

export default BasicInfoItem;
