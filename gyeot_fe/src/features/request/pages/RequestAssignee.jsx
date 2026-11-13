/**
 * =====================================================================
 * [H-03-01] 요청 상세 · 담당자 뷰
 * - 페이지 컴포넌트
 * =====================================================================
 */

import styles from "@/features/request/pages/RequestAssignee.module.css";

// 일반 라이브러리
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { ASSIGNEE_FOOTER_CONFIG } from "@/features/request/constants/requestConstants";

// API, Services
import {
  getAssigneeApi,
  postAssigneeStartApi,
  postAssigneeDoneApi,
  postAssigneeWithdrawApi,
} from "@/features/request/api/assigneeApi";
import { getAssigneeService } from "@/features/request/services/assigneeService";

// 일반 Components
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import RequestStep from "@/features/request/components/Request/RequestStep";
import RequestState from "@/features/request/components/State/RequestState";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";

function RequestAssignee() {
  const paramId = useParams().id; // path parameter (요청 ID)
  const { handleGoBack, handleGoNext, handleGoNextWithState } = useRequestNav();

  const [isModalOpen, setModalOpen] = useState(false); // "수락 철회" 모달

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  // [H-03-01] 요청 상세(담당자 뷰) - 데이터 조회 (가공/조건 계산은 service에서 처리)
  const {
    situationId,
    requestState,
    requestType,
    userName,
    message,
    infoList,
    flags,
    footerKey,
    safetyInformation,
  } = useMemo(() => getAssigneeService(getAssigneeApi(paramId)), [paramId]);

  // 푸터 설정 (ASSIGNEE_FOOTER_CONFIG에서 footerKey로 조회)
  const footerConfig = ASSIGNEE_FOOTER_CONFIG[footerKey];

  // 푸터 버튼 action 이름 -> 클릭 핸들러 (ASSIGNEE_FOOTER_CONFIG의 action 값과 연결)
  // TODO: API 연동 시 응답의 isSuccess 확인 후 재조회 처리
  const footerActions = {
    // 변경 내용 확인 -> N-05 (수정안 조회는 N-05 진입 시 수행)
    checkChange: () => handleGoNext(REQUEST_ROUTES.assigneeReconfirm(paramId)),
    // 시작
    start: () => {
      postAssigneeStartApi(paramId);
      // TODO: 시작 후 데이터 재조회
    },
    // 완료
    done: () => {
      postAssigneeDoneApi(paramId);
      // TODO: 완료 후 데이터 재조회
    },
    // 지난 상황에서 보기 -> 상황 ID 전달
    pastSituation: () =>
      handleGoNextWithState(
        REQUEST_ROUTES.pastSituationDetail,
        {
          situationId,
        },
        true,
      ),
  };

  // [모달의 철회 버튼] 클릭 이벤트 핸들러
  const handleWithdrawConfirm = () => {
    postAssigneeWithdrawApi(paramId);
    setModalOpen(false);
    handleGoNext(REQUEST_ROUTES.home, true);
  };

  // [전달받은 정보] 클릭 이벤트 핸들러
  const handleSafetyBtnClick = () =>
    handleGoNext(REQUEST_ROUTES.receivedInfo(paramId));

  return (
    <div className={styles.page}>
      <DefaultHeader
        title="요청 상세"
        subBtnTitle={flags.showWithdrawBtn ? "철회" : undefined}
        onClick={() => handleGoBack()}
        onSubBtnClick={
          flags.showWithdrawBtn ? () => setModalOpen(true) : undefined
        }
      />

      <div className={styles.content}>
        <div className={styles.stepContainer}>
          <RequestStep isRequester={false} state={requestState} />
        </div>

        {/* 요청이 수정되었을 때만 표시 */}
        {flags.showChangedNotice && (
          <RequestState
            isAssignee={true}
            title="요청 수정"
            information="수정된 정보를 확인해 주세요."
          />
        )}

        {/* 요청 내용 요약 카드 */}
        <RequestSummary
          isAfterInfo={false}
          hasBeigeBorder={true}
          hasTag={true}
          type={requestType}
          title={`${userName}님의 요청`}
          infoList={infoList}
          message={message}
        />

        {/* 전달받은 정보 */}
        <SafetyCardGroup
          title="전달받은 정보"
          information={safetyInformation}
          onClick={handleSafetyBtnClick}
        />

        {/* 요청이 완료된 경우에만 표시 */}
        {flags.showDoneNotice && (
          <span className={`${styles.doneNotice} typoBodySmall`}>
            완료된 요청은 다시 열 수 없어요
          </span>
        )}
      </div>

      {/* 하단 Footer (설정은 ASSIGNEE_FOOTER_CONFIG, 종류는 service에서 결정) */}
      {footerConfig && (
        <LargeFooter
          title={footerConfig.title}
          type={footerConfig.type}
          onClick={footerActions[footerConfig.action]}
        />
      )}

      {/* 수락 철회 모달 */}
      <DefaultModal
        modalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        title="수락 철회"
        description={
          <>
            철회 시 전달받은 정보가 모두 회수되며,
            <br />
            수락 상태로 돌아올 수 없습니다.
          </>
        }
        cancelTxt="취소"
        confirmTxt="철회"
        onConfirmClick={handleWithdrawConfirm}
      />
    </div>
  );
}

export default RequestAssignee;
