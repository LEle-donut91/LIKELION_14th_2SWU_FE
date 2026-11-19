// C-00

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/features/card/pages/Card.module.css";
import MainHeader from "@/shared/components/main-header/MainHeader";
import BottomNav from "@/shared/components/BottomNav/BottomNav";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import { useToast } from "@/shared/hooks/useToast";
import { getErrorMessage } from "@/shared/utils/apiError";
import CardMenuSection from "@/features/card/components/CardMenuSection";
import CardMenuItem from "@/features/card/components/CardMenuItem";
import { CARD_MENU_SECTION_LIST } from "@/features/card/constants/cardConstants";
import { useCardSummary } from "@/features/card/hooks/useCardSummary";
import {
  formatSharingCount,
  formatToastMessage,
  formatUpdatedDate,
} from "@/features/card/utils/cardFormat";

// 안심카드 (C-00)
function Card() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  // 안심카드 메인 조회 (조회 전·실패 시 cardSummary는 undefined)
  const { cardSummary, error } = useCardSummary();

  // 조회 실패 시 토스트 안내 (메뉴는 고정 설명만 표시)
  useEffect(() => {
    if (!error) return;
    showToast(getErrorMessage(error));
  }, [error, showToast]);

  // TODO: 알림은 MVP 제외, 설정은 와이어프레임에 이동 화면 없음
  const handleAlarmClick = () => console.log("[TODO] 알림");
  const handleSettingClick = () => console.log("[TODO] 설정");

  // 메뉴 카드 클릭 시 상세 화면(C-01 ~ C-06)으로 이동
  const handleMenuItemClick = (path) => navigate(path);

  // 카드 설명 줄 구성
  // - 공유 관리: "지금 공유 중 N건" / 0건이면 "공유 중 건수 없음" / 조회 전·실패 시 빈칸
  // - 그 외: 고정 설명 + (갱신일이 있는 항목만) "갱신 M/D"
  const getSubItems = (item) => {
    if (item.key === "share") {
      return [formatSharingCount(cardSummary?.sharingCount)];
    }
    const updatedDate = item.hasUpdatedDate
      ? formatUpdatedDate(cardSummary?.lastUpdatedAt?.[item.key])
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

      {/* 조회 실패 토스트
          - toastArea: 하단 내비(fixed) 위 경계에 고정해 내비에 가려지지 않도록 위치 조정
          - 문장이 여러 개면 문장마다 줄바꿈 (toastArea의 white-space: pre-line으로 표시) */}
      {toast && (
        <div className={styles.toastArea}>
          <DefaultToast
            key={toast.id}
            message={formatToastMessage(toast.message)}
            onHide={hideToast}
          />
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default Card;