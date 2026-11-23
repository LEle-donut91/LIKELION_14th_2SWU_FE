// H-01 상황 만들기
import { useEffect, useState } from "react";
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
import Toast from "@/shared/components/Toast/Toast";
import { useToastStore } from "@/shared/stores/useToastStore";
import { getErrorMessage } from "@/shared/utils/apiError";
import {
  SITUATION_CREATE_VALIDATION_MESSAGE,
  SITUATION_NAME_MAX_LENGTH,
  SITUATION_NAVIGATION_PATH,
  SITUATION_SELECT_PLACEHOLDER,
  SITUATION_TYPE,
  SITUATION_TYPE_OPTIONS,
} from "@/features/situation/constants/situationConstants";
import { formatDateFieldText } from "@/features/situation/utils/situationFormat";
import {
  isDateTimeFilled,
  toApiDateTime,
} from "@/features/situation/utils/situationDateTime";
import { toCreateSituationBody } from "@/features/situation/services/situationCreateService";
import { useParticipantCandidatesQuery } from "@/features/situation/hooks/queries/useParticipantCandidatesQuery";
import { useCreateSituationMutation } from "@/features/situation/hooks/mutations/useCreateSituationMutation";

// 날짜 시트에 보여줄 입력 그룹 (H-01-02)
const DATE_TIME_SECTIONS = [
  { type: "date", title: "날짜" },
  { type: "time", title: "시간" },
];

// 종류 선택값 → 화면 표시 문구 ('기타'는 직접 입력한 내용)
const getSituationTypeText = (situationType) => {
  if (!situationType?.type) return SITUATION_SELECT_PLACEHOLDER;
  if (situationType.type === SITUATION_TYPE.OTHER) {
    return situationType.etcText.trim() || "기타";
  }
  return (
    SITUATION_TYPE_OPTIONS.find(({ key }) => key === situationType.type)
      ?.label ?? SITUATION_SELECT_PLACEHOLDER
  );
};

// 입력값 확인 → 문제가 있으면 안내 문구, 없으면 null
const getValidationMessage = ({ situationType, name, startDateTime, endDateTime }) => {
  if (!situationType?.type) return SITUATION_CREATE_VALIDATION_MESSAGE.TYPE;
  if (
    situationType.type === SITUATION_TYPE.OTHER &&
    !situationType.etcText.trim()
  ) {
    return SITUATION_CREATE_VALIDATION_MESSAGE.CUSTOM_TYPE;
  }
  if (!name.trim()) return SITUATION_CREATE_VALIDATION_MESSAGE.NAME;
  if (!isDateTimeFilled(startDateTime) || !isDateTimeFilled(endDateTime)) {
    return SITUATION_CREATE_VALIDATION_MESSAGE.PERIOD;
  }
  // 같은 형식(YYYY-MM-DDTHH:mm:ss) 문자열이라 문자열 비교로 순서 확인
  if (toApiDateTime(startDateTime) >= toApiDateTime(endDateTime)) {
    return SITUATION_CREATE_VALIDATION_MESSAGE.PERIOD_ORDER;
  }
  return null;
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

  const showToast = useToastStore((state) => state.showToast);

  // 참여할 지인 후보 (활성 관계 목록)
  const { data: candidateData, error: candidateError } =
    useParticipantCandidatesQuery();
  const acquaintanceList = candidateData?.people ?? [];

  useEffect(() => {
    if (candidateError) showToast(getErrorMessage(candidateError));
  }, [candidateError, showToast]);

  // 생성 성공 → S-00 상황 목록 (뒤로가기로 입력 화면에 돌아오지 않도록 replace)
  const { createSituation, isCreating } = useCreateSituationMutation({
    showToast,
    onSuccess: () => {
      navigate(SITUATION_NAVIGATION_PATH.SITUATION_LIST, { replace: true });
    },
  });

  const handleSheetClose = () => {
    setOpenSheet(null);
  };

  const handleSituationCreateClick = () => {
    if (isCreating) return;

    const form = {
      situationType,
      name: situationName,
      startDateTime,
      endDateTime,
      participantIds: participantIdList,
    };
    const validationMessage = getValidationMessage(form);
    if (validationMessage) {
      showToast(validationMessage);
      return;
    }

    createSituation(toCreateSituationBody(form));
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
          maxLength={SITUATION_NAME_MAX_LENGTH}
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

      <Toast />
    </div>
  );
}

export default SituationCreate;
