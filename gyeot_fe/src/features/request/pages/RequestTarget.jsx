/**
 * =====================================================================
 * [H-03-01-B] 요청 상세 · 대상자 뷰
 * - 페이지 컴포넌트
 * =====================================================================
 */

import styles from "@/features/request/pages/RequestTarget.module.css";

// 일반 라이브러리
import { Fragment, useMemo } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { TARGET_FOOTER_CONFIG } from "@/features/request/constants/requestConstants";

// API, Services
import {
  getTargetApi,
  patchTargetHoldApi,
  patchTargetRefuseApi,
  patchTargetAcceptApi,
  patchTargetChangeRefuseApi,
  patchTargetChangeAcceptApi,
} from "@/features/request/api/targetApi";
import { getTargetService } from "@/features/request/services/targetService";

// 일반 Components
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import SmallFooter from "@/features/request/components/Footer/SmallFooter";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import DueDateState from "@/features/request/components/State/DueDateState";
import RequestState from "@/features/request/components/State/RequestState";

function RequestTarget() {
  const paramId = useParams().id; // path parameter (요청 ID)
  const { handleGoBack, handleGoNext } = useRequestNav();

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  // 요청 상세(대상자 뷰) - 데이터 조회 (가공/조건 계산은 service에서 처리)
  const {
    userName,
    requestType,
    message,
    dueDate,
    infoList,
    flags,
    notice,
    footerKey,
    guideLines,
  } = useMemo(() => getTargetService(getTargetApi(paramId)), [paramId]);

  // 버튼 action 이름 -> 클릭 핸들러 (TARGET_FOOTER_CONFIG의 action 값과 연결)
  // TODO: API 연동 로직 수정 필요
  // TODO: API 연동 시 응답의 isSuccess 확인 후 재조회/이동 처리
  const targetActions = {
    // 보류 (헤더 우측 버튼)
    hold: () => {
      patchTargetHoldApi(paramId);
      // TODO: 재조회 필요
    },
    // 거절
    refuse: () => {
      patchTargetRefuseApi(paramId);
      // TODO: 재조회 필요
    },
    // 수락
    accept: () => {
      patchTargetAcceptApi(paramId);
      handleGoNext(REQUEST_ROUTES.assignee(paramId));
    },
    // 거절로 변경
    changeToRefuse: () => {
      patchTargetChangeRefuseApi(paramId);
      // TODO: 재조회 필요
    },
    // 수락으로 변경
    changeToAccept: () => {
      patchTargetChangeAcceptApi(paramId);
      handleGoNext(REQUEST_ROUTES.assignee(paramId));
    },
  };

  // 푸터 렌더링 (설정은 TARGET_FOOTER_CONFIG, 종류는 service에서 결정)
  const renderFooter = () => {
    const config = TARGET_FOOTER_CONFIG[footerKey];
    if (!config) return null;

    if (config.size === "small") {
      return (
        <SmallFooter
          leftType={config.leftType}
          rightType={config.rightType}
          leftTitle={config.leftTitle}
          rightTitle={config.rightTitle}
          leftOnClick={targetActions[config.leftAction]}
          rightOnClick={targetActions[config.rightAction]}
        />
      );
    }

    return (
      <LargeFooter
        title={config.title}
        type={config.type}
        onClick={targetActions[config.action]}
      />
    );
  };

  return (
    <div className={styles.page}>
      {/* 상단 헤더 */}
      <DefaultHeader
        title="받은 요청"
        subBtnTitle={flags.showHoldBtn ? "보류" : undefined}
        onClick={handleGoBack}
        onSubBtnClick={targetActions.hold}
      />

      {/* 실제 메인 컨텐츠 */}
      <div className={styles.content}>
        {/* 요청 상태 카드 (요청 취소 / 요청 만료 / 다른 사용자에게 넘어감) */}
        {notice && (
          <RequestState
            isAssignee={false}
            title={notice.title}
            information={notice.information}
          />
        )}

        {/* 요청 내용 요약 카드 */}
        <RequestSummary
          isAfterInfo={false}
          hasBeigeBorder={true}
          title={`${userName}님의 요청`}
          hasTag={true}
          type={requestType}
          infoList={infoList}
          message={message}
        />

        {/* 응답 기한 */}
        {flags.showDueDate && (
          <DueDateState isResponse={true} title="응답 기한" dueDate={dueDate} />
        )}

        {/* 안내 가이드 텍스트 */}
        {guideLines.length > 0 && (
          <span className={`${styles.guideTxt} typoBodySmall`}>
            {guideLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </span>
        )}
      </div>

      {/* 하단 Footer */}
      {renderFooter()}
    </div>
  );
}

export default RequestTarget;
