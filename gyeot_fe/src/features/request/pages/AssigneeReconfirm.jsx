// N-05
import styles from "@/features/request/pages/AssigneeReconfirm.module.css";
import reconfirmData from "@/features/request/api/reconfirmData";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconHealthy from "@/shared/assets/icons/iconHealthy.svg";
import iconToggle from "@/shared/assets/icons/iconToggle.svg";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import ExitHeader from "@/features/request/components/Header/ExitHeader";
import SmallFooter from "@/features/request/components/Footer/SmallFooter";

function AssigneeReconfirm() {
  // JSON 데이터 변수에 각각 저장
  const { userName, requestType, beforeInfo, afterInfo } = reconfirmData;
  const {
    time: beforeTime,
    location: beforeLocation,
    message: beforeMessage,
  } = beforeInfo;
  const {
    time: afterTime,
    location: afterLocation,
    message: afterMessage,
  } = afterInfo;

  // RequestSummary에 넘겨줄 infoList 배열 구성
  // 부모 컴포넌트에서 동적으로 아이콘, 라벨, 값을 묶어서 전달
  const beforeInfoList = [
    { icon: iconDate, label: "일정", value: beforeTime },
    { icon: iconLocation, label: "장소", value: beforeLocation },
    { icon: iconHealthy, label: "정보", value: beforeMessage },
  ];
  const afterInfoList = [
    { icon: iconDate, label: "일정", value: afterTime },
    { icon: iconLocation, label: "장소", value: afterLocation },
    { icon: iconHealthy, label: "정보", value: afterMessage },
  ];

  return (
    <div className={styles.page}>
      {/* 헤더 (닫기 버튼이 있는 컴포넌트) */}
      <ExitHeader
        title="변경 내용 확인"
        // onClick={}
      />
      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        {/* 요청자 정보 카드 */}
        <RequestSummary
          isAfterInfo={false}
          hasBeigeBorder={true}
          title={`${userName}님의 요청`}
          hasTag={true}
          type={requestType}
        />

        {/* 변경 전 - 변경 후 카드 Container */}
        <div className={styles.cardContainer}>
          {/* 변경 전 Card */}
          <RequestSummary
            isAfterInfo={false}
            hasBeigeBorder={false}
            title="변경 전"
            hasTag={false}
            infoList={beforeInfoList}
          />

          {/* Toggle 아이콘 이미지 */}
          <div className={styles.imgContainer}>
            <img className={styles.toggleImg} src={iconToggle} />
          </div>

          {/* 변경 후 Card */}
          <RequestSummary
            isAfterInfo={true}
            hasBeigeBorder={false}
            title="변경 후"
            hasTag={false}
            infoList={afterInfoList}
          />
        </div>
      </main>

      {/* 하단 Footer */}
      <SmallFooter
        leftType="tertiary"
        leftTitle="거절"
        rightTitle="확인"
        // leftOnClick={}
        // rightOnClick={}
      />
    </div>
  );
}

export default AssigneeReconfirm;
