// H-03-02
import styles from "@/features/request/pages/Request.module.css";

import StepHeader from "@/features/request/components/Header/StepHeader";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import RadioSection from "@/features/request/components/Section/RadioSection";
import SelectSection from "@/features/request/components/Section/SelectSection";
import InputSection from "@/features/request/components/Section/InputSection";
import requestWriteData from "@/features/request/api/requestWriteData.json";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import TimeSheet from "@/features/request/components/Sheet/TimeSheet";
import SituationOption from "@/features/request/components/Option/SituationOption";
import UserOption from "@/features/request/components/Option/UserOption";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import { useState } from "react";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// 시트에 주입할 DateTimeOption 입력 그룹 설정
const DATE_TIME_SECTIONS = [
  { type: "date", title: "날짜" },
  { type: "time", title: "시간" },
];
const DUE_DATE_SECTIONS = [{ type: "dueDate", title: "응답기한" }];
import { useParams } from "react-router-dom";

function Request() {
  const { handleGoBack, handleGoNext } = useRequestNav();
  const paramsId = useParams().id;

  // JSON 데이터 변수에 저장
  const {situation, user} = requestWriteData;

  // 각 선택 항목에 대한 상태(State) 정의
  const [situationId, setSituationId] = useState(paramsId);
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
  const selectedSituation = situation?.find(
    (item) => item.id === situationId,
  );
  const selectedUser = user?.find((item) => item.id === userId);

  // 날짜/시간 객체를 화면에 보여줄 문자열로 가공하는 함수
  const getDateTimeText = (dateTimeObj) => {
    if (!dateTimeObj) return "선택";
    const { year, month, day, hour, minute } = dateTimeObj;
    if (!year && !month && !day && !hour && !minute) return "선택";

    const datePart =
      year || month || day
        ? `${year || "0000"}.${month || "00"}.${day || "00"}`
        : "";
    const timePart = hour || minute ? `${hour || "00"}:${minute || "00"}` : "";

    return `${datePart} ${timePart}`.trim();
  };

  // 화면에 보여줄 응답 기한 텍스트 가공
  const getDueDateText = () => {
    if (!dueDate) return "선택";
    const { days, hours, minutes } = dueDate;
    if (!days && !hours && !minutes) return "선택";

    return `${days ? `${days}일 ` : ""}${hours ? `${hours}시간 ` : ""}${minutes ? `${minutes}분` : ""}`.trim();
  };

  // DateTimeSheet에서 확인을 눌렀을 때 실행될 핸들러
  const handleDateTimeConfirm = (value) => {
    if (dateTarget === "start") {
      setStartDateTime(value);
    } else if (dateTarget === "end") {
      setEndDateTime(value);
    }
  };

  // Footer 버튼 눌렀을 때 실행될 핸들러
  const handleFooterBtnClick = () => {
    // API 연동 로직 추가 필요
    const TEMP_ID = "1" // 임시 ID 사용

    // [공개 정보 미리보기] 페이지로 이동
    handleGoNext(`/request/info-preview/${TEMP_ID}`)

  }

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="1" onClick={handleGoBack} />

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        {/* 상황 */}
        <SelectSection
          title="상황 *"
          text={selectedSituation ? selectedSituation.title : "선택"}
          border={situationId ? "borderActive" : "borderDefault"}
          width="large"
          onClick={() => setSituationSheetOpen(true)}
        />

        <DefaultSheet
          isOpen={isSituationSheetOpen}
          onClose={() => setSituationSheetOpen(false)}
          title="상황"
          description="상황에 참여한 사람들에게만 요청을 보낼 수 있어요."
          value={situationId}
          onConfirm={setSituationId}
        >
          {(temp, setTemp) => (
            <SituationOption
              data={situation}
              selectedValue={temp}
              onSelect={setTemp}
            />
          )}
        </DefaultSheet>

        {/* 도움 종류 */}
        <RadioSection />

        {/* 시작 - 종료 */}
        <div className={styles.timeSectionContainer}>
          <SelectSection
            title="시작 *"
            text={getDateTimeText(startDateTime)}
            border={startDateTime ? "borderActive" : "borderDefault"}
            width="small"
            onClick={() => {
              setDateTarget("start");
              setDateTimeSheetOpen(true);
            }}
          />
          <SelectSection
            title="종료 *"
            text={getDateTimeText(endDateTime)}
            border={endDateTime ? "borderActive" : "borderDefault"}
            width="small"
            onClick={() => {
              setDateTarget("end");
              setDateTimeSheetOpen(true);
            }}
          />
        </div>

        <TimeSheet
          isOpen={isDateTimeSheetOpen}
          onClose={() => setDateTimeSheetOpen(false)}
          value={dateTarget === "start" ? startDateTime : endDateTime}
          onConfirm={handleDateTimeConfirm}
        >
          {(temp, setTemp) => (
            <DateTimeOption
              sections={DATE_TIME_SECTIONS}
              value={temp}
              onChange={setTemp}
            />
          )}
        </TimeSheet>

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
              data={user}
              selectedValue={temp}
              onSelect={setTemp}
            />
          )}
        </DefaultSheet>

        {/* 응답 기한 */}
        <SelectSection
          title="응답 기한 *"
          text={getDueDateText()}
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
      </main>

      {/* 하단 Footer(버튼) */}
      <LargeFooter title="다음" type="primary" onClick={handleFooterBtnClick} />
    </div>
  );
}

export default Request;
