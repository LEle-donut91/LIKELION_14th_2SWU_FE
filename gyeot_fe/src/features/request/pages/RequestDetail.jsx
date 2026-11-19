import { Fragment, useEffect, useState } from "react";
import { useRequestErrorStore } from "@/features/request/stores/useRequestErrorStore";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useParams } from "react-router-dom";
import styles from "./RequestDetail.module.css";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestDetailQuery } from "@/features/request/hooks/queries/useRequestDetailQuery";
import { useRequestDetailMutations } from "@/features/request/hooks/mutations/useRequestDetailMutations";
import { useToast } from "@/shared/hooks/useToast";
import { getRequestDetailService } from "@/features/request/services/requestDetailService";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_ERROR_TARGET_PAGE } from "@/features/request/constants/requestErrorConstants";
import { RESPONSE_STATUS } from "@/features/request/constants/enumConstants";
import { REQUESTER_CANCEL_BTN_TITLE } from "@/features/request/constants/requesterViewConstants";

import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SmallFooter from "@/shared/components/SmallFooter/SmallFooter";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import RequestStep from "@/features/request/components/Request/RequestStep";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import DueDateState from "@/features/request/components/State/DueDateState";
import RequestState from "@/features/request/components/State/RequestState";
import UserOrder from "@/features/request/components/User/UserOrder";
import UserState from "@/features/request/components/User/UserState";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import iconResGradientRadial from "@/shared/assets/icons/iconResGradientRadial.svg";
import resImgWith from "@/shared/assets/images/resImgWith.png";

function RequestDetail() {
  const { id: paramId } = useParams();
  const { handleGoBack, handleGoNext, handleGoNextWithState } = useRequestNav();
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isSameModalOpen, setSameModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const initForm = useRequestFormStore((state) => state.initForm);

  // 1. 요청 상세 조회 API (응답의 viewerRole로 화면이 결정됨)
  const {
    data: detail,
    isPending,
    refetch: refetchDetail,
  } = useRequestDetailQuery(paramId, {
    showToast,
    select: getRequestDetailService,
  });

  // 2. 요청 취소 / 수락 철회 / 수정안 철회 / 돌봄 시작 / 돌봄 완료 / 요청 응답 API
  const {
    cancelRequest,
    withdrawAcceptance,
    withdrawProposal,
    startCare,
    completeCare,
    respondToRequest,
  } = useRequestDetailMutations(paramId, {
    showToast,
    onAcceptanceWithdrawn: () => handleGoNext(REQUEST_ROUTES.home, true),
  });

  // 다른 페이지에서 전달 받은 에러 처리
  useEffect(() => {
    const { error, setError } = useRequestErrorStore.getState();
    if (error?.targetPage !== REQUEST_ERROR_TARGET_PAGE.REQUEST_DETAIL || error.requestId !== paramId) return;
    setError(null);
    refetchDetail({ cancelRefetch: false });
  }, [paramId, refetchDetail]);

  // API 응답 데이터 (정제된 형태)
  const {
    situationId,
    proposalId,
    stepState,
    userName,
    userId,
    requestType,
    message,
    dueDate,
    initialDueDate,
    infoList,
    userList,
    flags = {},
    notices = [],
    notice,
    footerConfig,
    role,
    isRequester = false,
    isAssignee = false,
    isTarget = false,
    orderTitle,
    userStateText,
    safetyInformation,
    guideLines = [],
  } = detail ?? {};

  // Header별 action 연결
  const headerActions = {
    requester: {
      text: flags.isCancelable ? REQUESTER_CANCEL_BTN_TITLE : undefined,
      onClick: () => setCancelModalOpen(true),
    },
    assignee: {
      text: flags.showWithdrawBtn ? "철회" : undefined,
      onClick: flags.showWithdrawBtn
        ? () => setWithdrawModalOpen(true)
        : undefined,
    },
    target: {
      text: flags.showHoldBtn ? "보류" : undefined,
      onClick: flags.showHoldBtn ? footerActions.hold : undefined,
    },
  };
  const headerAction = headerActions[role] ?? {};

  // Footer별 action 연결
  const footerActions = {
    edit: () => handleGoNext(REQUEST_ROUTES.editForm(paramId)),
    askAgain: () => handleGoNext(REQUEST_ROUTES.askAgain(paramId)),
    withdraw: () => setWithdrawModalOpen(true),
    withdrawProposal: () => withdrawProposal(proposalId),
    done: completeCare,
    sameRequest: () => setSameModalOpen(true),
    checkChange: () => handleGoNext(REQUEST_ROUTES.assigneeReconfirm(paramId)),
    start: startCare,
    pastSituation: () =>
      handleGoNextWithState(
        REQUEST_ROUTES.pastSituationDetail,
        { situationId },
        true,
      ),
    hold: () => respondToRequest(RESPONSE_STATUS.CHECK_LATER),
    refuse: () => respondToRequest(RESPONSE_STATUS.UNAVAILABLE),
    accept: () => respondToRequest(RESPONSE_STATUS.AVAILABLE),
    changeToRefuse: () => respondToRequest(RESPONSE_STATUS.UNAVAILABLE),
    changeToAccept: () => respondToRequest(RESPONSE_STATUS.AVAILABLE),
  };

  // [요청 취소] 모달의 confirm 버튼 핸들러
  const handleCancelConfirm = () => {
    setCancelModalOpen(false);
    cancelRequest();
  };

  // "같은 내용 요청" 버튼 핸들러
  const handleSameConfirm = () => {
    setSameModalOpen(false);
    initForm(situationId, {
      situationId,
      userId,
      dueDate: initialDueDate,
    });
    handleGoNext(REQUEST_ROUTES.request(situationId));
  };

  // [수락 철회] 모달의 confirm 버튼 핸들러
  const handleWithdrawConfirm = () => {
    setWithdrawModalOpen(false);
    withdrawAcceptance();
  };

  return (
    <div className={`${styles.page} ${styles[role]}`}>
      <SubpageHeader
        title={isTarget ? "받은 요청" : "요청 상세"}
        rightText={headerAction.text}
        onBackClick={() => handleGoBack()}
        onRightTextClick={headerAction.onClick}
      />
      {isPending && (
        <div className={styles.content}>
          <p role="status">요청 정보를 불러오는 중이에요.</p>
        </div>
      )}
      {detail && (
        <>
          <div className={styles.content}>
            {!isTarget && (
              <div className={styles.stepContainer}>
                <RequestStep isRequester={isRequester} state={stepState} />
              </div>
            )}
            {notices.map(({ key, title, information }) => (
              <div className={styles.requestStateContainer} key={key}>
                <RequestState title={title} information={information} />
              </div>
            ))}
            {isAssignee && flags.showChangedNotice && (
              <RequestState
                isAssignee={true}
                title="요청 수정"
                information="수정된 정보를 확인해 주세요."
              />
            )}
            {notice && (
              <RequestState
                isAssignee={false}
                title={notice.title}
                information={notice.information}
              />
            )}
            <RequestSummary
              isAfterInfo={false}
              hasBeigeBorder={true}
              title={isRequester ? `To. ${userName}` : `${userName}님의 요청`}
              hasTag={true}
              type={requestType}
              infoList={infoList}
              message={isRequester && !flags.showMessage ? undefined : message}
            />
            {flags.showDueDate && (
              <div className={styles.dueDateContainer}>
                <DueDateState
                  isResponse={true}
                  isDeadline={true}
                  title="응답 기한"
                  dueDate={dueDate}
                />
              </div>
            )}
            {isAssignee && (
              <SafetyCardGroup
                title="전달받은 정보"
                information={safetyInformation}
                onClick={() =>
                  handleGoNext(REQUEST_ROUTES.receivedInfo(paramId))
                }
              />
            )}
            {isAssignee && flags.showDoneNotice && (
              <span className={`${styles.doneNotice} typoBodySmall`}>
                완료된 요청은 다시 열 수 없어요
              </span>
            )}
            {isRequester && flags.showUserState && (
              <div className={styles.useStateContainer}>
                <UserState userName={userName} userState={userStateText} />
              </div>
            )}
            {isRequester && flags.showUserOrder && (
              <div className={styles.orderContainer}>
                <UserOrder title={orderTitle} orderList={userList} />
              </div>
            )}
            {isRequester && flags.showProgress && (
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
          {footerConfig &&
            (footerConfig.size === "small" ? (
              <SmallFooter
                leftType={footerConfig.leftType}
                rightType={footerConfig.rightType}
                leftTitle={footerConfig.leftTitle}
                rightTitle={footerConfig.rightTitle}
                leftOnClick={footerActions[footerConfig.leftAction]}
                rightOnClick={footerActions[footerConfig.rightAction]}
              />
            ) : (
              <LargeFooter
                title={footerConfig.title}
                type={footerConfig.type}
                onClick={footerActions[footerConfig.action]}
              />
            ))}
          {isRequester && (
            <>
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
            </>
          )}
          {isAssignee && (
            <DefaultModal
              modalOpen={isWithdrawModalOpen}
              setModalOpen={setWithdrawModalOpen}
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
          )}
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

export default RequestDetail;
