// H-03-01
import styles from "@/features/request/pages/RequestAssignee.module.css";
import RequestStep from "@/features/request/components/Request/RequestStep";
import RequestState from "@/features/request/components/State/RequestState";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import requestAssigneeData from "@/features/request/api/requestAssigneeData.json";
import { useRequestNav } from "@/features/request//hooks/useRequestNav";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";
import { useState } from "react";

function RequestAssignee() {
  const requestState = requestAssigneeData.requestState; // 요청 상태 ("accept", "progress", "done" 중 하나)
  const isChanged = requestAssigneeData.isChanged; // 요청이 수정되었는지 (true / false)

  // SafetyCardGroup의 information props 결정
  const getSafetyInformation = () => {
    if (requestState === "accept") {
      return "수락한 이후 확인할 수 있어요.";
    } else if (requestState === "done") {
      return "접근이 종료되었어요.";
    } else {
      return "";
    }
  };

  // LargeFooter의 title props 결정
  const getFooterTitle = () => {
    if (isChanged) {
      return "변경 내용 확인";
    }
    if (!isChanged && requestState === "accept") {
      return "시작";
    }
    if (!isChanged && requestState === "progress") {
      return "완료";
    }
    if (!isChanged && requestState === "done") {
      return "지난 상황에서 보기";
    }
    return "";
  };

  // RequestSummary에 넘겨줄 infoList 배열 구성
  // 부모 컴포넌트에서 동적으로 아이콘, 라벨, 값을 묶어서 전달
  const infoList = [
    {
      icon: iconDate,
      label: "시간",
      value: requestAssigneeData.time,
    },
    {
      icon: iconLocation,
      label: "장소",
      value: requestAssigneeData.location,
    },
  ];

  // 모달의 열림/닫힘 상태(State) 정의
  const [isModalOpen, setModalOpen] = useState(false);

  const { handleGoBack, handleGoNext, handleGoNextWithState } = useRequestNav();

  const handleWithdrawBtnClick = () => {
    handleGoNext("/home");
  };

  const handleSafetyBtnClick = () => {
    handleGoNext("/request/received-info");
  };

  /* Footer 버튼 클릭 이벤트 결정  */
  const getFooterOnClick = () => {
    if (isChanged) {
      return handleChangedBtnClick;
    }
    if (!isChanged && requestState === "accept") {
      return handleStartBtnClick;
    }
    if (!isChanged && requestState === "progress") {
      return handleDoneBtnClick;
    }
    if (!isChanged && requestState === "done") {
      return handlePastBtnClick;
    }

    return () => {};
  };

  const handleStartBtnClick = () => {
    console.log("시작 버튼 클릭");
    // 상태 변경 API 요청 로직 추가
  };

  const handleChangedBtnClick = () => {
    handleGoNext("/request/assignee-reconfirm");
  };

  const handleDoneBtnClick = () => {
    console.log("완료 버튼 클릭");
    // 상태 변경 API 요청 로직 추가
  };

  const handlePastBtnClick = () => {
    handleGoNextWithState("/situation/past/detail", {
      requestId: requestAssigneeData.requestId,
    });
  };

  return (
    <div className={styles.page}>
      <DefaultHeader
        title="요청 상세"
        {...(requestState === "accept" && { subBtnTitle: "철회" })}
        onClick={handleGoBack}
        onSubBtnClick={() => setModalOpen(!isModalOpen)}
      />
      <div className={styles.content}>
        <div className={styles.stepContainer}>
          <RequestStep isRequester={false} state={requestState} />
        </div>

        {/* 요청이 수정되었을 때만 표시 */}
        {isChanged && (
          <RequestState
            isRequester={false}
            title="요청 수정"
            information="수정된 정보를 확인해 주세요."
          />
        )}

        <RequestSummary
          isAfterInfo={false}
          title={`${requestAssigneeData.userName}님의 요청`}
          isRequester={false}
          infoList={infoList}
          message={requestAssigneeData.message}
        />

        <SafetyCardGroup
          title="전달받은 정보"
          information={getSafetyInformation()}
          onClick={handleSafetyBtnClick}
        />

        {/* 요청이 완료된 경우에만 span 태그 추가 */}
        {requestState === "done" && (
          <span className={`${styles.doneNotice} typoBodySmall`}>
            완료된 요청은 다시 열 수 없어요
          </span>
        )}
      </div>
      <LargeFooter
        title={getFooterTitle()}
        type="primary"
        onClick={getFooterOnClick()}
      />

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
        onConfirmClick={handleWithdrawBtnClick}
      />
    </div>
  );
}

export default RequestAssignee;
