import styles from "@/features/home/components/HomeEmpty.module.css";
import IllustrationMessage from "@/features/home/components/IllustrationMessage";
import ActionButton from "@/features/home/components/ActionButton";
import resImgWait from "@/shared/assets/images/resImgWait.png";

// 홈 - 빈화면 (신규 사용자 온보딩)
function HomeEmpty({ onInviteClick, onSafetyCardClick }) {
  return (
    <div className={styles.homeEmpty}>
      <div className={styles.onboardingContainer}>
        <IllustrationMessage
          imageSrc={resImgWait}
          message={"서로의 곁을 지켜줄 사람을 초대하고,\n건강 정보를 남겨보세요."}
        />
      </div>
      <div className={styles.btnGroup}>
        <ActionButton variant="primary" onClick={onInviteClick}>
          나의 사람 초대하기
        </ActionButton>
        <ActionButton variant="secondary" onClick={onSafetyCardClick}>
          안심카드 작성하기
        </ActionButton>
      </div>
    </div>
  );
}

export default HomeEmpty;
