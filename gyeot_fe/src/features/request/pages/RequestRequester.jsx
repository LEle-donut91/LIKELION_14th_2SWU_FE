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
  // 담당자 없음의 사유(reason)를 한글 텍스트로 변환해 주는 매핑 객체
  const REASON_TEXT_MAP = {
    DIFFICULTY: "진행 어려움 응답",
    EXPIRED: "응답 기한 경과",
  };

  // RequestSummary에 넘겨줄 infoList 배열 구성
  // 부모 컴포넌트에서 동적으로 아이콘, 라벨, 값을 묶어서 전달
  const infoList = [
    {
      icon: iconDate,
      label: "시간",
      value: requesterData.time,
    },
    {
      icon: iconLocation,
      label: "장소",
      value: requesterData.location,
    },
  ];

  // 모달의 열림/닫힘 상태(State) 정의
  const [isModalOpen, setModalOpen] = useState(false);

  const { handleGoBack, handleGoNext } = useRequestNav();

  // 푸터 클릭 이벤트 핸들러
  const handleEditBtnClick = () => {
    handleGoNext("/request/edit");
  };
  const handleDoneBtnClick = () => {
    console.log("완료 버튼 클릭");
    // API 요청 로직 추가 필요
  };
  const handleAskAgainBtnClick = () => {
    handleGoNext("/request/ask-again");
  };

  // 모달의 confirm 버튼 (요청 취소) 클릭 이벤트 핸들러
  const handleModalConfirmClick = () => {
    console.log("모달의 confirm 버튼(요청 취소) 클릭");
    // API 호출 로직 추가 필요

    // 모달 닫기
    setModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <DefaultHeader
        title="요청 상세"
        // requestState가 "request/accept/progress"일때만 "취소" 버튼 타이틀 전달, 그 외에는 undefined
        subBtnTitle={
          ["request", "accept", "progress"].includes(requesterData.requestState)
            ? "취소"
            : undefined
        }
        onClick={handleGoBack}
        onSubBtnClick={() => setModalOpen(!isModalOpen)}
      />
      <div className={styles.content}>
        <div className={styles.stepContainer}>
          <RequestStep isRequester={true} state={requesterData.requestState} />
        </div>

        {/* 조건 1: requestState가 "cancel"일 땐 반드시 출력 */}
        {requesterData.requestState === "cancel" && (
          <div className={styles.requestStateContainer}>
            <RequestState
              isRequester={true}
              title="요청 취소"
              information="직접 취소했어요."
            />
          </div>
        )}

        {/* 조건 2: requestState가 "request"이고 isAssignedNoti가 true일 때만 출력 */}
        {requesterData.requestState === "request" &&
          requesterData.assignStatus.isAssignedNoti && (
            <div className={styles.requestStateContainer}>
              <RequestState
                isRequester={true}
                title="담당자 없음"
                information={REASON_TEXT_MAP[requesterData.assignStatus.reason]}
              />
            </div>
          )}

        <RequestSummary
          isAfterInfo={false}
          title={`To. ${requesterData.userName}`}
          hasTag={true}
          type={requesterData.requestType}
          infoList={infoList}
          message={
            requesterData.requestState !== "progress"
              ? requesterData.message
              : undefined
          }
        />

        {requesterData.requestState === "request" && (
          <div className={styles.dueDateContainer}>
            <DueDateState
              isResponse={true}
              title="응답 기한"
              dueDate={requesterData.dueDate}
            />
          </div>
        )}

        {/* 조건 1: requestState가 done이거나 accept일 때 
          조건 2: isChanged가 true이고 isChangedConfirm이 false일 때 */}
        {(requesterData.requestState === "done" ||
          requesterData.requestState === "accept") &&
          requesterData.changeStatus.isChanged === true &&
          requesterData.changeStatus.isChangedConfirm === false && (
            <div className={styles.useStateContainer}>
              <UserState
                userName={requesterData.userName}
                userState={
                  requesterData.requestState === "done"
                    ? "*요청사항을 완료했어요!"
                    : "*수정사항을 확인 중이에요."
                }
              />
            </div>
          )}

        {requesterData.requestState === "request" && (
          <div className={styles.orderContainer}>
            <UserOrder
              title={
                requesterData.assignStatus.isAssignedNoti
                  ? "부탁 순서"
                  : "요청 순서"
              }
              orderList={requesterData.userList}
            />
          </div>
        )}

        {requesterData.requestState === "cancel" && (
          <div className={styles.orderContainer}>
            <UserOrder title="부탁 순서" orderList={requesterData.userList} />
          </div>
        )}

        {requesterData.requestState === "progress" && (
          <div className={styles.progressContainer}>
            <div className={styles.imgContainer}>
              <img className={styles.imgBg} src={iconResGradientRadial}/>
              <img className={styles.withImg} src={resImgWith} />
            </div>
            <span className="typoDisplaySmall">
              {requesterData.userName}님과 요청사항을 진행 중이에요.
              <br />
              종료 시간은 늦출 수 없어요.
            </span>
          </div>
        )}
      </div>

      {/* 1. requestState가 "request"일 때 */}
      {requesterData.requestState === "request" &&
        (requesterData.assignStatus.isAssignedNoti ? (
          /* 1.1) isAssignedNoti가 true일 때 */
          <SmallFooter
            leftType="secondary"
            leftTitle="수정"
            rightTitle="다른사람 요청"
            leftOnClick={handleEditBtnClick}
            rightOnClick={handleAskAgainBtnClick}
          />
        ) : (
          /* 1.2) isAssignedNoti가 false일 때 */
          <LargeFooter
            title="수정"
            type="secondary"
            onClick={handleEditBtnClick}
          />
        ))}

      {/* 2. requestState가 "accept"일 때 */}
      {requesterData.requestState === "accept" && (
        <LargeFooter
          title="수정"
          type="secondary"
          onClick={handleEditBtnClick}
        />
      )}

      {/* 3. requestState가 "progress"일 때 */}
      {requesterData.requestState === "progress" && (
        <LargeFooter title="완료" type="primary" onClick={handleDoneBtnClick} />
      )}

      {/* 4. requestState가 "done" 또는 "cancel"일 때 */}
      {["done", "cancel"].includes(requesterData.requestState) && (
        <LargeFooter
          title="같은 내용 요청"
          type="secondary"
          onClick={handleAskAgainBtnClick}
        />
      )}

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
