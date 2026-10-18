import styles from "@/features/home/components/SituationEmpty.module.css";
import IllustrationMessage from "@/features/home/components/IllustrationMessage";
import ActionButton from "@/features/home/components/ActionButton";
import resImgNew from "@/shared/assets/images/resImgNew.png";

// 진행 중인 상황이 없을 때 안내
// onCreateClick이 없으면 버튼을 표시하지 않음 (참여 상황 탭)
function SituationEmpty({ message, onCreateClick }) {
  return (
    <div className={styles.situationEmpty}>
      <IllustrationMessage imageSrc={resImgNew} message={message} />
      {onCreateClick && (
        <ActionButton variant="secondary" onClick={onCreateClick}>
          상황 생성하기
        </ActionButton>
      )}
    </div>
  );
}

export default SituationEmpty;
