import styles from "@/features/home/components/SituationTagList.module.css";
import { SITUATION_TAG } from "@/features/home/constants/homeConstants";

// 상황 카드 하단 태그 목록 (수락 0건, 담당없음 0건 ...)
// tags: [{ type, count }]
function SituationTagList({ tags }) {
  if (!tags?.length) return null;

  return (
    <ul className={styles.situationTagList}>
      {tags.map(({ type, count }) => {
        const tagInfo = SITUATION_TAG[type];
        if (!tagInfo) return null;

        return (
          <li
            key={type}
            className={`${styles.tag} ${
              tagInfo.isActive ? styles.active : ""
            } typoBodySmall`}
          >
            {`${tagInfo.label} ${count}건`}
          </li>
        );
      })}
    </ul>
  );
}

export default SituationTagList;
