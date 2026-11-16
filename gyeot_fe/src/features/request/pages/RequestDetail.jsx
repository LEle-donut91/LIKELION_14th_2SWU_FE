import { getRequestDetailService } from "@/features/request/services/getService";
import { Fragment, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./RequestDetail.module.css";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import {
  REQUESTER_CANCEL_BTN_TITLE,
  REQUEST_FORM_FIELD_KEY,
} from "@/features/request/constants/requestConstants";
import {
  getRequestDetailApi,
} from "@/features/request/api/getApi";
import {
  patchEditWithdrawApi,
  patchRequestDoneApi,
  patchRequestCancelApi,
  patchTargetHoldApi,
  patchTargetRefuseApi,
  patchTargetAcceptApi,
  patchTargetChangeRefuseApi,
  patchTargetChangeAcceptApi,
} from "@/features/request/api/patchApi";
import {
  postAssigneeStartApi,
  postAssigneeDoneApi,
  postAssigneeWithdrawApi,
} from "@/features/request/api/postApi";

import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SmallFooter from "@/shared/components/SmallFooter/SmallFooter";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
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

  // TODO: 실제 API 연동 시 비동기 조회 및 변경 후 재조회 처리
  const detail = useMemo(
    () => getRequestDetailService(getRequestDetailApi(paramId)),
    [paramId],
  );
  const {
    situationId, stepState, userName, userId, requestType, message,
    dueDate, initialDueDate, infoList, userList, flags, notices = [],
    notice, footerConfig, role, orderTitle, userStateText, safetyInformation,
    guideLines = [],
  } = detail;
  const isRequester = role === "requester";
  const isAssignee = role === "assignee";
  const isTarget = role === "target";

  const acceptRequest = (api) => {
    api(paramId);
    handleGoNext(REQUEST_ROUTES.detail(paramId), true);
  };
  const footerActions = {
    edit: () => handleGoNext(REQUEST_ROUTES.editForm(paramId)),
    askAgain: () => handleGoNext(REQUEST_ROUTES.askAgain(paramId)),
    withdraw: () => patchEditWithdrawApi(paramId),
    done: () => isRequester
      ? patchRequestDoneApi(paramId)
      : postAssigneeDoneApi(paramId),
    sameRequest: () => setSameModalOpen(true),
    checkChange: () => handleGoNext(REQUEST_ROUTES.assigneeReconfirm(paramId)),
    start: () => postAssigneeStartApi(paramId),
    pastSituation: () => handleGoNextWithState(
      REQUEST_ROUTES.pastSituationDetail, { situationId }, true,
    ),
    hold: () => patchTargetHoldApi(paramId),
    refuse: () => patchTargetRefuseApi(paramId),
    accept: () => acceptRequest(patchTargetAcceptApi),
    changeToRefuse: () => patchTargetChangeRefuseApi(paramId),
    changeToAccept: () => acceptRequest(patchTargetChangeAcceptApi),
  };

  const handleCancelConfirm = () => {
    patchRequestCancelApi(paramId);
    setCancelModalOpen(false);
  };
  const handleSameConfirm = () => {
    setSameModalOpen(false);
    handleGoNextWithState(REQUEST_ROUTES.request(situationId), {
      [REQUEST_FORM_FIELD_KEY.USER_ID]: userId,
      [REQUEST_FORM_FIELD_KEY.DUE_DATE]: initialDueDate,
    });
  };
  const handleWithdrawConfirm = () => {
    postAssigneeWithdrawApi(paramId);
    setWithdrawModalOpen(false);
    handleGoNext(REQUEST_ROUTES.home, true);
  };
  const headerActions = {
    requester: {
      text: flags.isCancelable ? REQUESTER_CANCEL_BTN_TITLE : undefined,
      onClick: () => setCancelModalOpen(true),
    },
    assignee: {
      text: flags.showWithdrawBtn ? "철회" : undefined,
      onClick: flags.showWithdrawBtn ? () => setWithdrawModalOpen(true) : undefined,
    },
    target: {
      text: flags.showHoldBtn ? "보류" : undefined,
      onClick: flags.showHoldBtn ? footerActions.hold : undefined,
    },
  };
  const headerAction = headerActions[role];

  return (
    <div className={`${styles.page} ${styles[role]}`}>
      <SubpageHeader
        title={isTarget ? "받은 요청" : "요청 상세"}
        rightText={headerAction.text}
        onBackClick={() => handleGoBack()}
        onRightTextClick={headerAction.onClick}
      />
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
          <RequestState isAssignee={true} title="요청 수정" information="수정된 정보를 확인해 주세요." />
        )}
        {notice && (
          <RequestState isAssignee={false} title={notice.title} information={notice.information} />
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
            onClick={() => handleGoNext(REQUEST_ROUTES.receivedInfo(paramId))}
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
      {footerConfig && (footerConfig.size === "small" ? (
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
    </div>
  );
}

export default RequestDetail;
