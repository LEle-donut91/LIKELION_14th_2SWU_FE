// R-02-01

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import DefaultToast from "@/shared/components/Toast/DefaultToast"; // 팀 공통 토스트
import { useToast } from "@/shared/hooks/useToast";
import SharedInfoCard from "@/features/relation/components/SharedInfoCard";
import { SHARE_STATUS } from "@/features/relation/constants/sharedInfo";
import { toSharedInfo } from "@/features/relation/services/sharedInfoService";
import { useSharingList } from "@/features/card/hooks/useSharingList"; // 안심카드(C-06)와 같은 공유 관리 API 사용
import { useReceivedSharingsQuery } from "@/features/relation/hooks/queries/useReceivedSharingsQuery";
import iconDocument from "@/shared/assets/icons/iconDocument.svg";
import styles from "./AcquaintanceShared.module.css";

function AcquaintanceShared() {
  const navigate = useNavigate();
  const { state } = useLocation(); // R-02에서 넘겨준 { id, userId, name }
  const name = state?.name ?? "";
  const { toast, showToast, hideToast } = useToast(); // 성공·실패 안내 토스트

  // 주소로 바로 들어와서 누구인지 모르면 관계 화면으로
  useEffect(() => {
    if (!state?.userId) {
      navigate("/relation", { replace: true });
    }
  }, [state, navigate]);

  // 이 사람에게 공유 중인 정보 (GET /api/sharings?userId) + 직접 철회 / 다시 허용
  const { items, isLoading, pendingId, handleRevoke, handleReallow } = useSharingList({
    userId: state?.userId,
    onActionSuccess: showToast,
    onActionError: showToast,
  });
  const sharing = items.map(toSharedInfo);

  // 이 사람에게 받은 정보 (GET /api/sharings/received?userId) — 조회만
  const { data: received = [], isLoading: isReceivedLoading } = useReceivedSharingsQuery(state?.userId);

  const hasWithdrawn = sharing.some((info) => info.status === SHARE_STATUS.WITHDRAWN); // 철회한 게 있는지

  // 공유 중이면 직접 철회, 철회됨이면 다시 허용
  const handleToggle = (info) => {
    if (info.status === SHARE_STATUS.SHARING) {
      handleRevoke(info.id);
    } else {
      handleReallow(info.id);
    }
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title={`${name} - 공유 중인 정보`} />

      <div className={styles.content}>
        {/* ===== 공유 중 정보 ===== */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>공유 중 정보</h2>
          {!isLoading && (
            <div className={styles.list}>
              {sharing.map((info) => (
                <SharedInfoCard
                  key={info.id}
                  info={info}
                  variant="sharing"
                  onToggle={handleToggle}
                  disabled={pendingId !== null} // 처리 중이면 모든 버튼 잠금
                />
              ))}
            </div>
          )}
          {hasWithdrawn && <p className={styles.notice}>철회는 즉시 반영돼요. 같은 요청 안에서는 다시 허용할 수 있어요</p>}
        </section>

        {/* ===== 받은 정보 ===== */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>받은 정보</h2>
            <span className={styles.hint}>조회만</span>
          </div>

          {isReceivedLoading ? null : received.length === 0 ? (
            /* 받은 정보 없을 때 */
            <>
              <div className={styles.empty}>
                <img src={iconDocument} alt="" width={16} height={16} />
                <p className={styles.emptyText}>받은 정보 없음</p>
              </div>
              <p className={styles.emptyBar}>{name}님이 아직 공유한 정보가 없어요.</p>
            </>
          ) : (
            <div className={styles.list}>
              {received.map((info) => (
                <SharedInfoCard
                  key={info.id}
                  info={info}
                  variant="received"
                  onClick={() => navigate(`/request/detail/${info.requestId}`)} // 선택하면 H-03-01 요청 상세로
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />}
    </div>
  );
}

export default AcquaintanceShared;
