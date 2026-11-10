import styles from "@/features/situation/components/InviteParticipantOption.module.css";
import iconRadioOff from "@/shared/assets/icons/iconRadioOff.svg";
import iconRadioOn from "@/shared/assets/icons/iconRadioOn.svg";

/**
 * H-03-05 참여자 추가 시트 안의 지인 목록 (라디오로 한 명 선택)
 * - people   : [{ id, name, relationText, isGuardian }]
 * - value    : 선택된 지인 id (없으면 null)
 * - onChange : 선택한 지인 id 전달
 */
function InviteParticipantOption({ people, value, onChange }) {
  return (
    <div className={styles.personList}>
      {people.map(({ id, name, relationText, isGuardian }) => {
        const isSelected = value === id;

        return (
          <label key={id} className={styles.personItem}>
            <input
              type="radio"
              className={styles.personInput}
              name="inviteParticipantGroup"
              checked={isSelected}
              onChange={() => onChange(id)}
            />

            <span
              className={`${styles.profile} ${
                isGuardian ? styles.guardianProfile : ""
              }`}
            >
              {name.charAt(0)}
            </span>

            <span className={styles.txtContainer}>
              <span className="typoBodyStrong">{name}</span>
              <span className="typoCaptionMedium">{relationText}</span>
            </span>

            {isGuardian && (
              <span className={`${styles.guardianTag} typoCaptionMedium`}>
                보호자
              </span>
            )}

            <img
              className={isSelected ? styles.radioOnImg : styles.radioOffImg}
              src={isSelected ? iconRadioOn : iconRadioOff}
              alt=""
            />
          </label>
        );
      })}
    </div>
  );
}

export default InviteParticipantOption;
