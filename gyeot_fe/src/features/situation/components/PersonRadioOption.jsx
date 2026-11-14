import styles from "@/features/situation/components/PersonRadioOption.module.css";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import iconRadioOn from "@/shared/assets/icons/iconRadioOn.svg";
import iconRadioOff from "@/shared/assets/icons/iconRadioOff.svg";
import { PAST_SITUATION_ALL_PERSON_TEXT } from "@/features/situation/constants/situationConstants";

/**
 * H-04 사람 선택 시트 안의 목록 (라디오로 한 명 선택)
 * - 맨 위 '전체'를 고르면 사람 필터 해제 (value: null)
 * - people   : [{ id, name, isGuardian }]
 * - value    : 선택된 사람 id (전체면 null)
 * - onChange : 선택한 id 전달
 */
function PersonRadioOption({ people, value, onChange }) {
  const options = [
    { id: null, name: PAST_SITUATION_ALL_PERSON_TEXT, isAll: true },
    ...people,
  ];

  return (
    <div className={styles.personList} role="radiogroup">
      {options.map(({ id, name, isGuardian, isAll }) => {
        const isSelected = value === id;

        return (
          <button
            key={id ?? "all"}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={styles.personItem}
            onClick={() => onChange(id)}
          >
            <span className={styles.personLeft}>
              {!isAll && <span className={styles.profile} aria-hidden="true" />}
              <span className={`${styles.name} typoBodyStrong`}>{name}</span>
              {isGuardian && (
                <span className={`${styles.guardianTag} typoCaptionMedium`}>
                  보호자
                </span>
              )}
            </span>
            <MaskIcon
              className={isSelected ? styles.radioOn : styles.radioOff}
              src={isSelected ? iconRadioOn : iconRadioOff}
              size={28}
            />
          </button>
        );
      })}
    </div>
  );
}

export default PersonRadioOption;
