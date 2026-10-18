// H-03-02-01
import styles from "@/features/request/pages/InfoPreview.module.css";
import StepHeader from "@/features/request/components/Header/StepHeader";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import CheckOption from "@/features/request/components/Option/CheckOption";
import { useState } from "react";
import requestSafetyCardData from "@/features/request/api/requestSafetyCardData.json";
import UserInfo from "@/features/request/components/User/UserInfo";
import DueDateState from "../components/State/DueDateState";
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
      title:  "출입 방법",
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

  // 각 선택 항목에 대한 상태(State) 정의 (isDefault가 true인 항목들의 id를 초기값으로 설정)
  const [checkedBasicLst, setCheckedBasicLst] = useState(
    basicInfoData.filter((item) => item.isDefault).map((item) => item.id)
  );
  const [checkedHealthLst, setCheckedHealthLst] = useState(
    healthInfoData.filter((item) => item.isDefault).map((item) => item.id)
  );
  const [checkedLifeLst, setCheckedLifeLst] = useState(
    lifeInfoData.filter((item) => item.isDefault).map((item) => item.id)
  );
  const [checkedMessageLst, setCheckedMessageLst] = useState(
    messageInfoData.filter((item) => item.isDefault).map((item) => item.id)
  );

  // 각 Sheet의 열림/닫힘 상태(State) 정의
  const [isBasicSheetOpen, setBasicSheetOpen] = useState(false);
  const [isHealthSheetOpen, setHealthSheetOpen] = useState(false);
  const [isLifeSheetOpen, setLifeSheetOpen] = useState(false);
  const [isMessageSheetOpen, setMessageSheetOpen] = useState(false);

  // 모달의 열림/닫힘 상태(State) 정의
  const [isModalOpen, setModalOpen] = useState(false);

  // 선택된 ID 목록(checkedList)과 원본 데이터 목록(dataList)을 받아서,
  // 선택된 항목들의 title을 쉼표(,)로 연결하여 반환
  const getSelectedTitles = (checkedList, dataList) => {
    if (!checkedList || checkedList.length === 0) return "해당 없음";

    return dataList
      .filter((item) => checkedList.includes(item.id))
      .map((item) => item.label)
      .join(", ");
  };

  // 민감정보 항목의 ID 목록 정의
  const SENSITIVE_KEYS = ["disease", "medicine", "allergy", "address", "entranceMethod"];

  // 사용자가 체크한 항목 중 민감정보가 포함되어 있으면 true 반환 (아니라면 false)
  const isSensitiveIncluded = () => {
    // 건강 정보 및 생활 정보 선택 목록 중 민감정보 ID가 포함되어 있는지 검사
    const isHealthSensitiveSelected = checkedHealthLst.some((id) => SENSITIVE_KEYS.includes(id));
    const isLifeSensitiveSelected = checkedLifeLst.some((id) => SENSITIVE_KEYS.includes(id));

    return isHealthSensitiveSelected || isLifeSensitiveSelected;
  };

  // 전송 완료 화면으로 이동
  const navigate = useNavigate();
  const handleSendMove = () => {
    // replace: true
    // -> 스택에서 현재 경로(/request/info-preview)를 삭제하고 다음 경로(/request/send)로 덮어쓰기(replace)
    navigate('/request/send', { replace: true });
  }

  // 요청 보내기 버튼 클릭 핸들러
  const handleSendBtnClick = () => {
    if (isSensitiveIncluded()) {
      console.log("민감정보 포함");
      setModalOpen(!isModalOpen);
      return;
    }
    console.log("민감정보 미포함");
    handleSendMove();
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="2" onClick={() => {navigate(-1)}} />

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        <UserInfo
          isAgain={false}
          state="받는 사람"
          userName={requestSafetyCardData.userName}
          part={requestSafetyCardData.userPart}
        />

        <DueDateState
          isResponse={false}
          title="접근 기한"
          dueDate={`~ ${requestSafetyCardData.dueDate}`}
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
        onClick={handleSendBtnClick}
      />
      <DefaultModal
        modalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        title="민감 정보 확인"
        description={
          <>
            민감 정보가 포함되어 있어요.<br />
            {requestSafetyCardData.userName}님에게 {requestSafetyCardData.dueDate}까지 정보를 공유할까요?
          </>
        }
        cancelTxt="취소"
        confirmTxt="공유"
        onConfirmClick={handleSendMove}
      />
    </div>
  );
}

export default InfoPreview;
