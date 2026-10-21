// H-03-01-A
import styles from "@/features/request/pages/RequestRequester.module.css";
import SmallFooter from "@/features/request/components/Footer/SmallFooter";
import RequestStep from "@/features/request/components/Request/RequestStep";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import DueDateState from "@/features/request/components/State/DueDateState";
import RequestState from "@/features/request/components/State/RequestState";
import UserOrder from "@/features/request/components/User/UserOrder";
import UserState from "@/features/request/components/User/UserState";
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconResGradientRadial from "@/shared/assets/icons/iconResGradientRadial.svg";
import resImgWith from "@/shared/assets/images/resImgWith.png";
import requesterData from "@/features/request/api/requesterData.json";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";
import { useState } from "react";

function RequestRequester() {
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열기/닫기 상태
  const { handleGoBack, handleGoNext } = useRequestNav(); // navigation 커스텀 훅의 함수 불러오기

  // JSON 데이터 불러오기
  const {
    requestState,
    userName,
    requestType,
    time,
    location,
    message,
    dueDate,
    assignStatus,
    changeStatus,
    userList,
  } = requesterData;
  const isAssignedNoti = assignStatus.isAssignedNoti;
  const reason = assignStatus.reason;
  const isChanged = changeStatus.isChanged;
  const isChangedConfirm = changeStatus.isChangedConfirm;

  // reason 텍스트 매핑 객체 (영어 -> 한글)
  const REASON_TEXT_MAP = {
    DIFFICULTY: "진행 어려움 응답",
    EXPIRED: "응답 기한 경과",
  };

  // RequestSummary에 넘겨줄 infoList 배열 구성
  // 부모 컴포넌트에서 동적으로 아이콘, 라벨, 값을 묶어서 전달
  const infoList = [
    { icon: iconDate, label: "시간", value: time },
    { icon: iconLocation, label: "장소", value: location },
  ];

  // 버튼 클릭 이벤트 핸들러
  const handleEditBtnClick = () => handleGoNext("/request/edit");
  const handleAskAgainBtnClick = () => handleGoNext("/request/ask-again");
  const handleDoneBtnClick = () => {
    console.log("완료 버튼 클릭");
    // API 요청 로직 추가 필요
  };
  const handleModalConfirmClick = () => {
    console.log("모달의 confirm 버튼(요청 취소) 클릭");
    // API 호출 로직 추가 필요

    // 모달 닫기
    setModalOpen(false);
  };

  // 조건부 변수 정리
  const isAccpetState = requestState === "accept";
  const isRequestState = requestState === "request";
  const isProgressState = requestState === "progress";
  const isDoneState = requestState === "done";
  const isCancelState = requestState === "cancel";
  const hasUserState =
    isDoneState || (isAccpetState && isChanged && !isChangedConfirm);

  // 푸터 렌더링 함수
  const renderFooter = () => {
    if (isRequestState) {
      return isAssignedNoti ? (
        <SmallFooter
          leftType="secondary"
          leftTitle="수정"
          rightTitle="다른사람 요청"
          leftOnClick={handleEditBtnClick}
          rightOnClick={handleAskAgainBtnClick}
        />
      ) : (
        <LargeFooter
          title="수정"
          type="secondary"
          onClick={handleEditBtnClick}
        />
      );
    }

    if (isAccpetState) {
      return (
        <LargeFooter
          title="수정"
          type="secondary"
          onClick={handleEditBtnClick}
        />
      );
    }

    if (isProgressState) {
      return (
        <LargeFooter title="완료" type="primary" onClick={handleDoneBtnClick} />
      );
    }

    if (isDoneState || isCancelState) {
      return (
        <LargeFooter
          title="같은 내용 요청"
          type="secondary"
          onClick={handleAskAgainBtnClick}
        />
      );
    }

    return null;
  };

  return (
    <div className={styles.page}>
      <DefaultHeader
        title="요청 상세"
        // requestState가 "request/accept/progress"일때만 "취소" 버튼 타이틀 전달, 그 외에는 undefined
        subBtnTitle={
          isRequestState || isAccpetState || isProgressState
            ? "취소"
            : undefined
        }
        onClick={handleGoBack}
        onSubBtnClick={() => setModalOpen(!isModalOpen)}
      />

      {/* 실제 컨텐츠 위치 */}
      <div className={styles.content}>
        <div className={styles.stepContainer}>
          <RequestStep isRequester={true} state={requestState} />
        </div>

        {/* 요청 취소 상태 */}
        {isCancelState && (
          <div className={styles.requestStateContainer}>
            <RequestState
              isRequester={true}
              title="요청 취소"
              information="직접 취소했어요."
            />
          </div>
        )}

        {/* 담당자 없음 상태 */}
        {isRequestState && isAssignedNoti && (
          <div className={styles.requestStateContainer}>
            <RequestState
              isRequester={true}
              title="담당자 없음"
              information={REASON_TEXT_MAP[reason]}
            />
          </div>
        )}

        {/* 요청 내용 요약 카드 */}
        <RequestSummary
          isAfterInfo={false}
          title={`To. ${userName}`}
          hasTag={true}
          type={requestType}
          infoList={infoList}
          message={!isProgressState ? message : undefined}
        />

        {/* 응답 기한 */}
        {isRequestState && (
          <div className={styles.dueDateContainer}>
            <DueDateState
              isResponse={true}
              title="응답 기한"
              dueDate={dueDate}
            />
          </div>
        )}

        {/* 요청 대상 상태 컴포넌트 */}
        {hasUserState && (
          <div className={styles.useStateContainer}>
            <UserState
              userName={userName}
              userState={
                isDoneState
                  ? "*요청사항을 완료했어요!"
                  : "*수정사항을 확인 중이에요."
              }
            />
          </div>
        )}

        {/* 요청 대상 응답 기록 컴포넌트 */}
        {(isRequestState || isCancelState) && (
          <div className={styles.orderContainer}>
            <UserOrder
              title={
                isRequestState && isAssignedNoti
                  ? "부탁 순서"
                  : isCancelState
                    ? "부탁 순서"
                    : "요청 순서"
              }
              orderList={userList}
            />
          </div>
        )}

        {/* 진행 중 화면 */}
        {isProgressState && (
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
        modalOpen={isModalOpen}
        setModalOpen={setModalOpen}
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
        onConfirmClick={handleModalConfirmClick}
      />
    </div>
  );
}

export default RequestRequester;
