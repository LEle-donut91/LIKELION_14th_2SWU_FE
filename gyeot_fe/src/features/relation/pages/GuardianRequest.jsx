// N-02

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import { DEFAULT_INVITE_MESSAGE } from "@/features/relation/constants/relation";
import iconLink from "@/shared/assets/icons/iconLink.svg";
import iconShield from "@/shared/assets/icons/iconShield.svg";
import iconCheckBoxOn from "@/shared/assets/icons/iconCheckBoxOn.svg"; // 흰색 체크 표시
import styles from "./GuardianRequest.module.css";

// 방패 아이콘 (svg 모양에 CSS로 색 칠하기 — 같은 파일로 초록/갈색 모두 사용)
const shieldMask = { maskImage: `url("${iconShield}")`, WebkitMaskImage: `url("${iconShield}")` };

function GuardianRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 보호자가 이미 3명인지 (TODO: API 연결 후 실제 보호자 수로 판단, 지금은 ?full 로 확인)
  const isFull = searchParams.has("full");

  const [message, setMessage] = useState(DEFAULT_INVITE_MESSAGE); // 기본 멘트 (짧은 편지)
  const [isAgreed, setAgreed] = useState(false); // 약속 내용 확인 여부

  const canSend = !isFull && isAgreed; // 보낼 수 있는지

  // 보호자 요청 링크 보내기 (TODO: POST /api/invitations { invitationType: "GUARDIAN", message } 연결)
  const handleSend = async () => {
    const invitationUrl = `https://gyeot.app/i/${Math.random().toString(36).slice(2, 10)}`; // 임시 링크
    const shareText = `${message}\n${invitationUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({ text: shareText }); // 휴대폰 기본 공유창
      } else {
        await navigator.clipboard.writeText(invitationUrl); // 공유창이 없으면 링크 복사
      }
      navigate("/relation"); // 관계 화면으로 돌아가기
    } catch {
      // 사용자가 공유창을 닫은 경우 그대로 머무르기
    }
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title="보호자 요청" />

      <div className={styles.content}>
        {isFull ? (
          /* ===== 보호자가 이미 3명일 때 ===== */
          <div className={styles.full}>
            <span className={styles.shieldCircle}>
              <span className={`${styles.shieldIcon} ${styles.shieldLarge} ${styles.shieldBeige}`} style={shieldMask} /> {/* 갈색 방패 */}
            </span>

            <div className={styles.fullCard}>
              <strong className={styles.fullTitle}>보호자가 3명이에요</strong>
              <p className={styles.fullDesc}>
                보호자는 최대 3명이에요. 추가하려면 기존 관계를 해제
                <br /> {/* 시안과 같은 위치에서 줄바꿈 */}한 뒤 새로 요청해 주세요.
              </p>
            </div>

            {/* 관계 화면에서 해제할 보호자를 고르도록 이동 */}
            <button type="button" className={styles.goReleaseBtn} onClick={() => navigate("/relation")}>
              보호자 관계 해제하러 가기
            </button>
          </div>
        ) : (
          /* ===== 요청 작성 ===== */
          <>
            {/* 받는 사람 + 기본 멘트 */}
            <div className={styles.card}>
              <p className={styles.label}>받는 사람</p>
              <div className={styles.linkBox}>
                <span
                  className={styles.linkIcon}
                  style={{ maskImage: `url("${iconLink}")`, WebkitMaskImage: `url("${iconLink}")` }} // 아이콘 모양에 회색 칠하기
                />
                <span>
                  <strong className={styles.linkTitle}>링크로 전송합니다</strong>
                  <span className={styles.linkSub}>나의 사람이 아니어도 가능해요</span>
                </span>
              </div>
              <p className={styles.helper}>보호자 요청은 나의 사람 초대와 별개</p>

              <hr className={styles.divider} />

              <label htmlFor="guardianMessage" className={styles.label}>
                기본 멘트
              </label>
              <input
                id="guardianMessage"
                className={styles.input}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={50}
              />
            </div>

            {/* 약속 내용 */}
            <div className={styles.promiseCard}>
              <div className={styles.promiseTop}>
                <span className={styles.shieldSmall}>
                  <span className={`${styles.shieldIcon} ${styles.shieldOlive}`} style={shieldMask} /> {/* 초록 방패 */}
                </span>
                <strong className={styles.promiseTitle}>약속 내용</strong>
              </div>
              <p className={styles.promiseDesc}>필요한 순간 연락받고, 요청을 확인하기로 약속한 관계예요</p>

              {/* 체크하면 보내기 버튼 활성화 */}
              <button
                type="button"
                className={styles.agreeRow}
                onClick={() => setAgreed((prev) => !prev)}
                aria-pressed={isAgreed}
              >
                {/* 체크 상자: 켜지면 초록 네모 + 흰 체크, 꺼지면 빈 네모 */}
                <span className={`${styles.checkBox} ${isAgreed ? styles.checkBoxOn : ""}`}>
                  {isAgreed && <img src={iconCheckBoxOn} alt="" width={14} height={14} />}
                </span>
                약속 내용을 확인했어요
              </button>
            </div>
          </>
        )}

        {/* 하단 버튼 (보호자 3명이거나 약속 미확인이면 비활성) */}
        <button type="button" className={styles.sendBtn} disabled={!canSend} onClick={handleSend}>
          보호자 요청 링크 보내기
        </button>
      </div>
    </div>
  );
}

export default GuardianRequest;