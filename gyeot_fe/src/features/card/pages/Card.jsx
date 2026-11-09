// C-00

import { useNavigate } from "react-router-dom";
import styles from "@/features/card/pages/Card.module.css";
import MainHeader from "@/shared/components/main-header/MainHeader";
import BottomNav from "@/shared/components/BottomNav/BottomNav";
import CardMenuSection from "@/features/card/components/CardMenuSection";
import CardMenuItem from "@/features/card/components/CardMenuItem";
import { CARD_MENU_SECTION_LIST } from "@/features/card/constants/cardConstants";
import { CARD_SUMMARY_MOCK } from "@/features/card/mocks/cardMockData";
import {
  formatSharingCount,
  formatUpdatedDate,
} from "@/features/card/utils/cardFormat";

// 안심카드 (C-00)
function Card() {
  const navigate = useNavigate();
  const cardSummary = CARD_SUMMARY_MOCK; // TODO: API 스펙 확정 후 교체

  // TODO: 알림은 MVP 제외, 설정은 와이어프레임에 이동 화면 없음
  const handleAlarmClick = () => console.log("[TODO] 알림");
  const handleSettingClick = () => console.log("[TODO] 설정");

  // 메뉴 카드 클릭 시 상세 화면(C-01 ~ C-06)으로 이동
  const handleMenuItemClick = (path) => navigate(path);

  // 카드 설명 줄 구성
  // - 공유 관리: "지금 공유 중 N건"
  // - 그 외: 고정 설명 + (갱신일이 있는 항목만) "갱신 M/D"
  const getSubItems = (item) => {
    if (item.key === "share") {
      return [formatSharingCount(cardSummary.sharingCount)];
    }
    const updatedDate = item.hasUpdatedDate
      ? formatUpdatedDate(cardSummary.updatedDate?.[item.key])
      : "";
    return [item.description, updatedDate];
  };

  return (
    <div className={styles.card}>
      <MainHeader
        title="안심카드"
        hasAlarmButton
        hasSettingButton
        onAlarmClick={handleAlarmClick}
        onSettingClick={handleSettingClick}
      />

      <main className={styles.mainContent}>
        {CARD_MENU_SECTION_LIST.map((section) => (
          <CardMenuSection key={section.key} title={section.title}>
            {section.items.map((item) => (
              <CardMenuItem
                key={item.key}
                title={item.title}
                subItems={getSubItems(item)}
                onClick={() => handleMenuItemClick(item.path)}
              />
            ))}
          </CardMenuSection>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}

export default Card;