import styles from "@/features/situation/components/ParticipantCheckList.module.css";
import iconCheckBoxOn from "@/shared/assets/icons/iconCheckBoxOn.svg";

/**
 * H-01 참여할 지인 체크 목록
 * - people        : [{ id, name, relation, isGuardian }]
 * - checkedIdList : 체크된 지인 id 배열
 * - onChange      : 체크가 바뀔 때마다 새 id 배열 전달
 */
function ParticipantCheckList({ people, checkedIdList, onChange }) {
  const handlePersonToggle = (id) => {
    const isChecked = checkedIdList.includes(id);
    onChange(
      isChecked
        ? checkedIdList.filter((checkedId) => checkedId !== id)
        : [...checkedIdList, id],
    );
  };

  return (
    <ul className={styles.participantList}>
      {people.map(({ id, name, relation, isGuardian }) => {
        const isChecked = checkedIdList.includes(id);

        return (
          <li key={id}>
            <label className={styles.personItem}>
              <input
                type="checkbox"
                className={styles.personInput}
                checked={isChecked}
                onChange={() => handlePersonToggle(id)}
              />

              {/* 프로필: 이름 첫 글자 (보호자는 beige, 그 외 olive) */}
              <span
                className={`${styles.profile} ${
                  isGuardian ? styles.guardianProfile : ""
                }`}
              >
                {name.charAt(0)}
              </span>

              <span className={styles.txtContainer}>
                <span className={`${styles.name} typoBodyStrong`}>{name}</span>
                {relation && (
                  <span className={`${styles.relation} typoBodySmall`}>
                    {relation}
                  </span>
                )}
              </span>

              {isGuardian && (
                <span className={`${styles.guardianTag} typoCaptionMedium`}>
                  보호자
                </span>
              )}

              {/* 체크박스: 체크 시 olive-600 네모 + 흰 체크 아이콘 */}
              <span
                className={`${styles.checkBox} ${
                  isChecked ? styles.checkBoxOn : styles.checkBoxOff
                }`}
                aria-hidden="true"
              >
                {isChecked && (
                  <img className={styles.checkIcon} src={iconCheckBoxOn} alt="" />
                )}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export default ParticipantCheckList;
