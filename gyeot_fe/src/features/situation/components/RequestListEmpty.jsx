import styles from "@/features/situation/components/RequestListEmpty.module.css";
import IllustrationMessage from "@/shared/components/IllustrationMessage/IllustrationMessage";
import resImgNew from "@/shared/assets/images/resImgNew.png";

// H-03 요청이 없을 때 안내 (일러스트 + 제목 + 문구)
// - 정보 주인(H-03-01-01), 참여자(H-03-02-01)에서 문구만 바꿔 사용
function RequestListEmpty({ title, message }) {
  return (
    <div className={styles.requestListEmpty}>
      <IllustrationMessage imageSrc={resImgNew} title={title} message={message} />
    </div>
  );
}

export default RequestListEmpty;
