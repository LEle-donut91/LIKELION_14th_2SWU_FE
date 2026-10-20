// H-03-01-01
import styles from "@/features/request/pages/ReceivedInfo.module.css";
import ExitHeader from "@/features/request/components/Header/ExitHeader";
import { useRequestNav } from "@/features/request//hooks/useRequestNav";
import SafetyCardDetail from "@/features/request/components/SafetyCard/SafetyCardDetail";
import DueDateState from "@/features/request/components/State/DueDateState";
import receivedInfoData from "@/features/request/api/receivedInfoData.json";
import resImgLock from "@/shared/assets/images/resImgLock.png";

function ReceivedInfo() {
  const { handleGoBack } = useRequestNav();
  const { dueDate, isAccessible, safetyCardDetails } = receivedInfoData;

  return (
    <div className={styles.page}>
      <ExitHeader title="전달받은 정보" onClick={handleGoBack} />

      <main className={styles.content}>
        <DueDateState
          isResponse={false}
          title="접근 기한"
          dueDate={`~ ${dueDate} (종료 시점)`}
        />

        {/* SafetyCardDetail 리스트를 map 함수로 동적 렌더링 */}
        {isAccessible ? (
          // 전달 정보 - 비활성화
          safetyCardDetails.map((section, index) => (
            <SafetyCardDetail
              key={index}
              title={section.title}
              cardList={section.cardList}
            />
          ))
        ) : (
          // 전달 정보 - 비활성화
          <div className={styles.imgContainer}>
            <img className={styles.lockImg} src={resImgLock} />
            <span className="typoDisplaySmall">
              요청을 완료하여 접근이 종료됐어요.
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

export default ReceivedInfo;
