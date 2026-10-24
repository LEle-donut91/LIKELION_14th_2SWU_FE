// H-03-01-B
import styles from "@/features/request/pages/RequestTarget.module.css";
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import DueDateState from "@/features/request/components/State/DueDateState";
import targetData from "@/features/request/api/targetData";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import RequestState from "@/features/request/components/State/RequestState";
import SmallFooter from "@/features/request/components/Footer/SmallFooter";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";

function RequestTarget() {
  // JSON 데이터 변수에 저장
  const {
    reqState,
    reqUser,
    reqType,
    reqTime,
    reqLocation,
    reqMsg,
    resDueDate,
  } = targetData;

  // 조건부 변수 정리
  const isBeforeState = reqState === "before";
  const isHoldState = reqState === "hold";
  const isRefusedState = reqState === "refused";
  const isCancelState = reqState === "cancel";
  const isExpiredState = reqState === "expired";
  const isPassState = reqState === "pass";

  // RequestSummary에 넘겨줄 infoList 배열 구성
  // 부모 컴포넌트에서 동적으로 아이콘, 라벨, 값을 묶어서 전달
  const infoList = [
    { icon: iconDate, label: "시간", value: reqTime },
    { icon: iconLocation, label: "장소", value: reqLocation },
  ];

  return (
    <div className={styles.page}>
      <DefaultHeader
        title="받은 요청"
        subBtnTitle={isBeforeState ? "보류" : undefined}
        // onClick={}
        // onSubBtnClick={}
      />
      <div className={styles.content}>
        {isCancelState && (
          <RequestState
            isAssignee={false}
            title="요청 취소"
            information="요청자가 취소했어요."
          />
        )}

        {isExpiredState && (
          <RequestState
            isAssignee={false}
            title="요청 만료"
            information="요청이 만료됐어요."
          />
        )}

        {isPassState && (
          <RequestState
            isAssignee={false}
            title="요청 취소"
            information="다른 사용자에게 요청이 넘어갔어요."
          />
        )}

        <RequestSummary
          isAfterInfo={false}
          hasBeigeBorder={true}
          title={`${reqUser}님의 요청`}
          hasTag={true}
          type={reqType}
          infoList={infoList}
          message={reqMsg}
        />
        {(isBeforeState || isHoldState || isRefusedState) && (
          <DueDateState
            isResponse={true}
            title="응답 기한"
            dueDate={resDueDate}
          />
        )}

        {(isHoldState || isRefusedState) && (
          <span className={`${styles.guideTxt} typoBodySmall`}>
            보류 중인 요청사항이에요.
            <br />
            보류 중 요청자가 취소할 경우, 응답할 수 없어요.
          </span>
        )}

        {(isCancelState || isExpiredState || isPassState) && (
          <span className={`${styles.guideTxt} typoBodySmall`}>
            더 이상 응답할 수 없어요.
          </span>
        )}
      </div>

      {isBeforeState && (
        <SmallFooter
          leftType="secondary"
          leftTitle="거절"
          rightTitle="수락"
          // leftOnClick={}
          // rightOnClick={}
        />
      )}

      {isHoldState && (
        <SmallFooter
          leftType="secondary"
          leftTitle="거절로 변경"
          rightTitle="수락으로 변경"
          // leftOnClick={}
          // rightOnClick={}
        />
      )}

      {isRefusedState && (
        <LargeFooter
          title="수락으로 변경"
          type="primary"
          // onClick={}
        />
      )}
    </div>
  );
}

export default RequestTarget;
