import styles from "@/features/home/components/RequestItem.module.css";
import DotSeparatedText from "@/features/home/components/DotSeparatedText";

// 요청 리스트 아이템 공통 틀
// ReceivedRequestItem(프로필 있음) · SentRequestItem(프로필 없음)에서 사용
// profile: { name, imageUrl } | undefined
// tagVariant: "received"(beige-100) | "sent"(beige-500)
function RequestItem({
  profile,
  title,
  tagText,
  tagVariant = "received",
  dataItems,
  onClick,
}) {
  return (
    <li>
      <button type="button" className={styles.requestItem} onClick={onClick}>
        {profile && (
          <div className={styles.profile}>
            {profile.imageUrl ? (
              <img
                className={styles.profileImage}
                src={profile.imageUrl}
                alt=""
              />
            ) : (
              <span className={styles.profileImage} aria-hidden="true" />
            )}
            <span className={`${styles.userName} typoCaptionMedium`}>
              {profile.name}
            </span>
          </div>
        )}

        <div className={styles.textContainer}>
          <div className={styles.titleContainer}>
            <strong className={`${styles.title} typoBodyStrong`}>
              {title}
            </strong>
            <span
              className={`${styles.tag} ${styles[tagVariant]} typoCaptionMedium`}
            >
              {tagText}
            </span>
          </div>
          <DotSeparatedText
            className={`${styles.data} typoBodySmall`}
            items={dataItems}
          />
        </div>
      </button>
    </li>
  );
}

export default RequestItem;
