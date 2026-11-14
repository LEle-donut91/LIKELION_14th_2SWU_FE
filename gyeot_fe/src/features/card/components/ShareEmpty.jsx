import styles from "@/features/card/components/ShareEmpty.module.css";
import IllustrationMessage from "@/shared/components/IllustrationMessage/IllustrationMessage";
import resImgNew from "@/shared/assets/images/resImgNew.png";
import { SHARE_EMPTY } from "@/features/card/constants/cardConstants";

/**
 * [C-06] 공유 중인 카드가 없을 때 빈 상태 (일러스트 + 문구 + 안내 박스)
 */
function ShareEmpty() {
  return (
    <div className={styles.shareEmpty}>
      <IllustrationMessage imageSrc={resImgNew} message={SHARE_EMPTY.message} />
      <p className={`${styles.guide} typoBodySmall`}>{SHARE_EMPTY.guide}</p>
    </div>
  );
}

export default ShareEmpty;
