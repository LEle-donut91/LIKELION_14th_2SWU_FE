// N-06
import styles from "@/features/request/pages/AskAgain.module.css";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconHealthy from "@/shared/assets/icons/iconHealthy.svg";
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import UserInfo from "@/features/request/components/User/UserInfo";
import SelectSection from "@/features/request/components/Section/SelectSection";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import askAgainData from "@/features/request/api/askAgainData";
import { getDueDateText } from "@/features/request/utils/requestUtils";
import { useState } from "react";

function AskAgain() {
  // JSON 데이터 변수에 저장
  const {
    reqType,
    reqTime,
    reqLocation,
    reqInfo,
    reqMsg,
    userRecord,
    userLst,
  } = askAgainData;

  const {
    name: userRecordName,
    part: userRecordPart,
    state: userRecordState,
  } = userRecord;

  // RequestSummary에 넘겨줄 infoList 배열 구성
  // 부모 컴포넌트에서 동적으로 아이콘, 라벨, 값을 묶어서 전달
  const infoList = [
    { icon: iconDate, label: "시간", value: reqTime },
    { icon: iconLocation, label: "장소", value: reqLocation },
    { icon: iconHealthy, label: "정보", value: reqInfo },
  ];

  // 각 선택 항목에 대한 상태(State) 정의
  const [userId, setUserId] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  // 선택된 ID를 통해 화면에 보여줄 텍스트(title) 찾기
  const selectedUser = userLst?.find((item) => item.id === userId);

  return (
    <div className={styles.page}>
      {/* 기본 헤더 */}
      <DefaultHeader
        title="다시 부탁하기"
        // onClick={}
      />

      <div className={styles.content}>
        {/* 요청 요약 카드 */}
        <RequestSummary
          isAfterInfo={false}
          hasBeighBorder={true}
          title="이전 요청 내용"
          hasTag={true}
          type={reqType}
          infoList={infoList}
          message={reqMsg}
        />

        {/* 대상 이력 */}
        <div className={styles.userContainer}>
          <span className={`${styles.userTitle} typoBodyStrong`}>
            대상 이력
          </span>
          <UserInfo
            isAgain={true}
            state={userRecordState}
            userName={userRecordName}
            part={userRecordPart}
          />
        </div>

        {/* 새 요청 대상 */}
        <SelectSection
          title="새 요청 대상 *"
          text={selectedUser ? selectedUser.userName : "한 명 선택"}
          border={userId ? "borderActive" : "borderDefault"}
          width="large"
          // onClick={}
        />

        {/* 응답 기한 */}
        <SelectSection
          title="응답 기한 *"
          text={getDueDateText(dueDate)}
          border={dueDate ? "borderActive" : "borderDefault"}
          width="large"
          // onClick={}
        />
      </div>

      {/* 하단 푸터 */}
      <LargeFooter
        title="다음"
        type="primary"
        // onClick={}
      />
    </div>
  );
}

export default AskAgain;
