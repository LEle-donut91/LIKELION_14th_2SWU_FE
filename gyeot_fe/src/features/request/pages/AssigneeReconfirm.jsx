/**
 * =====================================================================
 * [N-05] 변경 내용 확인
 * - 페이지 컴포넌트
 * =====================================================================
 */

import styles from "@/features/request/pages/AssigneeReconfirm.module.css";

// 일반 라이브러리
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// icons/images
import iconToggle from "@/shared/assets/icons/iconToggle.svg";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";

// API, Services
import {
  getAssigneeReconfirmApi,
  postAssigneeReconfirmAcceptApi,
  postAssigneeReconfirmRejectApi,
} from "@/features/request/api/assigneeApi";
import { getAssigneeReconfirmService } from "@/features/request/services/assigneeService";

// 일반 Components
import ExitHeader from "@/features/request/components/Header/ExitHeader";
import SmallFooter from "@/features/request/components/Footer/SmallFooter";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";

function AssigneeReconfirm() {
  const paramId = useParams().id; // path parameter (요청 ID)
  const { handleGoBack, handleGoNext } = useRequestNav();

  const [isModalOpen, setModalOpen] = useState(false); // "변경 내용 거절" 모달

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  // [N-05] 변경 내용 확인 - 데이터 조회 (가공은 service에서 처리)
  const { proposalId, userName, requestType, beforeInfoList, afterInfoList } =
    useMemo(
      () => getAssigneeReconfirmService(getAssigneeReconfirmApi(paramId)),
      [paramId],
    );

  // TODO: API 연동 시 응답의 isSuccess 확인 후 이동 처리
  // [Footer의 확인 버튼] 클릭 이벤트 핸들러
  const handleConfirmBtnClick = () => {
    postAssigneeReconfirmAcceptApi(paramId, proposalId);
    handleGoBack();
  };

  // [모달의 거절 버튼] 클릭 이벤트 핸들러
  const handleRejectConfirm = () => {
    postAssigneeReconfirmRejectApi(paramId, proposalId);
    setModalOpen(false);
    handleGoNext(REQUEST_ROUTES.home, true);
  };

  return (
    <div className={styles.page}>
      {/* 헤더 (닫기 버튼이 있는 컴포넌트) */}
      <ExitHeader title="변경 내용 확인" onClick={() => handleGoBack()} />

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
      <SmallFooter
        leftType="tertiary"
        leftTitle="거절"
        rightTitle="확인"
        leftOnClick={() => setModalOpen(true)}
        rightOnClick={handleConfirmBtnClick}
      />

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
    </div>
  );
}

export default AssigneeReconfirm;
