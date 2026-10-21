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

// 시트에 주입할 DateTimeOption 입력 그룹 설정
const DATE_TIME_SECTIONS = [
  { type: "date", title: "날짜" },
  { type: "time", title: "시간" },
];

function RequestEditForm() {
  // 1. [기본정보] JSON에서 데이터 꺼내서 CheckOption용 배열로 만들기
  const basicInfoData = [
    {
      id: "birthDate",
      label: "생년월일",
      title: "생년월일",
      isDefault: requestSafetyCardData.basicInfo.birthDate.isDefault,
      description: `${requestSafetyCardData.basicInfo.birthDate.value} 출생${
        requestSafetyCardData.basicInfo.birthDate.updatedAt
          ? `, 갱신 ${requestSafetyCardData.basicInfo.birthDate.updatedAt}`
          : ""
      }`,
    },
    {
      id: "bloodType",
      label: "혈액형",
      title: "혈액형",
      isDefault: requestSafetyCardData.basicInfo.bloodType.isDefault,
      description: `${requestSafetyCardData.basicInfo.bloodType.value}${
        requestSafetyCardData.basicInfo.bloodType.updatedAt
          ? `, 갱신 ${requestSafetyCardData.basicInfo.bloodType.updatedAt}`
          : ""
      }`,
    },
  ];

  // 2. [건강정보] JSON에서 데이터 꺼내서 CheckOption용 배열로 만들기
  const healthInfoData = [
    {
      id: "disease",
      label: "질환",
      title: requestSafetyCardData.healthInfo.disease.name,
      isDefault: requestSafetyCardData.healthInfo.disease.isDefault,
      description: `${requestSafetyCardData.healthInfo.disease.diagnosedYear} 진단${
        requestSafetyCardData.healthInfo.disease.updatedAt
          ? `, 갱신 ${requestSafetyCardData.healthInfo.disease.updatedAt}`
          : ""
      }`,
    },
    {
      id: "medicine",
      label: "복용약",
      title: requestSafetyCardData.healthInfo.medicine.name,
      isDefault: requestSafetyCardData.healthInfo.medicine.isDefault,
      description: `${requestSafetyCardData.healthInfo.medicine.dosage}${
        requestSafetyCardData.healthInfo.medicine.updatedAt
          ? `, 갱신 ${requestSafetyCardData.healthInfo.medicine.updatedAt}`
          : ""
      }`,
    },
    {
      id: "allergy",
      label: "알러지",
      title: `${requestSafetyCardData.healthInfo.allergy.name} 알러지`,
      isDefault: requestSafetyCardData.healthInfo.allergy.isDefault,
      description: `${requestSafetyCardData.healthInfo.allergy.reaction}${
        requestSafetyCardData.healthInfo.allergy.updatedAt
          ? `, 갱신 ${requestSafetyCardData.healthInfo.allergy.updatedAt}`
          : ""
      }`,
    },
    {
      id: "caution",
      label: "주의사항",
      title: `${requestSafetyCardData.healthInfo.caution.name} 주의사항`,
      isDefault: requestSafetyCardData.healthInfo.caution.isDefault,
      description: `${requestSafetyCardData.healthInfo.caution.instruction}${
        requestSafetyCardData.healthInfo.caution.updatedAt
          ? `, 갱신 ${requestSafetyCardData.healthInfo.caution.updatedAt}`
          : ""
      }`,
    },
  ];

  // 3. [생활정보] JSON에서 데이터 꺼내서 CheckOption용 배열로 만들기
  const lifeInfoData = [
    {
      id: "address",
      label: "주소",
      title: "주소",
      isDefault: requestSafetyCardData.lifeInfo.address.isDefault,
      description: `${requestSafetyCardData.lifeInfo.address.value}${
        requestSafetyCardData.lifeInfo.address.updatedAt
          ? `, 갱신 ${requestSafetyCardData.lifeInfo.address.updatedAt}`
          : ""
      }`,
    },
    {
      id: "entranceMethod",
      label: "출입 방법",
      title: "출입 방법",
      isDefault: requestSafetyCardData.lifeInfo.entranceMethod.isDefault,
      description: `${requestSafetyCardData.lifeInfo.entranceMethod.value}${
        requestSafetyCardData.lifeInfo.entranceMethod.updatedAt
          ? `, 갱신 ${requestSafetyCardData.lifeInfo.entranceMethod.updatedAt}`
          : ""
      }`,
    },
    {
      id: "pet",
      label: "반려동물 정보",
      title: `반려동물 (${requestSafetyCardData.lifeInfo.pet.name})`,
      isDefault: requestSafetyCardData.lifeInfo.pet.isDefault,
      description: `${requestSafetyCardData.lifeInfo.pet.care}${
        requestSafetyCardData.lifeInfo.pet.updatedAt
          ? `, 갱신 ${requestSafetyCardData.lifeInfo.pet.updatedAt}`
          : ""
      }`,
    },
  ];

  // 4. [미리 남기는 말] JSON에서 데이터 꺼내서 CheckOption용 배열로 만들기
  const messageInfoData = [
    {
      id: "preference",
      label: "선호",
      title: "선호",
      isDefault: requestSafetyCardData.messageInfo.preference.isDefault,
      description: `${requestSafetyCardData.messageInfo.preference.value}${
        requestSafetyCardData.messageInfo.preference.updatedAt
          ? `, 갱신 ${requestSafetyCardData.messageInfo.preference.updatedAt}`
          : ""
      }`,
    },
    {
      id: "document",
      label: "문서",
      title: "문서",
      isDefault: requestSafetyCardData.messageInfo.document.isDefault,
      description: `${requestSafetyCardData.messageInfo.document.value}${
        requestSafetyCardData.messageInfo.document.updatedAt
          ? `, 갱신 ${requestSafetyCardData.messageInfo.document.updatedAt}`
          : ""
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
  const [isModalOpen, setModalOpen] = useState(false);

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

  // 선택된 ID 목록(checkedList)과 원본 데이터 목록(dataList)을 받아서,
  // 선택된 항목들의 title을 쉼표(,)로 연결하여 반환
  const getSelectedTitles = (checkedList, dataList) => {
    if (!checkedList || checkedList.length === 0) return "해당 없음";

    return dataList
      .filter((item) => checkedList.includes(item.id))
      .map((item) => item.label)
      .join(", ");
  };

  // navigation 커스텀 훅 불러오기
  const { handleGoNext, handleGoBack } = useRequestNav();

  // DateTimeSheet에서 확인을 눌렀을 때 실행될 핸들러
  const handleDateTimeConfirm = (value) => {
    if (dateTarget === "start") {
      setStartDateTime(value);
    } else if (dateTarget === "end") {
      setEndDateTime(value);
    }
  };

  const handleModalConfirmClick = () => {
    console.log("모달의 confirm 버튼(요청 취소) 클릭");
    // API 호출 로직 추가 필요

    // 모달 닫기
    setModalOpen(false);
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
        leftOnClick={() => setModalOpen(!isModalOpen)}
        rightOnClick={() => handleGoNext("/request/edit-check")}
      />

      {/* 요청 취소 모달 */}
      <DefaultModal
        modalOpen={isModalOpen}
        setModalOpen={setModalOpen}
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
        onConfirmClick={handleModalConfirmClick}
      />
    </div>
  );
}

export default RequestEditForm;
