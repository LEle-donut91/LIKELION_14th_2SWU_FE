import styles from "@/features/situation/components/InviteParticipantOption.module.css";
import iconCheckBoxOn from "@/shared/assets/icons/iconCheckBoxOn.svg";

/**
 * H-03-05 참여자 추가 시트 안의 지인 목록 (체크박스로 여러 명 선택)
 * - people        : [{ id, name, relationText, isGuardian }]
 * - joinedIdList  : 이미 참여 중인 지인 id 배열 (회색 + '참여 중' 태그, 선택 불가)
 * - checkedIdList : 체크된 지인 id 배열
 * - onChange      : 체크가 바뀔 때마다 새 id 배열 전달
 */
function InviteParticipantOption({
  people,
  joinedIdList = [],
  checkedIdList,
  onChange,
}) {
  const handlePersonToggle = (id) => {
    const isChecked = checkedIdList.includes(id);
    onChange(
      isChecked
        ? checkedIdList.filter((checkedId) => checkedId !== id)
        : [...checkedIdList, id],
    );
  };

  return (
    <div className={styles.personList}>
      {people.map(({ id, name, relationText, isGuardian }) => {
        const isJoined = joinedIdList.includes(id);
        const isChecked = checkedIdList.includes(id);

        return (
          <label
            key={id}
            className={`${styles.personItem} ${
              isJoined ? styles.joinedPersonItem : ""
            }`}
          >
            <input
              type="checkbox"
              className={styles.personInput}
              checked={isChecked}
              disabled={isJoined}
              onChange={() => handlePersonToggle(id)}
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

            {/* 이미 참여 중이면 체크박스 대신 '참여 중' 태그 */}
            {isJoined ? (
              <span className={`${styles.joinedTag} typoCaptionMedium`}>
                참여 중
              </span>
            ) : (
              <span
                className={`${styles.checkBox} ${
                  isChecked ? styles.checkBoxOn : styles.checkBoxOff
                }`}
                aria-hidden="true"
              >
                {isChecked && (
                  <img
                    className={styles.checkIcon}
                    src={iconCheckBoxOn}
                    alt=""
                  />
                )}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

export default InviteParticipantOption;
