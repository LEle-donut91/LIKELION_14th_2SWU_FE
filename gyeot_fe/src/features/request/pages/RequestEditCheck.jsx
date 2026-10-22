// H-03-01-02
import styles from "@/features/request/pages/RequestEditCheck.module.css";
import StepHeader from "@/features/request/components/Header/StepHeader";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import UserInfo from "@/features/request/components/User/UserInfo";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import editCheckData from "@/features/request/api/editCheckData";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconHealthy from "@/shared/assets/icons/iconHealthy.svg";
import iconToggle from "@/shared/assets/icons/iconToggle.svg";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

function RequestEditCheck() {
  // JSON 데이터 변수에 각각 저장
  const { userName, userPart, beforeInfo, afterInfo } = editCheckData;
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

  const { handleGoBack, handleGoNext } = useRequestNav();
  const handleReconfirmBtnClick = () => {
    // API 호출 로직 추가 필요

    // H-03-01-A (요청 상세 · 요청자 뷰)로 이동
    handleGoNext("/request/requester");
  };

  return (
    <div className={styles.page}>
      <StepHeader title="요청 수정" step="2" onClick={handleGoBack} />

      {/* 실제 컨텐츠가 들어갈 자리 */}
      <main className={styles.content}>
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

        {/* 요청 대상 Card */}
        <UserInfo
          isAgain={false}
          state="받는 사람"
          userName={userName}
          part={userPart}
        />

        {/* 가이드 Text */}
        <span className={`${styles.guideTxt} typoBodySmall`}>
          확인 전까지 기존 내용과 접근 권한이 유지돼요.
          <br />
          담당자 거절 시, 요청이 취소되고 접근 권한이 회수돼요.
        </span>
      </main>

      {/* 하단 Footer */}
      <LargeFooter
        title="재확인 요청"
        type="primary"
        onClick={handleReconfirmBtnClick}
      />
    </div>
  );
}

export default RequestEditCheck;
