import styles from "@/features/situation/components/ParticipantTagList.module.css";

/**
 * H-03 상황 참여자 태그 목록 (보호자는 "이름 · 보호자" beige 태그)
 * - participants : [{ id, name, isGuardian }]
 */
function ParticipantTagList({ participants }) {
  return (
    <ul className={styles.participantTagList}>
      {participants.map(({ id, name, isGuardian }) => (
        <li
          key={id}
          className={`${styles.tag} ${
            isGuardian ? styles.guardianTag : styles.memberTag
          } typoCaptionMedium`}
        >
          {isGuardian ? `${name} · 보호자` : name}
        </li>
      ))}
    </ul>
  );
}

export default ParticipantTagList;
