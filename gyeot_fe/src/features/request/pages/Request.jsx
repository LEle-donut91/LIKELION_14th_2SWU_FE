// H-03-02
import styles from "@/features/request/pages/Request.module.css";

import StepHeader from "@/features/request/components/Header/StepHeader";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import RadioSection from "@/features/request/components/Section/RadioSection";
import SelectSection from "@/features/request/components/Section/SelectSection";
import InputSection from "@/features/request/components/Section/InputSection";
import situationData from "@/features/request/api/situationData.json";
import userData from "@/features/request/api/userData.json";
import SituationSheet from "@/features/request/components/Sheet/SituationSheet";
import UserSheet from "@/features/request/components/Sheet/UserSheet";
import DateTimeSheet from "@/features/request/components/Sheet/DateTimeSheet";
import DueDateSheet from "@/features/request/components/Sheet/DueDateSheet";
import { useState } from "react";

function Request() {
  // 각 선택 항목에 대한 상태(State) 정의
  const [situationId, setSituationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [locationValue, setLocationValue] = useState(null);
  const [contentValue, setContentValue] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  // 각 Sheet의 열림/닫힘 상태(State) 정의
  const [isSituationSheetOpen, setSituationSheetOpen] = useState(false);
  const [isUserSheetOpen, setUserSheetOpen] = useState(false);
  const [isDateTimeSheetOpen, setDateTimeSheetOpen] = useState(false);
  const [isDuedateSheetOpen, setDuedateSheetOpen] = useState(false);
  
  // 어떤 시트(시작 또는 종료)에서 DateTimeSheet를 열었는지 구분하기 위한 상태
  const [dateTarget, setDateTarget] = useState(null); 

  // 선택된 ID를 통해 화면에 보여줄 텍스트(title) 찾기
  const selectedSituation = situationData.find((item) => item.id === situationId);
  const selectedUser = userData?.find((item) => item.id === userId);

// 화면에 보여줄 응답 기한 텍스트 가공
  const getDueDateText = () => {
    if (!dueDate) return "선택";
    const { days, hours, minutes } = dueDate;
    if (!days && !hours && !minutes) return "선택";
    
    return `${days ? `${days}일 ` : ""}${hours ? `${hours}시간 ` : ""}${minutes ? `${minutes}분` : ""}`.trim();
  };

  return (
    <div className="page">
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="1" />

      {/* 메인 컨텐츠 */}
      <main>
        {/* 상황 */}
        <SelectSection
          title="상황 *"
          text={selectedSituation ? selectedSituation.title : "선택"}
          border={situationId ? "borderActive" : "borderDefault"}
          width="large"
          onClick={() => setSituationSheetOpen(true)}
        />

        <SituationSheet
          isOpen={isSituationSheetOpen}
          onClose={() => setSituationSheetOpen(false)}
          data={situationData}
          selectedId={situationId}
          onSelect={setSituationId}
        />

        {/* 도움 종류 */}
        <RadioSection />

        {/* 시작 - 종료 */}
        <div className={styles.timeSectionContainer}>
          <SelectSection
            title="시작 *"
            text={startDateTime}
            border={startDateTime ? "borderActive" : "borderDefault"}
            width="small"
            onClick={() => {
              setDateTarget("start");
              setDateTimeSheetOpen(true);
            }}
          />
          <SelectSection
            title="종료 *"
            text={endDateTime}
            border={endDateTime ? "borderActive" : "borderDefault"}
            width="small"
            onClick={() => {
              setDateTarget("end");
              setDateTimeSheetOpen(true);
            }}
          />
        </div>

        <DateTimeSheet
          isOpen={isDateTimeSheetOpen}
          onClose={() => setDateTimeSheetOpen(false)}
          // DateTimeSheet 내부에서 선택 완료 시 상태를 업데이트하는 함수를 전달
        />

        {/* 장소 */}
        <InputSection
          title="장소 *"
          size="small"
          value={locationValue}
          onChange={(e) => setLocationValue(e.target.value)}
        />

        {/* 부탁 내용 */}
        <InputSection
          title="부탁 내용"
          size="large"
          value={contentValue}
          onChange={(e) => setContentValue(e.target.value)}
        />

        {/* 요청 대상 */}
        <SelectSection
          title="요청 대상 *"
          text={selectedUser ? selectedUser.userName : "선택"}
          border={userId ? "borderActive" : "borderDefault"}
          width="large"
          onClick={() => setUserSheetOpen(true)}
        />

        <UserSheet
          isOpen={isUserSheetOpen}
          onClose={() => setUserSheetOpen(false)}
          data={userData}
          selectedId={userId}
          onSelect={setUserId}
        />

        {/* 응답 기한 */}
        <SelectSection
          title="응답 기한 *"
          text={getDueDateText()}
          border={dueDate ? "borderActive" : "borderDefault"}
          width="large"
          onClick={() => setDuedateSheetOpen(true)}
        />

        <DueDateSheet
          isOpen={isDuedateSheetOpen}
          onClose={() => setDuedateSheetOpen(false)}
          onConfirm={(value) => setDueDate(value)}
        />
      </main>

      {/* 하단 Footer(버튼) */}
      <LargeFooter title="다음" type="primary" />
    </div>
  );
}

export default Request;
