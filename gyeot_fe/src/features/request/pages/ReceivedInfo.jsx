// H-03-01-01
import styles from "@/features/request/pages/ReceivedInfo.module.css";

// 일반 라이브러리
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useToast } from "@/shared/hooks/useToast";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

// API, Services
import {
  getReceivedInfoApi,
} from "@/features/request/api/getApi";
import { getReceivedInfoService } from "@/features/request/services/getService";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SafetyCardDetail from "@/features/request/components/SafetyCard/SafetyCardDetail";
import DueDateState from "@/features/request/components/State/DueDateState";
import DefaultToast from "@/shared/components/Toast/DefaultToast";

// Assets
import resImgLock from "@/shared/assets/images/resImgLock.png";

function ReceivedInfo() {
  const paramId = useParams().id; // path parameter (요청 ID)
  const { handleGoBack } = useRequestNav();

  const { toast, showToast, hideToast } = useToast();
  const { data: receivedInfo, isPending, error } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.receivedInfo(paramId),
    queryFn: () => getReceivedInfoApi(paramId),
    select: getReceivedInfoService,
    enabled: Boolean(paramId),

    // 조회 이력이 남으므로 화면 진입 시에만 새로 조회
    refetchOnWindowFocus: false, // 다른 탭/창으로 갔다가 돌아와도 자동 재조회 X
    refetchOnReconnect: false, // 끊겼던 네트워크가 복구됐을 때 자동 재조회 X
    retry: false, // 요청이 실패해도 자동으로 재시도 X
  });

  useEffect(() => {
    if (!error) return;
    showToast(error.response?.data?.message);
  }, [error, showToast]);

  const { isAccessible, dueDate, unavailableMessage, safetyCardDetails = [] } =
    receivedInfo ?? {};

  return (
    <div className={styles.page}>
      <SubpageHeader hasBackButton={false} hasCloseButton title="전달받은 정보" onCloseClick={handleGoBack} />

      <main className={styles.content}>
        {isPending && <p role="status">전달받은 정보를 불러오는 중이에요.</p>}
        {receivedInfo && (
          <>
        <DueDateState isResponse={false} title="접근 기한" dueDate={dueDate} />

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
            <img className={styles.lockImg} src={resImgLock} alt="접근 종료" />
            <span className="typoDisplaySmall">{unavailableMessage}</span>
          </div>
        )}
          </>
        )}
      </main>
      {toast && (
        <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
      )}
    </div>
  );
}

export default ReceivedInfo;
