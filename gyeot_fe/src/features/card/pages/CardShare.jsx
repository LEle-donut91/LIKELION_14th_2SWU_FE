// C-06 공유 관리

import styles from "@/features/card/pages/CardShare.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import { useToast } from "@/shared/hooks/useToast";
import ShareCardList from "@/features/card/components/ShareCardList";
import ShareEmpty from "@/features/card/components/ShareEmpty";
import { useSharingList } from "@/features/card/hooks/useSharingList";
import {
  SHARE_LIST_TITLE,
  SHARE_PAGE_TITLE,
} from "@/features/card/constants/cardConstants";

function CardShare() {
  const { toast, showToast, hideToast } = useToast();

  // 철회 / 다시 허용 성공·실패 모두 토스트로 안내 (showToast는 참조가 유지됨)
  const { items, isLoading, hasError, pendingId, handleRevoke, handleReallow } =
    useSharingList({ onActionSuccess: showToast, onActionError: showToast });

  // 본문: 조회 중 / 실패 / 빈 상태 / 목록
  const renderContent = () => {
    // TODO: 로딩·에러 화면 디자인이 정해지면 추가 (지금은 헤더만 표시, C-03과 동일)
    if (isLoading || hasError) return null;

    if (items.length === 0) return <ShareEmpty />;

    return (
      <div className={styles.mainContent}>
        <h2 className={`${styles.listTitle} typoTitleMedium`}>{SHARE_LIST_TITLE}</h2>
        <ShareCardList
          items={items}
          pendingId={pendingId}
          onRevoke={handleRevoke}
          onReallow={handleReallow}
        />
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title={SHARE_PAGE_TITLE} />

      <main className={styles.main}>
        {renderContent()}
        {/* TODO: 접근 이력 (SHOULD 1차, 이번 범위에서 제외) */}
      </main>

      {/* 토스트 (DefaultToast 기본 위치: 페이지 하단 기준)
          - toastArea: 토스트 너비를 글자 길이에 맞춤 (위치 기준점은 그대로 .page) */}
      {toast && (
        <div className={styles.toastArea}>
          <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
        </div>
      )}
    </div>
  );
}

export default CardShare;