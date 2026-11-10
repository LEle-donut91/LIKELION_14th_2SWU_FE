import styles from "@/features/situation/components/ManageParticipantList.module.css";

/**
 * H-03-05 정보 주인 시점 참여자 목록 (제외 버튼 포함)
 * - participants   : [{ id, name, relationLabel, isGuardian }]
 * - onExcludeClick : '제외' 클릭 시 해당 참여자 id 전달
 */
function ManageParticipantList({ participants, onExcludeClick }) {
  return (
    <ul className={styles.participantList}>
      {participants.map(({ id, name, relationLabel, isGuardian }) => (
        <li key={id} className={styles.participantItem}>
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
            {relationLabel && (
              <span className={`${styles.relation} typoBodySmall`}>
                {relationLabel}
              </span>
            )}
          </span>

          <button
            type="button"
            className={styles.excludeBtn}
            onClick={() => onExcludeClick(id)}
          >
            제외
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ManageParticipantList;
