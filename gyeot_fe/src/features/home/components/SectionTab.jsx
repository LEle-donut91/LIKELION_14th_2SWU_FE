import styles from "@/features/home/components/SectionTab.module.css";

// 섹션 탭 (나의 상황 / 참여 상황)
// tabList: [{ key, label }]
function SectionTab({ tabList, activeKey, onTabChange }) {
  return (
    <div className={styles.sectionTab} role="tablist">
      {tabList.map(({ key, label }) => {
        const isActive = key === activeKey;

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tabItem} ${
              isActive ? `${styles.active} typoBodyStrong` : "typoBodyMedium"
            }`}
            onClick={() => onTabChange(key)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default SectionTab;
