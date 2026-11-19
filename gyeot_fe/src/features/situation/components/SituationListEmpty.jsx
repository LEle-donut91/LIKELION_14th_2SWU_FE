import styles from "@/features/situation/components/SituationListEmpty.module.css";
import IllustrationMessage from "@/shared/components/IllustrationMessage/IllustrationMessage";
import iconResGradientRadial from "@/shared/assets/icons/iconResGradientRadial.svg";
import resImgNew from "@/shared/assets/images/resImgNew.png";

// S-00-2 진행 중인 상황이 없을 때 안내 (배경 beige 원형 그라디언트 + 일러스트 + 문구)
function SituationListEmpty() {
  return (
    <div className={styles.situationListEmpty}>
      <img
        className={styles.bgGradient}
        src={iconResGradientRadial}
        alt=""
        aria-hidden="true"
      />
      <IllustrationMessage
        imageSrc={resImgNew}
        message={"진행 중인 상황이 없어요.\n필요하다면 상황을 생성해 주세요."}
      />
    </div>
  );
}

export default SituationListEmpty;
