import { Children } from "react";
import styles from "@/features/card/components/HealthInfoSection.module.css";
import { HEALTH_INFO_ADD_BTN_TEXT } from "@/features/card/constants/cardConstants";

/**
 * [C-02] 건강 정보 섹션 (섹션 제목 + [항목 카드 목록 + 추가하기 버튼])
 * - 디자인 구조
 *   section (gap 8)
 *   ├─ 제목 (padding-bottom 20)
 *   └─ containerList (gap 12)
 *       ├─ 항목 카드 목록 (카드 사이 gap 12)
 *       └─ 추가하기 버튼
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

        <button type="button" className={styles.addBtn} onClick={onAddClick}>
          <span className="typoBodySmall">{HEALTH_INFO_ADD_BTN_TEXT}</span>
        </button>
      </div>
    </section>
  );
}

export default HealthInfoSection;