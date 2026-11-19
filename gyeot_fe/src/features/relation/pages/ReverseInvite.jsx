// N-01

import { useLocation, useNavigate } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import DefaultToast from "@/shared/components/Toast/DefaultToast"; // 팀 공통 토스트
import { useToast } from "@/shared/hooks/useToast";
import { useReciprocalMutation } from "@/features/relation/hooks/mutations/useInvitationMutations";
import iconCheckCircle from "@/shared/assets/icons/iconCheckCircle.svg";
import styles from "./ReverseInvite.module.css";

// 사람 + 아이콘 (시트 제목 앞)
function PersonPlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 19.5c.6-3.2 3.3-5.5 6.5-5.5s5.9 2.3 6.5 5.5" />
      <path d="M19 8v6M16 11h6" />
    </svg>
  );
}

function ReverseInvite() {
  const navigate = useNavigate();
  const { state } = useLocation(); // R-03에서 넘겨준 { inviterName, token }
  const inviterName = state?.inviterName ?? "";
  const { toast, showToast, hideToast } = useToast(); // 실패 안내 토스트

  // 나의 사람으로 추가 (POST /api/invitations/{token}/reciprocal) → 관계 화면으로
  const { addReciprocal, isAdding } = useReciprocalMutation(state?.token, {
    showToast,
    onSuccess: () => navigate("/relation", { replace: true }),
  });

  const handleAdd = () => {
    addReciprocal();
  };

  // 괜찮아요 (추가하지 않고 넘어가기)
  const handleSkip = () => {
    navigate("/relation");
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title="받은 초대" />

      <div className={styles.content}>
        {/* 보낸 사람 */}
        <span className={styles.avatar}>{inviterName[0]}</span>

        {/* 수락 완료 안내 */}
        <div className={styles.acceptedCard}>
          <img src={iconCheckCircle} alt="" width={16} height={16} />
          <div>
            <strong className={styles.acceptedTitle}>수락했어요</strong>
            <p className={styles.acceptedDesc}>{inviterName}님의 나의 사람이 됐어요</p>
          </div>
        </div>
      </div>

      {/* 역초대 제안 시트 (화면에 들어오면 바로 보임) */}
      <div className={styles.overlay}>
        <div className={styles.sheet} role="dialog" aria-modal="true">
          <span className={styles.handle} /> {/* 위쪽 손잡이 */}

          <div className={styles.sheetTop}>
            <span className={styles.personIcon}>
              <PersonPlusIcon />
            </span>
            <h2 className={styles.sheetTitle}>{inviterName}님도 나의 사람으로 추가할까요?</h2>
          </div>

          <button type="button" className={styles.addBtn} onClick={handleAdd} disabled={isAdding}>
            나의 사람으로 추가
          </button>
          <p className={styles.caption}>추가하면 나도 {inviterName}님에게 도움을 요청할 수 있어요</p>

          <button type="button" className={styles.skipBtn} onClick={handleSkip}>
            괜찮아요
          </button>
        </div>
      </div>

      {toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />}
    </div>
  );
}

export default ReverseInvite;