import { Children } from "react";
import styles from "@/features/card/components/HealthInfoSection.module.css";
import CardAddButton from "@/features/card/components/CardAddButton";

/**
 * [C-02] 건강 정보 섹션 (섹션 제목 + [항목 카드 목록 + 추가하기 버튼])
 * - 디자인 구조
 *   section (gap 8)
 *   ├─ 제목 (padding-bottom 20)
 *   └─ containerList (gap 12)
 *       ├─ 항목 카드 목록 (카드 사이 gap 12)
 *       └─ 추가하기 버튼 (공통 CardAddButton)
 * - 항목이 없으면 목록을 그리지 않고 제목과 '추가하기' 버튼만 표시
 * @param {string}    title       섹션 제목 (예: "질환")
 * @param {Function}  onAddClick  '추가하기' 클릭 시 동작
 * @param {ReactNode} children    항목 카드 목록 (BasicInfoItem)
 */
function HealthInfoSection({ title, onAddClick, children }) {
  const hasItems = Children.count(children) > 0;

  return (
    <section className={styles.healthInfoSection}>
      <h2 className={`${styles.title} typoTitleMedium`}>{title}</h2>

      <div className={styles.containerList}>
        {hasItems && <ul className={styles.list}>{children}</ul>}

        <CardAddButton onClick={onAddClick} />
      </div>
    </section>
  );
}

export default HealthInfoSection;