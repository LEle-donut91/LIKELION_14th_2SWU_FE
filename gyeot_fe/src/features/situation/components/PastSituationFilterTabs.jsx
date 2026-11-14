import styles from "@/features/situation/components/PastSituationFilterTabs.module.css";
import { PAST_SITUATION_FILTER_TABS } from "@/features/situation/constants/situationConstants";

/**
 * H-04 지난 상황 상단 탭 (전체 / 도와준 / 도움받은)
 * - selectedKey : 선택된 탭 key
 * - onChange    : 탭 클릭 시 key 전달
 */
function PastSituationFilterTabs({ selectedKey, onChange }) {
  return (
    <div className={styles.filterTabs} role="tablist">
      {PAST_SITUATION_FILTER_TABS.map(({ key, label }) => {
        const isSelected = key === selectedKey;

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={`${styles.tabBtn} ${
              isSelected ? styles.selectedTab : ""
            } typoBodySmall`}
            onClick={() => onChange(key)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default PastSituationFilterTabs;
