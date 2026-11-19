// H-03-01-01
import styles from "@/features/request/pages/ReceivedInfo.module.css";

// 일반 라이브러리
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useReceivedInfoQuery } from "@/features/request/hooks/queries/useReceivedInfoQuery";
import { useToast } from "@/shared/hooks/useToast";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SafetyCardDetail from "@/features/request/components/SafetyCard/SafetyCardDetail";
import DueDateState from "@/features/request/components/State/DueDateState";
import DefaultToast from "@/shared/components/Toast/DefaultToast";

// Assets
import resImgLock from "@/shared/assets/images/resImgLock.png";

function ReceivedInfo() {
  const paramId = useParams().id;
  const { handleGoBack } = useRequestNav();
  const { toast, showToast, hideToast } = useToast();

  // 전달받은 정보 조회 API
  const {
    data: receivedInfo,
    isPending,
  } = useReceivedInfoQuery(paramId, { showToast });

  // API 응답 데이터 (정제된 형태)
  const {
    isAccessible,
    dueDate,
    unavailableMessage,
    safetyCardDetails = [],
  } = receivedInfo ?? {};

  return (
    <div className={styles.page}>
      <SubpageHeader
        hasBackButton={false}
        hasCloseButton
        title="전달받은 정보"
        onCloseClick={handleGoBack}
      />

      <main className={styles.content}>
        {isPending && <p role="status">전달받은 정보를 불러오는 중이에요.</p>}
        {receivedInfo && (
          <>
            <DueDateState
              isResponse={false}
              title="접근 기한"
              dueDate={dueDate}
            />

            {isAccessible ? (
              // 전달 정보 - 활성화
              safetyCardDetails.map((section) => (
                <SafetyCardDetail
                  key={section.title}
                  title={section.title}
                  cardList={section.cardList}
                />
              ))
            ) : (
              // 전달 정보 - 비활성화 (unavailableReason별 문구)
              <div className={styles.imgContainer}>
                <img
                  className={styles.lockImg}
                  src={resImgLock}
                  alt="접근 종료"
                />
                <span className="typoDisplaySmall">{unavailableMessage}</span>
              </div>
            )}
          </>
        )}
      </main>
      {toast && (
        <DefaultToast
          key={toast.id}
          message={toast.message}
          onHide={hideToast}
        />
      )}
    </div>
  );
}

export default ReceivedInfo;
