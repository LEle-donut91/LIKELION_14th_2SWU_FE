// H-03-01
import styles from "@/features/request/pages/RequestAssignee.module.css"
import RequestStep from "@/features/request/components/Request/RequestStep";
import RequestState from "@/features/request/components/State/RequestState";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";

function RequestAssignee() {
  // RequestSummary에 넘겨줄 infoList 배열 구성
  // 부모 컴포넌트에서 동적으로 아이콘, 라벨, 값을 묶어서 전달
  const infoList = [
    {
      icon: iconDate,
      label: "시간",
      value: "10/2(목) 14:00 - 15:00",
    },
    {
      icon: iconLocation,
      label: "장소",
      value: "슈슈병원",
    },
  ];

  return (
    <div className={styles.page}>
      <DefaultHeader
        title="요청 상세"
        subBtnTitle="철회"
        // onClick={}
      />
      <div className={styles.content}>
        <div className={styles.stepContainer}>
      <RequestStep isRequester={false} state="done" />
      </div>
      <RequestState
        isRequester={false}
        title="요청 수정"
        information="수정된 정보를 확인해주세요."
      />
      <RequestSummary
        isChanged={false}
        title="지우님의 요청"
        isRequester={false}
        infoList={infoList}
        message="병원에 가야하는 일이 생겼는데, 혼자 가기에 부담스러워요. 같이 가면 큰 도움이 될 것 같아요!"
      />
      <SafetyCardGroup
        title="전달받은 정보"
        information="수락한 이후 확인할 수 있어요."
        // onClick={}
      />
      </div>
      <LargeFooter
        title="시작"
        type="primary"
        // onClick={}
      />
    </div>
  );
}

export default RequestAssignee;
