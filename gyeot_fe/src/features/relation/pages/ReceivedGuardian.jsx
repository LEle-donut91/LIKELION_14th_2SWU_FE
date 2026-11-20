// N-03

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import DefaultToast from "@/shared/components/Toast/DefaultToast"; // 팀 공통 토스트
import { useToast } from "@/shared/hooks/useToast";
import ConfirmModal from "@/features/relation/components/ConfirmModal";
import InviteResult from "@/features/relation/components/InviteResult"; // 대기 중이 아닐 때 결과 화면 (R-03과 공통)
import { UNAVAILABLE_REASON } from "@/features/relation/services/invitationService";
import { useInvitationQuery } from "@/features/relation/hooks/queries/useInvitationQuery";
import {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
} from "@/features/relation/hooks/mutations/useInvitationMutations";
import iconShield from "@/shared/assets/icons/iconShield.svg";
import styles from "./ReceivedGuardian.module.css";

// 안내 박스 앞 (i) 아이콘
function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.2v3.6" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 모달용 경고(!) 아이콘
function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1.1" fill="#fff" />
    </svg>
  );
}

function ReceivedGuardian() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // 보호자 요청 링크 토큰 (초대 링크 진입·로그인 후 ?token=으로 전달됨)
  const [isFullModalOpen, setFullModalOpen] = useState(false); // 보호자 가득 참 모달 열림 여부
  const { toast, showToast, hideToast } = useToast(); // 실패 안내 토스트

  // 요청 정보 + 수락 가능 여부 (GET /api/invitations/{token} — 별도 확인 API 없이 canAccept로 판단)
  const { data: invite, isError } = useInvitationQuery(token);

  // 토큰이 없거나 사용할 수 없는 링크면 홈으로
  useEffect(() => {
    if (!token || isError) {
      navigate("/home", { replace: true });
    }
  }, [token, isError, navigate]);

  // 수락 → 관계 화면으로
  const { acceptInvitation, isAccepting } = useAcceptInvitationMutation(token, {
    showToast,
    onSuccess: () => navigate("/relation", { replace: true }),
  });

  // 거절 → 홈으로
  const { rejectInvitation, isRejecting } = useRejectInvitationMutation(token, {
    showToast,
    onSuccess: () => navigate("/home", { replace: true }),
  });

  const isSubmitting = isAccepting || isRejecting; // 요청 중이면 버튼 잠금

  // 수락 버튼: 수락할 수 없는 이유가 있으면 안내, 없으면 수락
  const handleAccept = () => {
    if (invite.unavailableReason === UNAVAILABLE_REASON.GUARDIAN_LIMIT_REACHED) {
      setFullModalOpen(true); // 보호자 3명이면 수락 대신 안내 모달
      return;
    }
    if (invite.unavailableReason === UNAVAILABLE_REASON.SELF_INVITATION) {
      showToast("내가 보낸 보호자 요청은 수락할 수 없어요");
      return;
    }
    acceptInvitation();
  };

  // 거절 / 요청 취소 (모달의 요청 취소도 거절로 처리)
  const handleReject = () => {
    setFullModalOpen(false);
    rejectInvitation();
  };

  const header = <SubpageHeader title="보호자 요청" />;

  // 요청 정보를 불러오는 동안은 헤더만
  if (!invite) {
    return <div className={styles.page}>{header}</div>;
  }

  // 이미 응답·취소·만료된 요청이면 결과 화면
  if (invite.status !== "PENDING") {
    return (
      <div className={styles.page}>
        {header}
        <InviteResult status={invite.status} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {header}

      <div className={styles.content}>
        {/* 보낸 사람 */}
        <span className={styles.avatar}>{invite.inviterName[0]}</span>
        <h2 className={styles.title}>
          {invite.inviterName}님이 서로의
          <br />
          보호자를 요청했어요
        </h2>

        {/* 기본 멘트 */}
        <div className={styles.messageCard}>
          <span className={styles.messageLabel}>기본 멘트</span>
          <p className={styles.message}>“{invite.message ?? invite.defaultMessage}”</p> {/* 편지가 없으면 기본 멘트 */}
        </div>

        {/* 약속 내용 */}
        <div className={styles.promise}>
          <span className={styles.shieldCircle}>
            <span
              className={styles.shieldIcon}
              style={{ maskImage: `url("${iconShield}")`, WebkitMaskImage: `url("${iconShield}")` }} // 방패 모양에 초록 칠하기
            />
          </span>
          <p>필요한 순간 연락받고, 요청을 확인하기로 약속한 관계예요</p>
        </div>

        {/* 나의 사람 대체 안내 */}
        <div className={styles.info}>
          <InfoIcon />
          <p>
            이미 나의 사람 관계가 있다면 보호자 하나로 <b>대체</b>돼요. 진행 중인 요청과 참여 중인 상황은 유지돼요.
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className={styles.buttons}>
          <button type="button" className={styles.acceptBtn} onClick={handleAccept} disabled={isSubmitting}>
            수락
          </button>
          <button type="button" className={styles.rejectBtn} onClick={handleReject} disabled={isSubmitting}>
            거절
          </button>
        </div>
      </div>

      {/* 보호자 인원 가득 참 모달 */}
      <ConfirmModal
        isOpen={isFullModalOpen}
        icon={<WarningIcon />}
        title="보호자 인원이 가득 차서 수락할 수 없어요"
        description="보호자는 최대 3명이에요."
        cancelText="돌아가기"
        confirmText="요청 취소"
        onCancel={() => setFullModalOpen(false)}
        onConfirm={handleReject}
      />

      {toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />}
    </div>
  );
}

export default ReceivedGuardian;