import styles from "@/features/situation/components/RequestListEmpty.module.css";
import IllustrationMessage from "@/shared/components/IllustrationMessage/IllustrationMessage";
import resImgNew from "@/shared/assets/images/resImgNew.png";

// H-03-01-01 요청이 없을 때 안내 (일러스트 + 제목 + 문구)
function RequestListEmpty() {
  return (
    <div className={styles.requestListEmpty}>
      <IllustrationMessage
        imageSrc={resImgNew}
        title="요청사항이 없어요."
        message={"필요한 도움이 생기면\n아래 버튼으로 요청을 작성해 주세요."}
      />
    </div>
  );
}

export default RequestListEmpty;
