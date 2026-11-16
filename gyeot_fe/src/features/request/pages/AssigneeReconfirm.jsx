/**
 * =====================================================================
 * [N-05] 변경 내용 확인
 * - 페이지 컴포넌트
 * =====================================================================
 */

import styles from "@/features/request/pages/AssigneeReconfirm.module.css";

// 일반 라이브러리
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// icons/images
import iconToggle from "@/shared/assets/icons/iconToggle.svg";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useToast } from "@/features/request/hooks/useToast";
import { getErrorMessage } from "@/shared/utils/apiError";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

// API, Services
import {
  getRequestDetailApi,
} from "@/features/request/api/getApi";
import {
  postAssigneeReconfirmAcceptApi,
  postAssigneeReconfirmRejectApi,
} from "@/features/request/api/postApi";
import { getAssigneeReconfirmService } from "@/features/request/services/getService";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SmallFooter from "@/shared/components/SmallFooter/SmallFooter";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
import DefaultToast from "@/shared/components/Toast/DefaultToast";

function AssigneeReconfirm() {
  const paramId = useParams().id; // path parameter (요청 ID)
  const { handleGoBack, handleGoNext } = useRequestNav();

  const [isModalOpen, setModalOpen] = useState(false); // "변경 내용 거절" 모달

  const { toast, showToast, hideToast } = useToast();
  const { data: detail, isPending, error } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.detail(paramId),
    queryFn: () => getRequestDetailApi(paramId),
    select: getAssigneeReconfirmService,
    enabled: Boolean(paramId),
  });

  useEffect(() => {
    if (!error) return;
    showToast(getErrorMessage(error));
  }, [error, showToast]);

  const { proposalId, userName, requestType, beforeInfoList, afterInfoList } =
    detail ?? {};

  // TODO: API 연동 시 응답의 isSuccess 확인 후 이동 처리
  // [Footer의 확인 버튼] 클릭 이벤트 핸들러
  const handleConfirmBtnClick = () => {
    if (!proposalId) return;
    postAssigneeReconfirmAcceptApi(paramId, proposalId);
    handleGoBack();
  };

  // [모달의 거절 버튼] 클릭 이벤트 핸들러
  const handleRejectConfirm = () => {
    if (!proposalId) return;
    postAssigneeReconfirmRejectApi(paramId, proposalId);
    setModalOpen(false);
    handleGoNext(REQUEST_ROUTES.home, true);
  };

  return (
    <div className={styles.page}>
      {/* 헤더 (닫기 버튼이 있는 컴포넌트) */}
      <SubpageHeader hasBackButton={false} hasCloseButton title="변경 내용 확인" onCloseClick={() => handleGoBack()} />

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
      {proposalId && <SmallFooter
        leftType="tertiary"
        leftTitle="거절"
        rightTitle="확인"
        leftOnClick={() => setModalOpen(true)}
        rightOnClick={handleConfirmBtnClick}
      />}

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
        onConfirmClick={handleRejectConfirm}
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
