// H-03-02-01
import styles from "@/features/request/pages/InfoPreview.module.css";
import StepHeader from "@/features/request/components/Header/StepHeader";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import CheckOption from "@/features/request/components/Option/CheckOption";
import { useState } from "react";
import requestSafetyCardData from "@/features/request/api/requestSafetyCardData.json";

function InfoPreview() {
// 1. [기본정보] JSON에서 데이터 꺼내서 CheckOption용 배열로 만들기
  const basicInfoData = [
    {
      id: "birthDate",
      title: "생년월일",
      description: `${requestSafetyCardData.basicInfo.birthDate.value} 출생${
        requestSafetyCardData.basicInfo.birthDate.updatedAt
          ? `, 갱신 ${requestSafetyCardData.basicInfo.birthDate.updatedAt}`
          : ""
      }`,
    },
    {
      id: "bloodType",
      title: "혈액형",
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
      id: "hypertension",
      title: "고혈압",
      description: `${requestSafetyCardData.healthInfo.hypertension.diagnosedYear} 진단${
        requestSafetyCardData.healthInfo.hypertension.updatedAt
          ? `, 갱신 ${requestSafetyCardData.healthInfo.hypertension.updatedAt}`
          : ""
      }`,
    },
    {
      id: "bloodPressureMedication",
      title: "혈압약",
      description: `${requestSafetyCardData.healthInfo.bloodPressureMedication.dosage}${
        requestSafetyCardData.healthInfo.bloodPressureMedication.updatedAt
          ? `, 갱신 ${requestSafetyCardData.healthInfo.bloodPressureMedication.updatedAt}`
          : ""
      }`,
    },
    {
      id: "penicillinAllergy",
      title: "페니실린 알러지",
      description: `${requestSafetyCardData.healthInfo.penicillinAllergy.reaction}${
        requestSafetyCardData.healthInfo.penicillinAllergy.updatedAt
          ? `, 갱신 ${requestSafetyCardData.healthInfo.penicillinAllergy.updatedAt}`
          : ""
      }`,
    },
    {
      id: "dizzinessPrecautions",
      title: "어지러움 주의사항",
      description: `${requestSafetyCardData.healthInfo.dizzinessPrecautions.instruction}${
        requestSafetyCardData.healthInfo.dizzinessPrecautions.updatedAt
          ? `, 갱신 ${requestSafetyCardData.healthInfo.dizzinessPrecautions.updatedAt}`
          : ""
      }`,
    },
  ];

  // 3. [생활정보] JSON에서 데이터 꺼내서 CheckOption용 배열로 만들기
  const lifeInfoData = [
    {
      id: "address",
      title: "주소",
      description: `${requestSafetyCardData.lifeInfo.address.value}${
        requestSafetyCardData.lifeInfo.address.updatedAt
          ? `, 갱신 ${requestSafetyCardData.lifeInfo.address.updatedAt}`
          : ""
      }`,
    },
    {
      id: "entranceMethod",
      title: "출입 방법",
      description: `${requestSafetyCardData.lifeInfo.entranceMethod.value}${
        requestSafetyCardData.lifeInfo.entranceMethod.updatedAt
          ? `, 갱신 ${requestSafetyCardData.lifeInfo.entranceMethod.updatedAt}`
          : ""
      }`,
    },
    {
      id: "pet",
      title: `반려동물 (${requestSafetyCardData.lifeInfo.pet.name})`,
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
      title: "선호",
      description: `${requestSafetyCardData.messageInfo.preference.value}${
        requestSafetyCardData.messageInfo.preference.updatedAt
          ? `, 갱신 ${requestSafetyCardData.messageInfo.preference.updatedAt}`
          : ""
      }`,
    },
    {
      id: "document",
      title: "문서",
      description: `${requestSafetyCardData.messageInfo.document.value}${
        requestSafetyCardData.messageInfo.document.updatedAt
          ? `, 갱신 ${requestSafetyCardData.messageInfo.document.updatedAt}`
          : ""
      }`,
    },
  ];

  // 각 선택 항목에 대한 상태(State) 정의
  const [checkedBasicLst, setCheckedBasicLst] = useState([]);
  const [checkedHealthLst, setCheckedHealthLst] = useState([]);
  const [checkedLifeLst, setCheckedLifeLst] = useState([]);
  const [checkedMessageLst, setCheckedMessageLst] = useState([]);

  // 각 Sheet의 열림/닫힘 상태(State) 정의
  const [isBasicSheetOpen, setBasicSheetOpen] = useState(false);
  const [isHealthSheetOpen, setHealthSheetOpen] = useState(false);
  const [isLifeSheetOpen, setLifeSheetOpen] = useState(false);
  const [isMessageSheetOpen, setMessageSheetOpen] = useState(false);

  // 선택된 ID를 통해 화면에 보여줄 텍스트(title) 찾기 (로직 추가 필요)

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="2" />

      {/* 메인 컨텐츠 */}
      <main>

        {/* 기본 정보 */}
        <SafetyCardGroup
          title="기본 정보"
          information="생년월일"
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
          information="질환, 복용약, 알러지"
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
          information="주소, 출입 방법"
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
          information="해당 없음"
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
      </main>
    </div>
  );
}

export default InfoPreview;
