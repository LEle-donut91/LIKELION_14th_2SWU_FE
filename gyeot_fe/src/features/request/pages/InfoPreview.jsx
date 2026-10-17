// H-03-02-01
import styles from "@/features/request/pages/InfoPreview.module.css";
import StepHeader from "@/features/request/components/Header/StepHeader";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import CheckOption from "@/features/request/components/Option/CheckOption";
import { useState } from "react";
import requestSafetyCardData from "@/features/request/api/requestSafetyCardData.json";
import UserInfo from "@/features/request/components/User/UserInfo";
import RequestDueDate from "../components/Request/RequestDueDate";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";
import { useNavigate } from "react-router-dom";

function InfoPreview() {
// 1. [기본정보] JSON에서 데이터 꺼내서 CheckOption용 배열로 만들기
  const basicInfoData = [
    {
      id: "birthDate",
      label: "생년월일",
      title: "생년월일",
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
      description: `${requestSafetyCardData.lifeInfo.address.value}${
        requestSafetyCardData.lifeInfo.address.updatedAt
          ? `, 갱신 ${requestSafetyCardData.lifeInfo.address.updatedAt}`
          : ""
      }`,
    },
    {
      id: "entranceMethod",
      label: "출입 방법",
      title:  "출입 방법",
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

  // 모달의 열림/닫힘 상태(State) 정의
  const [isModalOpen, setModalOpen] = useState(false);

  // 모달 여는 함수 정의
  const handleModalOpen = () => {
    setModalOpen(!isModalOpen);
  };

  // 전송 완료 화면으로 이동
  const navigate = useNavigate();
  const handleToRequestSend = () => {
    navigate('/request/send');
  }

  // 선택된 ID 목록(checkedList)과 원본 데이터 목록(dataList)을 받아서,
  // 선택된 항목들의 title을 쉼표(,)로 연결하여 반환
  const getSelectedTitles = (checkedList, dataList) => {
    if (!checkedList || checkedList.length === 0) return "해당 없음";

    return dataList
      .filter((item) => checkedList.includes(item.id))
      .map((item) => item.label)
      .join(", ");
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="2" />

      {/* 메인 컨텐츠 */}
      <main>
        <UserInfo
          isAgain={false}
          state="받는 사람"
          userName="서연"
          part="나의 사람"
        />

        <RequestDueDate
          isResponse={false}
          title="접근 기한"
          dueDate="~10/2 18:00"
        />

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

        <span className={`${styles.defaultTxt} typoBodySmall`}>
          기본값이 선택되어 있어요.
          <br />
          공유한 정보는 요청이 끝나면 자동 회수돼요.
        </span>
      </main>
      <LargeFooter
        title="요청 보내기"
        type="primary"
        onClick={handleModalOpen}
      />
      <DefaultModal
        modalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        title="민감 정보 확인"
        description={
          <>
            민감 정보가 포함되어 있어요.<br />
            서연님에게 10/2 18:00까지 정보를 공유할까요?
          </>
        }
        cancelTxt="취소"
        confirmTxt="공유"
        onConfirmClick={handleToRequestSend}
      />
    </div>
  );
}

export default InfoPreview;
