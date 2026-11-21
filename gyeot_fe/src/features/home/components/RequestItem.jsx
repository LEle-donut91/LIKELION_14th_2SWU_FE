import styles from "@/features/home/components/RequestItem.module.css";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";

// 요청 리스트 아이템 공통 틀
// ReceivedRequestItem(프로필 있음) · SentRequestItem(프로필 없음)에서 사용
// profile: { name, imageUrl } | undefined
// tagTextList: 태그 문구 목록. 순서대로 그리고, 빈 값(null 등)은 그리지 않음
//              (예: 받은 요청 [남은 시간, 재확인] / 응답 기한이 없는 요청은 태그 없음)
// tagVariant: "received"(beige-100) | "sent"(beige-500). 같은 아이템의 태그는 모두 같은 색
function RequestItem({
  profile,
  title,
  tagTextList = [],
  tagVariant = "received",
  dataItems,
  onClick,
}) {
  const visibleTagTextList = tagTextList.filter(Boolean);

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
            {visibleTagTextList.map((tagText) => (
              <span
                key={tagText}
                className={`${styles.tag} ${styles[tagVariant]} typoCaptionMedium`}
              >
                {tagText}
              </span>
            ))}
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