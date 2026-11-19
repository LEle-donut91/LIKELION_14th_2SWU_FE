import styles from "@/features/home/components/HomeSection.module.css";

// 홈 하단 섹션 공통 틀 (타이틀 + 리스트 컨테이너)
// 응답이 필요한 요청 · 보낸 요청 · 다가오는 일정에서 사용
// emptyText가 있으면 목록이 비었을 때 안내 박스를 표시
function HomeSection({ title, isEmpty = false, emptyText, children }) {
  return (
    <section className={styles.homeSection}>
      <h2 className={`${styles.title} typoTitleMedium`}>{title}</h2>
      {isEmpty ? (
        <p className={`${styles.emptyBox} typoBodySmall`}>{emptyText}</p>
      ) : (
        <ul className={styles.listContainer}>{children}</ul>
      )}
    </section>
  );
}

export default HomeSection;
