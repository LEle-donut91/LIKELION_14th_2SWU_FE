// H-03-01-02

import styles from "@/features/request/pages/RequestEditForm.module.css";

import StepHeader from "@/features/request/components/Header/StepHeader";
import SelectSection from "@/features/request/components/Section/SelectSection";
import InputSection from "@/features/request/components/Section/InputSection";
import TimeSheet from "@/features/request/components/Sheet/TimeSheet";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import { useState } from "react";
import CheckOption from "@/features/request/components/Option/CheckOption";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import requestSafetyCardData from "@/features/request/api/requestSafetyCardData.json";
import SmallFooter from "@/features/request/components/Footer/SmallFooter";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";
import { getSelectedTitles, checkSensitiveIncluded, getDateTimeText } from "@/features/request/utils/requestUtils.js";
import { DATE_TIME_SECTIONS } from "@/features/request/constants/requestConstants.js";;

function RequestEditForm() {
  // JSON 데이터 꺼내서 변수에 각각 저장
  const { basicInfo, healthInfo, lifeInfo, messageInfo } =
    requestSafetyCardData;
  const { birthDate, bloodType } = [basicInfo.birthDate, basicInfo.bloodType];
  const { disease, medicine, allergy, caution } = [
    healthInfo.disease,
    healthInfo.medicine,
    healthInfo.allergy,
    healthInfo.caution,
  ];
  const { address, entranceMethod, pet } = [
    lifeInfo.address,
    lifeInfo.entranceMethod,
    lifeInfo.pet,
  ];
  const { preference, document } = [
    messageInfo.preference,
    messageInfo.document,
  ];

  // 1. [기본정보] CheckOption용 배열
  const basicInfoData = [
    {
      id: "birthDate",
      label: "생년월일",
      title: "생년월일",
      isDefault: birthDate.isDefault,
      description: `${birthDate.value} 출생${
        birthDate.updatedAt ? `, 갱신 ${birthDate.updatedAt}` : ""
      }`,
    },
    {
      id: "bloodType",
      label: "혈액형",
      title: "혈액형",
      isDefault: bloodType.isDefault,
      description: `${bloodType.value}${
        bloodType.updatedAt ? `, 갱신 ${bloodType.updatedAt}` : ""
      }`,
    },
  ];

  // 2. [건강정보] CheckOption용 배열
  const healthInfoData = [
    {
      id: "disease",
      label: "질환",
      title: disease.name,
      isDefault: disease.isDefault,
      description: `${disease.diagnosedYear} 진단${
        disease.updatedAt ? `, 갱신 ${disease.updatedAt}` : ""
      }`,
    },
    {
      id: "medicine",
      label: "복용약",
      title: medicine.name,
      isDefault: medicine.isDefault,
      description: `${medicine.dosage}${
        medicine.updatedAt ? `, 갱신 ${medicine.updatedAt}` : ""
      }`,
    },
    {
      id: "allergy",
      label: "알러지",
      title: `${allergy.name} 알러지`,
      isDefault: allergy.isDefault,
      description: `${allergy.reaction}${
        allergy.updatedAt ? `, 갱신 ${allergy.updatedAt}` : ""
      }`,
    },
    {
      id: "caution",
      label: "주의사항",
      title: `${caution.name} 주의사항`,
      isDefault: caution.isDefault,
      description: `${caution.instruction}${
        caution.updatedAt ? `, 갱신 ${caution.updatedAt}` : ""
      }`,
    },
  ];

  // 3. [생활정보] CheckOption용 배열
  const lifeInfoData = [
    {
      id: "address",
      label: "주소",
      title: "주소",
      isDefault: address.isDefault,
      description: `${address.value}${
        address.updatedAt ? `, 갱신 ${address.updatedAt}` : ""
      }`,
    },
    {
      id: "entranceMethod",
      label: "출입 방법",
      title: "출입 방법",
      isDefault: entranceMethod.isDefault,
      description: `${entranceMethod.value}${
        entranceMethod.updatedAt ? `, 갱신 ${entranceMethod.updatedAt}` : ""
      }`,
    },
    {
      id: "pet",
      label: "반려동물 정보",
      title: `반려동물 (${pet.name})`,
      isDefault: pet.isDefault,
      description: `${pet.care}${
        pet.updatedAt ? `, 갱신 ${pet.updatedAt}` : ""
      }`,
    },
  ];

  // 4. [미리 남기는 말] CheckOption용 배열
  const messageInfoData = [
    {
      id: "preference",
      label: "선호",
      title: "선호",
      isDefault: preference.isDefault,
      description: `${preference.value}${
        preference.updatedAt ? `, 갱신 ${preference.updatedAt}` : ""
      }`,
    },
    {
      id: "document",
      label: "문서",
      title: "문서",
      isDefault: document.isDefault,
      description: `${document.value}${
        document.updatedAt ? `, 갱신 ${document.updatedAt}` : ""
      }`,
    },
  ];

  // 각 선택 항목에 대한 상태(State) 정의
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [locationValue, setLocationValue] = useState(null);

  // 각 선택 항목에 대한 상태(State) 정의 (isDefault가 true인 항목들의 id를 초기값으로 설정)
  const [checkedBasicLst, setCheckedBasicLst] = useState(
    basicInfoData.filter((item) => item.isDefault).map((item) => item.id),
  );
  const [checkedHealthLst, setCheckedHealthLst] = useState(
    healthInfoData.filter((item) => item.isDefault).map((item) => item.id),
  );
  const [checkedLifeLst, setCheckedLifeLst] = useState(
    lifeInfoData.filter((item) => item.isDefault).map((item) => item.id),
  );
  const [checkedMessageLst, setCheckedMessageLst] = useState(
    messageInfoData.filter((item) => item.isDefault).map((item) => item.id),
  );

  // 각 Sheet의 열림/닫힘 상태(State) 정의
  const [isDateTimeSheetOpen, setDateTimeSheetOpen] = useState(false);
  const [isBasicSheetOpen, setBasicSheetOpen] = useState(false);
  const [isHealthSheetOpen, setHealthSheetOpen] = useState(false);
  const [isLifeSheetOpen, setLifeSheetOpen] = useState(false);
  const [isMessageSheetOpen, setMessageSheetOpen] = useState(false);

  // 어떤 시트(시작 또는 종료)에서 DateTimeSheet를 열었는지 구분하기 위한 상태
  const [dateTarget, setDateTarget] = useState(null);

  // 모달의 열림/닫힘 상태(State) 정의
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isSensitiveModalOpen, setSensitiveModalOpen] = useState(false);

  // DateTimeSheet에서 확인을 눌렀을 때 실행될 핸들러
  const handleDateTimeConfirm = (value) => {
    if (dateTarget === "start") {
      setStartDateTime(value);
    } else if (dateTarget === "end") {
      setEndDateTime(value);
    }
  };

  const { handleGoBack, handleGoNext } = useRequestNav(); 

  // 다음 버튼 클릭 핸들러
  const handleNextBtnClick = () => {
    if (checkSensitiveIncluded(checkedHealthLst, checkedLifeLst)) {
      console.log("민감정보 포함");
      setSensitiveModalOpen(!isSensitiveModalOpen);
      return;
    }
    console.log("민감정보 미포함");
    handleGoNext("/request/edit-check");
  };

  // 민감 정보 확인 모달의 확인 버튼
  const handleSensitiveConfirm = () => {
    setSensitiveModalOpen(false); // 모달 닫기
    handleGoNext("/request/edit-check"); // 다음 페이지로 이동
  };

  // 요청 취소 모달의 확인 버튼
  const handleCancelConfirm = () => {
    console.log("요청 취소 모달의 confirm 버튼(요청 취소) 클릭");
    // API 호출 로직 추가 필요

    // 모달 닫기
    setCancelModalOpen(false);
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <StepHeader title="요청 수정" step="1" onClick={handleGoBack} />

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
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

        <div className={styles.safetyCardGroupLst}>
          {/* 기본 정보 */}
          <SafetyCardGroup
            title="기본 정보"
            information={getSelectedTitles(checkedBasicLst, basicInfoData)}
            onClick={() => setBasicSheetOpen(true)}
          />

          <DefaultSheet
            isOpen={isBasicSheetOpen}
            onClose={() => setBasicSheetOpen(false)}
            title="기본 정보"
            description="생년월일, 혈액형이 포함되어 있어요."
            value={checkedBasicLst}
            onConfirm={setCheckedBasicLst}
          >
            {(temp, setTemp) => (
              <CheckOption
                data={basicInfoData}
                checkedValue={temp}
                onChecked={setTemp}
              />
            )}
          </DefaultSheet>

          {/* 건강 정보 */}
          <SafetyCardGroup
            title="건강 정보"
            information={getSelectedTitles(checkedHealthLst, healthInfoData)}
            onClick={() => setHealthSheetOpen(true)}
          />

          <DefaultSheet
            isOpen={isHealthSheetOpen}
            onClose={() => setHealthSheetOpen(false)}
            title="건강 정보"
            description="질환, 복용약, 알러지, 주의사항이 포함되어 있어요."
            value={checkedHealthLst}
            onConfirm={setCheckedHealthLst}
          >
            {(temp, setTemp) => (
              <CheckOption
                data={healthInfoData}
                checkedValue={temp}
                onChecked={setTemp}
              />
            )}
          </DefaultSheet>

          {/* 생활 정보 */}
          <SafetyCardGroup
            title="생활 정보"
            information={getSelectedTitles(checkedLifeLst, lifeInfoData)}
            onClick={() => setLifeSheetOpen(true)}
          />

          <DefaultSheet
            isOpen={isLifeSheetOpen}
            onClose={() => setLifeSheetOpen(false)}
            title="생활 정보"
            description="주소, 출입 방법, 반려동물 정보가 포함되어 있어요."
            value={checkedLifeLst}
            onConfirm={setCheckedLifeLst}
          >
            {(temp, setTemp) => (
              <CheckOption
                data={lifeInfoData}
                checkedValue={temp}
                onChecked={setTemp}
              />
            )}
          </DefaultSheet>

          {/* 미리 남기는 말 */}
          <SafetyCardGroup
            title="미리 남기는 말"
            information={getSelectedTitles(checkedMessageLst, messageInfoData)}
            onClick={() => setMessageSheetOpen(true)}
          />

          <DefaultSheet
            isOpen={isMessageSheetOpen}
            onClose={() => setMessageSheetOpen(false)}
            title="미리 남기는 말"
            description="기타 정보가 포함되어 있어요."
            value={checkedMessageLst}
            onConfirm={setCheckedMessageLst}
          >
            {(temp, setTemp) => (
              <CheckOption
                data={messageInfoData}
                checkedValue={temp}
                onChecked={setTemp}
              />
            )}
          </DefaultSheet>
        </div>
      </main>

      {/* 하단 Footer(버튼) */}
      <SmallFooter
        leftType="tertiary"
        leftTitle="요청 취소"
        rightTitle="다음"
        leftOnClick={() => setCancelModalOpen(!isCancelModalOpen)}
        rightOnClick={handleNextBtnClick}
      />

      {/* 요청 취소 모달 */}
      <DefaultModal
        modalOpen={isCancelModalOpen}
        setModalOpen={setCancelModalOpen}
        title="요청 취소"
        description={
          <>
            담당자에게 취소가 전달되고,
            <br />
            정보 접근 권한이 바로 회수돼요.
            <br />
            취소하는 경우, 이전 상태로 돌아올 수 없어요.
          </>
        }
        cancelTxt="돌아가기"
        confirmTxt="요청 취소"
        onConfirmClick={handleCancelConfirm}
      />

      {/* 민감정보 확인 모달 */}
      <DefaultModal
        modalOpen={isSensitiveModalOpen}
        setModalOpen={setSensitiveModalOpen}
        title="민감 정보 확인"
        description={
          <>
            민감 정보가 포함되어 있어요.
            <br />
            {requestSafetyCardData.userName}님에게{" "}
            {requestSafetyCardData.dueDate}까지 정보를 공유할까요?
          </>
        }
        cancelTxt="취소"
        confirmTxt="공유"
        onConfirmClick={handleSensitiveConfirm}
      />
    </div>
  );
}

export default RequestEditForm;
