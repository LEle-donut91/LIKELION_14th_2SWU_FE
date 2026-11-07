/**
 * =====================================================================
 * [H-03-01-A] 요청 상세 · 요청자 뷰
 * - 페이지 컴포넌트
 * =====================================================================
 */

import styles from "@/features/request/pages/RequestRequester.module.css";

// 일반 라이브러리
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// icons/images
import iconResGradientRadial from "@/shared/assets/icons/iconResGradientRadial.svg";
import resImgWith from "@/shared/assets/images/resImgWith.png";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import {
  REQUESTER_CANCEL_BTN_TITLE,
  REQUESTER_FOOTER_CONFIG,
  REQUEST_FORM_FIELD_KEY,
} from "@/features/request/constants/requestConstants";

// API, Services
import {
  getRequesterApi,
  patchEditWithdrawApi,
  patchRequestDoneApi,
  patchRequestCancelApi,
} from "@/features/request/api/requesterApi";
import { getRequesterService } from "@/features/request/services/requesterService";

// 일반 Components
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import SmallFooter from "@/features/request/components/Footer/SmallFooter";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import RequestStep from "@/features/request/components/Request/RequestStep";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import DueDateState from "@/features/request/components/State/DueDateState";
import RequestState from "@/features/request/components/State/RequestState";
import UserOrder from "@/features/request/components/User/UserOrder";
import UserState from "@/features/request/components/User/UserState";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";

function RequestRequester() {
  const paramId = useParams().id; // path parameter (요청 ID)
  const { handleGoBack, handleGoNext, handleGoNextWithState } = useRequestNav();

  const [isCancelModalOpen, setCancelModalOpen] = useState(false); // "요청 취소" 모달
  const [isSameModalOpen, setSameModalOpen] = useState(false); // "같은 내용 요청" 모달

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  // [H-03-01] 요청 상세(요청자 뷰) - 데이터 조회 (가공/조건 계산은 service에서 처리)
  const {
    situationId,
    requestState,
    userName,
    userId,
    requestType,
    message,
    dueDate,
    initialDueDate,
    infoList,
    userList,
    flags,
    notices,
    footerKey,
    orderTitle,
    userStateText,
  } = useMemo(() => getRequesterService(getRequesterApi(paramId)), [paramId]);

  // 푸터 버튼 action 이름 -> 클릭 핸들러 (REQUESTER_FOOTER_CONFIG의 action 값과 연결)
  const footerActions = {
    edit: () => handleGoNext(REQUEST_ROUTES.editForm(paramId)),
    askAgain: () => handleGoNext(REQUEST_ROUTES.askAgain(paramId)),
    withdraw: () => {
      // API 호출 로직 수정 필요
      patchEditWithdrawApi(paramId);
      // TODO: 수정 철회 후 데이터 재조회
    },
    done: () => {
      // API 호출 로직 수정 필요
      patchRequestDoneApi(paramId);
      // TODO: 완료 후 데이터 재조회
    },
    sameRequest: () => setSameModalOpen(true),
  };

  // API 호출 로직 수정 필요
  // [요청 취소 모달의 확인 버튼] 클릭 이벤트 핸들러
  const handleCancelConfirm = () => {
    patchRequestCancelApi(paramId);
    setCancelModalOpen(false);
    // TODO: 취소 후 데이터 재조회
  };

  // [같은 내용 요청 모달의 확인 버튼] 클릭 이벤트 핸들러
  const handleSameConfirm = () => {
    setSameModalOpen(false); // 모달 닫기

    // H-03-02(요청 작성)로 이동하며 "상황 ID, 요청 대상 ID, 응답 기한" 전달
    handleGoNextWithState(REQUEST_ROUTES.request(situationId), {
      [REQUEST_FORM_FIELD_KEY.USER_ID]: userId,
      [REQUEST_FORM_FIELD_KEY.DUE_DATE]: initialDueDate,
    });
  };

  // 푸터 렌더링 (설정은 REQUESTER_FOOTER_CONFIG, 종류는 service에서 결정)
  const renderFooter = () => {
    const config = REQUESTER_FOOTER_CONFIG[footerKey];
    if (!config) return null;

    if (config.size === "small") {
      return (
        <SmallFooter
          leftType={config.leftType}
          rightType={config.rightType}
          leftTitle={config.leftTitle}
          rightTitle={config.rightTitle}
          leftOnClick={footerActions[config.leftAction]}
          rightOnClick={footerActions[config.rightAction]}
        />
      );
    }

    return (
      <LargeFooter
        title={config.title}
        type={config.type}
        onClick={footerActions[config.action]}
      />
    );
  };

  return (
    <div className={styles.page}>
      <DefaultHeader
        title="요청 상세"
        subBtnTitle={
          flags.isCancelable ? REQUESTER_CANCEL_BTN_TITLE : undefined
        }
        onClick={() => handleGoBack()}
        onSubBtnClick={() => setCancelModalOpen(true)}
      />

      <div className={styles.content}>
        <div className={styles.stepContainer}>
          <RequestStep isRequester={true} state={requestState} />
        </div>

        {/* 알림 (요청 취소 / 담당자 없음 / 수정 무효) */}
        {notices.map(({ key, title, information }) => (
          <div className={styles.requestStateContainer} key={key}>
            <RequestState title={title} information={information} />
          </div>
        ))}

        {/* 요청 내용 요약 카드 */}
        <RequestSummary
          isAfterInfo={false}
          hasBeigeBorder={true}
          title={`To. ${userName}`}
          hasTag={true}
          type={requestType}
          infoList={infoList}
          message={flags.showMessage ? message : undefined}
        />

        {/* 응답 기한 */}
        {flags.showDueDate && (
          <div className={styles.dueDateContainer}>
            <DueDateState
              isResponse={true}
              title="응답 기한"
              dueDate={dueDate}
            />
          </div>
        )}

        {/* 요청 대상 상태 */}
        {flags.showUserState && (
          <div className={styles.useStateContainer}>
            <UserState userName={userName} userState={userStateText} />
          </div>
        )}

        {/* 요청 대상 응답 기록 */}
        {flags.showUserOrder && (
          <div className={styles.orderContainer}>
            <UserOrder title={orderTitle} orderList={userList} />
          </div>
        )}

        {/* 진행 중 화면 */}
        {flags.showProgress && (
          <div className={styles.progressContainer}>
            <div className={styles.imgContainer}>
              <img className={styles.imgBg} src={iconResGradientRadial} />
              <img className={styles.withImg} src={resImgWith} />
            </div>
            <span className="typoDisplaySmall">
              {userName}님과 요청사항을 진행 중이에요.
              <br />
              종료 시간은 늦출 수 없어요.
            </span>
          </div>
        )}
      </div>

      {/* Footer 렌더링 함수 호출 */}
      {renderFooter()}

      {/* 요청 취소 모달 */}
      <DefaultModal
        modalOpen={isCancelModalOpen}
        setModalOpen={setCancelModalOpen}
        title="요청 취소"
        description={
          <>
            담당자에게 취소가 전달되고,
            <br />
            정보 접근 권한이 바로 회수돼요.
            <br />
            취소하는 경우, 이전 상태로 돌아올 수 없어요.
          </>
        }
        cancelTxt="돌아가기"
        confirmTxt="요청 취소"
        onConfirmClick={handleCancelConfirm}
      />

      {/* 같은 내용 요청 모달 */}
      <DefaultModal
        modalOpen={isSameModalOpen}
        setModalOpen={setSameModalOpen}
        title="같은 내용 요청"
        description={
          <>
            내용을 복제하여 같은 내용으로
            <br />
            새로운 요청을 만들까요?
          </>
        }
        cancelTxt="취소"
        confirmTxt="복제 요청"
        onConfirmClick={handleSameConfirm}
      />
    </div>
  );
}

export default RequestRequester;
