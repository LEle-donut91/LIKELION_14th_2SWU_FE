// H-03-01-01
import styles from "@/features/request/pages/ReceivedInfo.module.css";

// 일반 라이브러리
import { useMemo } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// API, Services
import { getReceivedInfoApi } from "@/features/request/api/assigneeApi";
import { getReceivedInfoService } from "@/features/request/services/assigneeService";

// 일반 Components
import ExitHeader from "@/features/request/components/Header/ExitHeader";
import SafetyCardDetail from "@/features/request/components/SafetyCard/SafetyCardDetail";
import DueDateState from "@/features/request/components/State/DueDateState";

// Assets
import resImgLock from "@/shared/assets/images/resImgLock.png";

function ReceivedInfo() {
  const paramId = useParams().id; // path parameter (요청 ID)
  const { handleGoBack } = useRequestNav();

  // TODO: API 연동 시 useEffect로 교체 (조회 시 접근 이력이 남으므로 페이지 진입 시 1회만 호출)
  // [H-03-01-01] 전달받은 정보 - 데이터 조회 (가공은 service에서 처리)
  const { isAccessible, dueDate, unavailableMessage, safetyCardDetails } =
    useMemo(
      () => getReceivedInfoService(getReceivedInfoApi(paramId)),
      [paramId],
    );

  return (
    <div className={styles.page}>
      <ExitHeader title="전달받은 정보" onClick={handleGoBack} />

      <main className={styles.content}>
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
      </main>
    </div>
  );
}

export default ReceivedInfo;
