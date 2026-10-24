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
import {
  getDueDateText,
  getSelectedUserId,
} from "@/features/request/utils/requestUtils";
import { useState } from "react";
import { DUE_DATE_SECTIONS } from "@/features/request/constants/requestConstants";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import UserOption from "@/features/request/components/Option/UserOption";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import TimeSheet from "@/features/request/components/Sheet/TimeSheet";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

function AskAgain() {
  const { handleGoNext, handleGoBack } = useRequestNav();

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

  // 각 Sheet의 열림/닫힘 상태(State) 정의
  const [isUserSheetOpen, setUserSheetOpen] = useState(false);
  const [isDuedateSheetOpen, setDuedateSheetOpen] = useState(false);

  // 다음 버튼 클릭 이벤트 핸들러
  const handleNextBtnClick = () => {
    // API 호출 로직 추가 필요

    handleGoNext("/request/info-preview");
  };

  return (
    <div className={styles.page}>
      {/* 기본 헤더 */}
      <DefaultHeader title="다시 부탁하기" onClick={handleGoBack} />

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
          text={getSelectedUserId(userLst, userId)}
          border={userId ? "borderActive" : "borderDefault"}
          width="large"
          onClick={() => setUserSheetOpen(true)}
        />
        <DefaultSheet
          isOpen={isUserSheetOpen}
          onClose={() => setUserSheetOpen(false)}
          title="요청 대상"
          description="상황에 참여한 사람들에게만 요청을 보낼 수 있어요."
          value={userId}
          onConfirm={setUserId}
        >
          {(temp, setTemp) => (
            <UserOption
              data={userLst}
              selectedValue={temp}
              onSelect={setTemp}
            />
          )}
        </DefaultSheet>

        {/* 응답 기한 */}
        <SelectSection
          title="응답 기한 *"
          text={getDueDateText(dueDate)}
          border={dueDate ? "borderActive" : "borderDefault"}
          width="large"
          onClick={() => setDuedateSheetOpen(true)}
        />
        <TimeSheet
          isOpen={isDuedateSheetOpen}
          onClose={() => setDuedateSheetOpen(false)}
          value={dueDate}
          onConfirm={setDueDate}
        >
          {(temp, setTemp) => (
            <DateTimeOption
              sections={DUE_DATE_SECTIONS}
              value={temp}
              onChange={setTemp}
            />
          )}
        </TimeSheet>
      </div>

      {/* 하단 푸터 */}
      <LargeFooter title="다음" type="primary" onClick={handleNextBtnClick} />
    </div>
  );
}

export default AskAgain;
