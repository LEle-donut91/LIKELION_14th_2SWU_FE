import styles from "@/features/home/components/IllustrationMessage.module.css";

// 일러스트(녹색 원형 그라디언트 위) + 안내 문구 (간격 24)
// 홈 빈화면 온보딩, 진행 중 상황 없음 안내에서 공통 사용
// imageSrc가 없으면 회색 placeholder 표시
function IllustrationMessage({ imageSrc, imageAlt = "", message }) {
  return (
    <div className={styles.illustrationMessage}>
      <div className={styles.illustration}>
        {imageSrc ? (
          <img className={styles.image} src={imageSrc} alt={imageAlt} />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
      </div>
      <p className={`${styles.message} typoDisplaySmall`}>{message}</p>
    </div>
  );
}

export default IllustrationMessage;
