// R-03

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import DefaultToast from "@/shared/components/Toast/DefaultToast"; // 팀 공통 토스트
import { useToast } from "@/shared/hooks/useToast";
import InviteResult from "@/features/relation/components/InviteResult";
import { DEFAULT_INVITE_MESSAGE } from "@/features/relation/constants/relation";
import { useInvitationQuery } from "@/features/relation/hooks/queries/useInvitationQuery";
import {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
} from "@/features/relation/hooks/mutations/useInvitationMutations";
import iconLink from "@/shared/assets/icons/iconLink.svg";
import IconPeople from "@/shared/assets/icons/IconPeople.svg";
import styles from "./ReceivedInvite.module.css";

function ReceivedInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // 초대 링크 토큰 (초대 링크 진입·로그인 후 ?token=으로 전달됨)
  const { toast, showToast, hideToast } = useToast(); // 실패 안내 토스트

  // 초대 정보 (GET /api/invitations/{token})
  const { data: invite, isError } = useInvitationQuery(token);

  // 토큰이 없거나 사용할 수 없는 링크면 홈으로
  useEffect(() => {
    if (!token || isError) {
      navigate("/home", { replace: true });
    }
  }, [token, isError, navigate]);

  // 수락 → N-01 역초대 제안으로 (반대 방향 추가에 토큰이 필요해서 함께 전달)
  const { acceptInvitation, isAccepting } = useAcceptInvitationMutation(token, {
    showToast,
    onSuccess: () =>
      navigate("/relation/reverse-invite", { state: { inviterName: invite.inviterName, token } }),
  });

  // 거절 → 홈으로
  const { rejectInvitation, isRejecting } = useRejectInvitationMutation(token, {
    showToast,
    onSuccess: () => navigate("/home"),
  });

  const isPending = invite?.status === "PENDING"; // 대기 상태면 수락/거절 화면
  const isSubmitting = isAccepting || isRejecting; // 둘 중 하나라도 요청 중이면 버튼 잠금

  // 헤더 (불러오는 중에도 같은 헤더를 보여줌)
  const header = (
    <SubpageHeader
      title="받은 초대"
      hasBackButton={false}
      hasCloseButton
      onCloseClick={() => navigate("/home")}
    />
  );

  // 초대 정보를 불러오는 동안은 헤더만
  if (!invite) {
    return <div className={styles.page}>{header}</div>;
  }

  return (
    <div className={styles.page}>
      {/* 상단 헤더 (뒤로 없음, 오른쪽 닫기) */}
      {header}

      {isPending ? (
        /* ===== 대기: 수락/거절 화면 ===== */
        <div className={styles.content}>
          {/* 서 ─ 링크 ─ 나 */}
          <div className={styles.connect}>
            <div className={styles.person}>
              <span className={`${styles.avatar} ${styles.inviter}`}>{invite.inviterName[0]}</span>
              <span className={styles.personName}>{invite.inviterName}</span>
            </div>

            <span className={styles.line} />
            {/* 초록 원 안에 흰 링크 아이콘 */}
            <span className={styles.linkCircle}>
              <span
                className={styles.linkIcon}
                style={{ maskImage: `url("${iconLink}")`, WebkitMaskImage: `url("${iconLink}")` }} // 아이콘 모양에 흰색 칠하기
              />
            </span>
            <span className={styles.line} />

            <div className={styles.person}>
              <span className={`${styles.avatar} ${styles.me}`}>나</span>
              <span className={styles.personName}>나</span>
            </div>
          </div>

          <h2 className={styles.title}>
            {invite.inviterName}님이 나의
            <br />
            사람으로 초대했어요
          </h2>

          {/* 초대 내용 카드 */}
          <div className={styles.card}>
            <span className={styles.cardLabel}>기본 멘트</span>
            <p className={styles.message}>{DEFAULT_INVITE_MESSAGE}</p> {/* 나의 사람 초대 문구는 고정 (명세) */}

            <div className={styles.relationRow}>
              <span
                className={styles.peopleIcon}
                style={{ maskImage: `url("${IconPeople}")`, WebkitMaskImage: `url("${IconPeople}")` }} // 아이콘 모양에 올리브색 칠하기
              />
              <span className={styles.relationText}>관계 유형</span>
              <span className={styles.relationBadge}>나의 사람</span>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className={styles.buttons}>
            <button type="button" className={styles.rejectBtn} onClick={rejectInvitation} disabled={isSubmitting}>
              거절
            </button>
            <button type="button" className={styles.acceptBtn} onClick={acceptInvitation} disabled={isSubmitting}>
              수락
            </button>
          </div>
        </div>
      ) : (
        /* ===== 취소 / 만료 / 수락 / 거절 결과 화면 ===== */
        <InviteResult status={invite.status} />
      )}

      {toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />}
    </div>
  );
}

export default ReceivedInvite;