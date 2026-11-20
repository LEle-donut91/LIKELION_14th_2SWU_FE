// R-01

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import ConfirmModal from "@/features/relation/components/ConfirmModal";
import DefaultToast from "@/shared/components/Toast/DefaultToast"; // 팀 공통 토스트
import { useToast } from "@/shared/hooks/useToast";
import { INVITATION_TYPE } from "@/features/relation/services/invitationService";
import {
  useCancelInvitationMutation,
  useCreateInvitationMutation,
} from "@/features/relation/hooks/mutations/useInvitationMutations";
import {
  RELATION_TYPE_CHIPS,
  DEFAULT_INVITE_MESSAGE,
  INVITE_VALID_DAYS,
} from "@/features/relation/constants/relation";
import styles from "./AcquaintanceInvite.module.css";

function AcquaintanceInvite() {
  const navigate = useNavigate();

  // ※ 명세상 나의 사람 초대 문구는 고정이라 서버로 보내지 않음 (공유 문구에만 사용)
  //   관계 형태는 초대 생성 때 personalLabel로 보냄 → 상대가 수락하면 내 쪽 관계 라벨로 저장 (상대에게는 안 보임)
  const [message, setMessage] = useState(DEFAULT_INVITE_MESSAGE); // 기본 멘트 (공유 문구에만 사용)
  const [relationType, setRelationType] = useState(""); // 관계 형태 (personalLabel로 전송)
  const [invitation, setInvitation] = useState(null); // 만들어진 초대 { invitationId, invitationUrl } (있으면 링크 화면)
  const [isCancelOpen, setCancelOpen] = useState(false); // 초대 취소 모달 열림 여부
  const { toast, showToast, hideToast } = useToast(); // 실패 안내 토스트

  const inviteLink = invitation?.invitationUrl ?? ""; // 공유할 초대 링크
  const shareText = `${message}\n${inviteLink}`; // 공유할 문구 (멘트 + 링크)

  // 초대 링크 생성 (POST /api/invitations, invitationType: MY_PERSON)
  const { createInvitation, isCreating } = useCreateInvitationMutation({
    showToast,
    onSuccess: (data) => setInvitation(data), // { invitationId, invitationUrl, expiresAt }
  });

  // 발신 초대 취소 (DELETE /api/invitations/{invitationId}) → 관계 화면으로
  const { cancelInvitation, isCanceling } = useCancelInvitationMutation({
    showToast,
    onSuccess: () => navigate("/relation", { replace: true }),
  });

  // 초대 링크 만들기 (관계 형태는 입력했을 때만 같이 보냄)
  const handleCreateLink = () => {
    createInvitation({
      invitationType: INVITATION_TYPE.MY_PERSON,
      personalLabel: relationType.trim(), // 비어 있으면 보내지 않음 (명세: 전달 시 1~50자)
    });
  };

  // 문자로 보내기
  const handleSms = () => {
    window.location.href = `sms:?body=${encodeURIComponent(shareText)}`;
  };

  // 카카오톡으로 보내기 (TODO: 카카오 SDK 연결)
  const handleKakao = () => {
    console.log("카카오톡 공유", inviteLink);
  };

  // 링크 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      console.log("링크 복사 실패");
    }
  };

  // 기타 (휴대폰 기본 공유창, 지원 안 하면 복사)
  const handleMore = async () => {
    if (!navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({ text: shareText });
    } catch {
      // 사용자가 공유창을 닫은 경우 아무것도 안 함
    }
  };

  // 공유 버튼 목록
  const shareButtons = [
    { label: "문자", onClick: handleSms },
    { label: "카카오톡", onClick: handleKakao },
    { label: "링크 복사", onClick: handleCopy },
    { label: "기타", onClick: handleMore },
  ];

  // 초대 취소 확정
  const handleCancelConfirm = () => {
    setCancelOpen(false);
    cancelInvitation(invitation.invitationId);
  };

  return (
    <div className={styles.page}>
      {/* 상단 헤더 (공통 SubpageHeader) */}
      <SubpageHeader title="나의 사람 초대" />

      {!inviteLink ? (
        /* ===== 1. 입력 화면 ===== */
        <div className={styles.content}>
          {/* 기본 멘트 */}
          <div className={styles.field}>
            <label htmlFor="inviteMessage" className={styles.label}>
              기본 멘트
            </label>
            <input
              id="inviteMessage"
              className={styles.input}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={50}
            />
            <p className={styles.helper}>초대 메시지에 들어가는 기본 멘트</p>
          </div>

          {/* 관계 형태 */}
          <div className={styles.field}>
            <label htmlFor="relationType" className={styles.label}>
              관계 형태
            </label>
            <input
              id="relationType"
              className={styles.input}
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              placeholder="친구 · 연인 · 이웃 등 (내가 입력)"
              maxLength={20}
            />
            <p className={styles.helper}>나만 보는 라벨 · 상대와 동기화되지 않아요 · 권한에 영향 없음</p>

            {/* 빠른 선택 칩 */}
            <div className={styles.chips}>
              {RELATION_TYPE_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className={`${styles.chip} ${relationType === chip ? styles.chipActive : ""}`}
                  onClick={() => setRelationType(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* 하단 버튼 (멘트가 비어 있으면 비활성) */}
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleCreateLink}
            disabled={!message.trim() || isCreating} // 요청 중 중복 클릭 방지
          >
            초대 링크 만들기
          </button>
        </div>
      ) : (
        /* ===== 2. 링크 화면 ===== */
        <div className={styles.content}>
          {/* 초대 링크 카드 */}
          <div className={styles.linkCard}>
            <div className={styles.linkCardTop}>
              <strong className={styles.linkTitle}>초대 링크</strong>
              <span className={styles.badge}>대기</span>
            </div>
            <p className={styles.linkMeta}>{INVITE_VALID_DAYS}일 유효 · 1회용</p>
          </div>

          {/* 링크 주소 (길면 ...으로 자름) */}
          <div className={styles.urlBox}>{inviteLink}</div>

          {/* 공유 버튼 4개 */}
          <div className={styles.shareGrid}>
            {shareButtons.map((btn) => (
              <button key={btn.label} type="button" className={styles.shareBtn} onClick={btn.onClick}>
                {btn.label}
              </button>
            ))}
          </div>

          <hr className={styles.divider} />

          {/* 초대 취소 */}
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => setCancelOpen(true)}
            disabled={isCanceling}
          >
            초대 취소
          </button>
          <p className={styles.caption}>수락 전에만 취소 가능</p>
        </div>
      )}

      {/* 초대 취소 확인 모달 */}
      <ConfirmModal
        isOpen={isCancelOpen}
        title="초대 취소"
        description={"보낸 링크는 다시 쓸 수 없어요.\n다시 연결하려면 새로 초대해야 해요."}
        cancelText="돌아가기"
        confirmText="제외"
        onCancel={() => setCancelOpen(false)}
        onConfirm={handleCancelConfirm}
      />

      {toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />}
    </div>
  );
}

export default AcquaintanceInvite;