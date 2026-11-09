// H-01 상황 만들기
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/features/situation/pages/SituationCreate.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import SelectSection from "@/shared/components/SelectSection/SelectSection";
import InputSection from "@/shared/components/InputSection/InputSection";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import DefaultSheet from "@/shared/components/DefaultSheet/DefaultSheet";
import TimeSheet from "@/shared/components/TimeSheet/TimeSheet";
import DateTimeOption from "@/shared/components/DateTimeOption/DateTimeOption";
import SituationTypeOption from "@/features/situation/components/SituationTypeOption";
import ParticipantCheckList from "@/features/situation/components/ParticipantCheckList";
import {
  SITUATION_NAVIGATION_PATH,
  SITUATION_SELECT_PLACEHOLDER,
  SITUATION_TYPE_OPTIONS,
} from "@/features/situation/constants/situationConstants";
import { ACQUAINTANCE_LIST_MOCK } from "@/features/situation/mocks/situationMockData";
import { formatDateFieldText } from "@/features/situation/utils/situationFormat";

// 날짜 시트에 보여줄 입력 그룹 (H-01-02)
const DATE_TIME_SECTIONS = [
  { type: "date", title: "날짜" },
  { type: "time", title: "시간" },
];

// 종류 선택값 → 화면 표시 문구 ('기타'는 직접 입력한 내용)
const getSituationTypeText = (situationType) => {
  if (!situationType?.type) return SITUATION_SELECT_PLACEHOLDER;
  if (situationType.type === "ETC") {
    return situationType.etcText.trim() || "기타";
  }
  return (
    SITUATION_TYPE_OPTIONS.find(({ key }) => key === situationType.type)
      ?.label ?? SITUATION_SELECT_PLACEHOLDER
  );
};

function SituationCreate() {
  const navigate = useNavigate();

  // 입력값
  const [situationType, setSituationType] = useState(null); // { type, etcText }
  const [situationName, setSituationName] = useState("");
  const [startDateTime, setStartDateTime] = useState(null); // { year, month, day, hour, minute }
  const [endDateTime, setEndDateTime] = useState(null);
  const [participantIdList, setParticipantIdList] = useState([]);

  // 열려 있는 시트 ("type" | "start" | "end" | null)
  const [openSheet, setOpenSheet] = useState(null);

  // TODO: API 연동 전까지 목업 데이터 사용
  const acquaintanceList = ACQUAINTANCE_LIST_MOCK;

  const handleSheetClose = () => {
    setOpenSheet(null);
  };

  const handleSituationCreateClick = () => {
    // TODO: 상황 생성 API 연동 후 결과에 따라 이동
    navigate(SITUATION_NAVIGATION_PATH.SITUATION_LIST);
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title="상황 만들기" />

      <main className={styles.content}>
        <SelectSection
          title="종류"
          isRequired
          width="large"
          text={getSituationTypeText(situationType)}
          onClick={() => setOpenSheet("type")}
        />

        <InputSection
          title="이름"
          isRequired
          placeholder="예) 무릎 수술 회복"
          value={situationName}
          onChange={(e) => setSituationName(e.target.value)}
        />

        <div className={styles.periodContainer}>
          <SelectSection
            title="시작"
            isRequired
            width="small"
            text={formatDateFieldText(
              startDateTime,
              SITUATION_SELECT_PLACEHOLDER,
            )}
            onClick={() => setOpenSheet("start")}
          />
          <SelectSection
            title="종료"
            isRequired
            width="small"
            text={formatDateFieldText(endDateTime, SITUATION_SELECT_PLACEHOLDER)}
            onClick={() => setOpenSheet("end")}
          />
        </div>

        <div className={styles.participantHeader}>
          <h2 className={`${styles.participantTitle} typoTitleMedium`}>
            참여할 지인
          </h2>
          <p className={styles.participantDescription}>
            내 사람으로 등록한 지인 중에서 골라주세요.
          </p>
        </div>

        <ParticipantCheckList
          people={acquaintanceList}
          checkedIdList={participantIdList}
          onChange={setParticipantIdList}
        />
      </main>

      <LargeFooter
        title="상황 만들기"
        type="primary"
        onClick={handleSituationCreateClick}
      />

      {/* H-01-01 종류 선택 */}
      <DefaultSheet
        isOpen={openSheet === "type"}
        onClose={handleSheetClose}
        title="종류 선택"
        description="상황에 맞는 종류를 하나 골라주세요."
        value={situationType}
        onConfirm={setSituationType}
      >
        {(tempValue, setTempValue) => (
          <SituationTypeOption value={tempValue} onChange={setTempValue} />
        )}
      </DefaultSheet>

      {/* H-01-02 날짜 선택 (시작 / 종료) */}
      <TimeSheet
        isOpen={openSheet === "start" || openSheet === "end"}
        onClose={handleSheetClose}
        value={openSheet === "end" ? endDateTime : startDateTime}
        onConfirm={openSheet === "end" ? setEndDateTime : setStartDateTime}
      >
        {(tempValue, setTempValue) => (
          <DateTimeOption
            sections={DATE_TIME_SECTIONS}
            value={tempValue}
            onChange={setTempValue}
          />
        )}
      </TimeSheet>
    </div>
  );
}

export default SituationCreate;
