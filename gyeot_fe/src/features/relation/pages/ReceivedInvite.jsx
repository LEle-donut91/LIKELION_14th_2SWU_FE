// R-03

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import InviteResult from "@/features/relation/components/InviteResult";
import { MOCK_RECEIVED_INVITE } from "@/features/relation/constants/relation";
import iconLink from "@/shared/assets/icons/iconLink.svg";
import IconPeople from "@/shared/assets/icons/IconPeople.svg";
import styles from "./ReceivedInvite.module.css";

function ReceivedInvite() {
  const navigate = useNavigate();
  const [invite] = useState(MOCK_RECEIVED_INVITE); // TODO: API 연결 후 교체
  const isPending = invite.status === "PENDING"; // 대기 상태면 수락/거절 화면

  // 수락 (TODO: 수락 API 연결)
  const handleAccept = () => {
    navigate("/relation"); // 관계 화면으로 이동
  };

  // 거절 (TODO: 거절 API 연결)
  const handleReject = () => {
    navigate("/home"); // 홈으로 이동
  };

  return (
    <div className={styles.page}>
      {/* 상단 헤더 (뒤로 없음, 오른쪽 닫기) */}
      <SubpageHeader
        title="받은 초대"
        hasBackButton={false}
        hasCloseButton
        onCloseClick={() => navigate("/home")}
      />

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
            <p className={styles.message}>{invite.message}</p>

            <div className={styles.relationRow}>
              <span
                className={styles.peopleIcon}
                style={{ maskImage: `url("${IconPeople}")`, WebkitMaskImage: `url("${IconPeople}")` }} // 아이콘 모양에 올리브색 칠하기
              />
              <span className={styles.relationText}>관계 유형</span>
              <span className={styles.relationBadge}>{invite.relationLabel}</span>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className={styles.buttons}>
            <button type="button" className={styles.rejectBtn} onClick={handleReject}>
              거절
            </button>
            <button type="button" className={styles.acceptBtn} onClick={handleAccept}>
              수락
            </button>
          </div>
        </div>
      ) : (
        /* ===== 취소 / 만료 / 수락 / 거절 결과 화면 ===== */
        <InviteResult status={invite.status} />
      )}
    </div>
  );
}

export default ReceivedInvite;