/**
 * =====================================================================
 * [N-05] 변경 내용 확인
 * - 페이지 컴포넌트
 * =====================================================================
 */

import styles from "@/features/request/pages/AssigneeReconfirm.module.css";

// 일반 라이브러리
import { useState } from "react";
import { useParams } from "react-router-dom";

// icons/images
import iconToggle from "@/shared/assets/icons/iconToggle.svg";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestDetailQuery } from "@/features/request/hooks/queries/useRequestDetailQuery";
import { useReconfirmMutations } from "@/features/request/hooks/mutations/useReconfirmMutations";
import { useErrorToast } from "@/features/request/hooks/useErrorToast";
import { useToast } from "@/shared/hooks/useToast";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";

// Services
import { getAssigneeReconfirmService } from "@/features/request/services/reconfirmService";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SmallFooter from "@/shared/components/SmallFooter/SmallFooter";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
import DefaultToast from "@/shared/components/Toast/DefaultToast";

function AssigneeReconfirm() {
  const paramId = useParams().id;
  const { handleGoBack, handleGoNext } = useRequestNav();
  const { toast, showToast, hideToast } = useToast();

  // [변경 내용 거절] 모달
  const [isModalOpen, setModalOpen] = useState(false);

  // 1. 요청 상세 조회 API
  const {
    data: detail,
    isPending,
    error,
  } = useRequestDetailQuery(paramId, {
    select: getAssigneeReconfirmService,
  });

  // API 응답 데이터 (정제된 형태)
  const { proposalId, userName, requestType, beforeInfoList, afterInfoList } =
    detail ?? {};

  // 2. 재확인 수락 / 재확인 거절 API
  const { acceptReconfirmation, rejectReconfirmation } = useReconfirmMutations({
    requestId: paramId,
    proposalId,
    showToast,
    onAccepted: () => handleGoBack(),
    onRejected: () => {
      setModalOpen(false);
      handleGoNext(REQUEST_ROUTES.home, true);
    },
  });

  // API 에러 메시지 출력
  useErrorToast(showToast, error);

  return (
    <div className={styles.page}>
      {/* 헤더 (닫기 버튼이 있는 컴포넌트) */}
      <SubpageHeader
        hasBackButton={false}
        hasCloseButton
        title="변경 내용 확인"
        onCloseClick={() => handleGoBack()}
      />

      {isPending && (
        <div className={styles.content}>
          <p role="status">요청 정보를 불러오는 중이에요.</p>
        </div>
      )}
      {detail && (
        <>
          {/* 메인 컨텐츠 */}
          <main className={styles.content}>
            {/* 요청자 정보 카드 */}
            <RequestSummary
              isAfterInfo={false}
              hasBeigeBorder={true}
              title={`${userName}님의 요청`}
              hasTag={true}
              type={requestType}
            />

            {/* 변경 전 - 변경 후 카드 Container */}
            <div className={styles.cardContainer}>
              {/* 변경 전 Card */}
              <RequestSummary
                isAfterInfo={false}
                hasBeigeBorder={false}
                title="변경 전"
                hasTag={false}
                infoList={beforeInfoList}
              />

              {/* Toggle 아이콘 이미지 */}
              <div className={styles.imgContainer}>
                <img className={styles.toggleImg} src={iconToggle} />
              </div>

              {/* 변경 후 Card */}
              <RequestSummary
                isAfterInfo={true}
                hasBeigeBorder={false}
                title="변경 후"
                hasTag={false}
                infoList={afterInfoList}
              />
            </div>
          </main>

          {/* 하단 Footer */}
          {proposalId && (
            <SmallFooter
              leftType="tertiary"
              leftTitle="거절"
              rightTitle="확인"
              leftOnClick={() => setModalOpen(true)}
              rightOnClick={acceptReconfirmation}
            />
          )}

          {/* 변경 내용 거절 */}
          <DefaultModal
            modalOpen={isModalOpen}
            setModalOpen={setModalOpen}
            title="변경 내용 거절"
            description={
              <>
                요청이 취소되고, 정보 접근 권한이 회수돼요.
                <br />
                거절은 돌이킬 수 없어요.
              </>
            }
            cancelTxt="돌아가기"
            confirmTxt="거절"
            onConfirmClick={rejectReconfirmation}
          />
        </>
      )}
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

export default AssigneeReconfirm;
