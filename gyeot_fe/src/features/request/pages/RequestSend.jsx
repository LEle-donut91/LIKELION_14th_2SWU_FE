// H-03-02-01 (요청 전송 완료)
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import requestSend from "@/features/request/assets/requestSend.svg";
import styles from "@/features/request/pages/RequestSend.module.css";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import { useRequestNav } from "@/features/request//hooks/useRequestNav";

function RequestSend() {
  // navigation 커스텀 훅 불러오기
  const { handleGoBackToTarget } = useRequestNav();

  return (
    <div className={styles.page}>
      <DefaultHeader
        title="요청 작성"
        onClick={() => handleGoBackToTarget(true)}
      />
      <main className={styles.content}>
        <img className={styles.requestSendImg} src={requestSend} />
        <span className={`${styles.requetSendTxt} typoDisplaySmall`}>
          발송이 완료되었어요.
        </span>
      </main>
      <LargeFooter
        title="닫기"
        type="primary"
        onClick={() => handleGoBackToTarget(true)}
      />
    </div>
  );
}

export default RequestSend;
