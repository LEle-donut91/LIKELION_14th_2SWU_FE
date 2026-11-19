import styles from "@/features/card/components/CardMenuSection.module.css";

// 안심카드 메뉴 섹션 (섹션 타이틀 + 메뉴 카드 목록)
// 예: "정보 관리", "기타 정보 관리"
function CardMenuSection({ title, children }) {
  return (
    <section className={styles.cardMenuSection}>
      <h2 className={`${styles.title} typoTitleMedium`}>{title}</h2>
      <ul className={styles.list}>{children}</ul>
    </section>
  );
}

export default CardMenuSection;