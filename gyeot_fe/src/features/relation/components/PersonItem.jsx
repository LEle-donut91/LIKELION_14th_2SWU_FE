import styles from "./PersonItem.module.css";

// 이름 첫 글자 아바타 + 이름/설명 + (선택) 배지 + (선택) 화살표를 보여주는 한 줄 아이템
// color: 아바타 색 ("beige" 보호자 / "olive" 내가 등록한 사람 / "gray" 나를 등록한 사람)
export default function PersonItem({ name, sub, badge, showArrow = false, onClick, color = "beige" }) {
  const Tag = onClick ? "button" : "div"; // 클릭 가능할 때만 button으로 렌더링

  return (
    <Tag className={styles.item} onClick={onClick} type={onClick ? "button" : undefined}>
      <span className={`${styles.avatar} ${styles[color]}`}>{name[0]}</span> {/* 이름 첫 글자 */}

      <span className={styles.info}>
        <span className={styles.name}>{name}</span>
        {sub && <span className={styles.sub}>{sub}</span>} {/* 연락 순서·관계 등 보조 텍스트 */}
      </span>

      {badge} {/* 보호자/상태 배지 (외부에서 주입) */}

      {showArrow && (
        <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Tag>
  );
}