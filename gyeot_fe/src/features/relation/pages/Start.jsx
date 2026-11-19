// A-01

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import SignupForm from "@/features/relation/components/SignupForm";
import LoginForm from "@/features/relation/components/LoginForm";
import DefaultToast from "@/shared/components/Toast/DefaultToast"; // 팀 공통 토스트
import { useToast } from "@/shared/hooks/useToast";
import { useLoginMutation, useSignupMutation } from "@/features/relation/hooks/mutations/useAuthMutations";
import { MOCK_RECEIVED_INVITE } from "@/features/relation/constants/relation";
import resImgLogo from "@/shared/assets/images/resImgLogo.png";
import styles from "./Start.module.css";

function Start() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState("start"); // "start" 시작 화면 / "signup" 회원가입 / "login" 로그인
  const { toast, showToast, hideToast } = useToast(); // 실패·안내 토스트

  // 초대 링크로 들어왔는지 (예: /?invite=1) — TODO: 초대 ID로 초대 정보 API 조회
  const isFromInvite = searchParams.has("invite");
  const inviterName = MOCK_RECEIVED_INVITE.inviterName; // TODO: API 연결 후 교체

  // 회원가입 (POST /api/auth/signup)
  // - 가입 후 자동 로그인을 하지 않으므로(명세) 로그인 화면으로 넘김
  const { signup, isSigningUp } = useSignupMutation({
    showToast,
    onSuccess: () => {
      setStep("login");
      showToast("가입이 완료됐어요. 로그인해 주세요.");
    },
  });

  // 로그인 (POST /api/auth/login)
  // - 초대 링크로 왔으면 받은 초대 확인(R-03)으로, 아니면 홈으로
  const { login, isLoggingIn } = useLoginMutation({
    showToast,
    onSuccess: () => navigate(isFromInvite ? "/relation/received-invite" : "/home"),
  });

  // 토스트 (모든 화면 공통)
  const toastElement = toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />;

  /* ===== 회원가입 화면 ===== */
  if (step === "signup") {
    return (
      <div className={styles.page}>
        <SubpageHeader title="이메일 회원가입" onBackClick={() => setStep("start")} />
        <SignupForm onSubmit={signup} isSubmitting={isSigningUp} />
        {toastElement}
      </div>
    );
  }

  /* ===== 로그인 화면 (시안 없음, 회원가입과 같은 스타일) ===== */
  if (step === "login") {
    return (
      <div className={styles.page}>
        <SubpageHeader title="이메일 로그인" onBackClick={() => setStep("start")} />
        <LoginForm onSubmit={login} isSubmitting={isLoggingIn} />
        {toastElement}
      </div>
    );
  }

  /* ===== 시작 화면 ===== */
  return (
    <div className={styles.page}>
      <div className={styles.start}>
        {/* 로고 + 문구 */}
        <div className={styles.brand}>
          <img src={resImgLogo} alt="곁" className={styles.logo} />
          <p className={`typoDisplayMedium ${styles.slogan}`}>함께, 당신의 곁에</p> {/* 팀 타이포 클래스 (명조 Bold 24px) */}
        </div>

        {isFromInvite ? (
          /* 초대 링크로 들어왔을 때 */
          <div className={styles.bottom}>
            <div className={styles.inviteCard}>
              <span className={styles.avatar}>{inviterName[0]}</span>
              <div>
                <p className={styles.inviteTitle}>{inviterName}님이 초대를 보냈어요</p>
                <p className={styles.inviteDesc}>가입·인증을 마치면 이 초대로 돌아와요</p>
              </div>
            </div>

            <button type="button" className={styles.primaryBtn} onClick={() => setStep("signup")}>
              가입하고 초대 확인하기
            </button>

            <p className={styles.loginText}>
              이미 계정이 있어요 ·{" "}
              <button type="button" className={styles.loginLink} onClick={() => setStep("login")}>
                로그인
              </button>
            </p>
          </div>
        ) : (
          /* 일반 시작 화면 */
          <div className={styles.bottom}>
            <button type="button" className={styles.primaryBtn} onClick={() => setStep("signup")}>
              이메일로 회원가입
            </button>
            <button type="button" className={styles.outlineBtn} onClick={() => setStep("login")}>
              로그인
            </button>
          </div>
        )}
      </div>
      {toastElement}
    </div>
  );
}

export default Start;