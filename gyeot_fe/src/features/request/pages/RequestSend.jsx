/**
 * =====================================================================
 * H-03-02-01 (요청 전송 완료)
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/RequestSend.module.css";

// icons/images
import resImgSend from "@/shared/assets/images/resImgSend.png";

// Custom Hooks
import { useRequestNav } from "@/features/request//hooks/useRequestNav";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import Toast from "@/shared/components/Toast/Toast";

function RequestSend() {
  // navigation 커스텀 훅 불러오기
  const { handleGoBack, handleGoNext } = useRequestNav();

  return (
    <div className={styles.page}>
      <SubpageHeader title="요청 작성" onBackClick={handleGoBack} />
      <main className={styles.content}>
        <img className={styles.requestSendImg} src={resImgSend} />
        <span className={`${styles.requestSendTxt} typoDisplaySmall`}>
          발송이 완료되었어요.
        </span>
      </main>
      <LargeFooter
        title="닫기"
        type="primary"
        onClick={() => handleGoNext(REQUEST_ROUTES.home, true)}
      />
      <Toast />
    </div>
  );
}

export default RequestSend;
