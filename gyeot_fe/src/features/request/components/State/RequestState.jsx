import styles from "@/features/request/components/State/RequestState.module.css";
/**
 * @param isRequester 현재 사용자가 요청자인지 여부를 나타내는 Boolean(true/false) 값
 * @param title 타이틀
 * @param information 상세 정보
 */
function RequestState({ isAssignee, title, information }) {
  return (
    <div className={`${isAssignee ? styles.isAssignee : styles.isRequester}`}>
      <span className="typoBodyStrong">{title}</span>
      <span className="typoCaptionMedium">- {information}</span>
    </div>
  );
}

export default RequestState;
