// H-03-02-01 (요청 전송 완료)
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import requestSend from "@/features/request/assets/requestSend.svg";
import styles from "@/features/request/pages/RequestSend.module.css";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import { useNavigate } from "react-router-dom";

function RequestSend() {
  // 페이지 이동을 위해 navigate 선언
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <DefaultHeader title="요청 작성" />
      <main className={styles.content}>
        <img className={styles.requestSendImg} src={requestSend} />
        <span className={`${styles.requetSendTxt} typoDisplaySmall`}>
          발송이 완료되었어요.
        </span>
      </main>
      <LargeFooter
        title="닫기"
        type="primary"
        onClick={() => {
          // 요청 작성 이전 페이지로 이동
          navigate(-3);
        }}
      />
    </div>
  );
}

export default RequestSend;
