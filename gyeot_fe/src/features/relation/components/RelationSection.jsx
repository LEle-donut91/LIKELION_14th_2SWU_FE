import styles from "./RelationSection.module.css";

// 섹션 제목 + 오른쪽 안내 문구 + 내용을 묶는 공통 섹션
export default function RelationSection({ title, hint, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {hint && <span className={styles.hint}>{hint}</span>} {/* "최대 3명", "조회만 가능" 등 */}
      </div>
      {children}
    </section>
  );
}

// 데이터가 없을 때 보여주는 점선 박스
export function EmptyBox({ text, children }) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyText}>{text}</p>
      {children} {/* 빈 상태 안에 버튼이 들어가는 경우 */}
    </div>
  );
}

// 흰 배경 카드 (아이템 묶음용)
export function Card({ children, className = "" }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}