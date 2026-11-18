// N-03

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import ConfirmModal from "@/features/relation/components/ConfirmModal";
import { MOCK_RECEIVED_INVITE } from "@/features/relation/constants/relation";
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
  const [invite] = useState(MOCK_RECEIVED_INVITE); // TODO: GET /api/invitations/{token} 연결 후 교체
  const [isFullModalOpen, setFullModalOpen] = useState(false); // 보호자 가득 참 모달 열림 여부

  // 내 보호자가 이미 3명인지 (TODO: POST /api/invitations/{token}/eligibility 결과로 판단, 지금은 ?full 로 확인)
  const isGuardianFull = searchParams.has("full");

  // 수락 (TODO: POST /api/invitations/{token}/accept 연결)
  const handleAccept = () => {
    if (isGuardianFull) {
      setFullModalOpen(true); // 보호자 3명이면 수락 대신 안내 모달
      return;
    }
    navigate("/relation"); // 관계 화면으로 이동
  };

  // 거절 / 요청 취소 (TODO: POST /api/invitations/{token}/reject 연결)
  const handleReject = () => {
    setFullModalOpen(false);
    navigate("/home"); // 홈으로 이동
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title="보호자 요청" />

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
          <p className={styles.message}>“{invite.message}”</p>
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
          <button type="button" className={styles.acceptBtn} onClick={handleAccept}>
            수락
          </button>
          <button type="button" className={styles.rejectBtn} onClick={handleReject}>
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
    </div>
  );
}

export default ReceivedGuardian;