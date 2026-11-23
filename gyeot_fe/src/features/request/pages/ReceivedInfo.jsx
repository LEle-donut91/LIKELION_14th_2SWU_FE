// H-03-01-01
import styles from "@/features/request/pages/ReceivedInfo.module.css";

// 일반 라이브러리
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useReceivedInfoQuery } from "@/features/request/hooks/queries/useReceivedInfoQuery";
import { useToastStore } from "@/shared/stores/useToastStore";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SafetyCardDetail from "@/features/request/components/SafetyCard/SafetyCardDetail";
import DueDateState from "@/features/request/components/State/DueDateState";
import Toast from "@/shared/components/Toast/Toast";

// Assets
import resImgLock from "@/shared/assets/images/resImgLock.png";

function ReceivedInfo() {
  const paramId = useParams().id;
  const { handleGoBack } = useRequestNav();
  const showToast = useToastStore((state) => state.showToast);

  // 전달받은 정보 조회 API
  const {
    data: receivedInfo,
    isFetchedAfterMount,
    isFetching,
    isSuccess,
  } = useReceivedInfoQuery(paramId, { showToast });

  // 이번 진입 후 조회가 성공한 경우에만 표시하고, 재조회 중·실패 시 캐시를 숨김
  const canShowReceivedInfo = isFetchedAfterMount && isSuccess && !isFetching;

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

      {canShowReceivedInfo && (
<>
      <main className={styles.content}>
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
</>
      )}
      <Toast />
    </div>
  );
}

export default ReceivedInfo;
