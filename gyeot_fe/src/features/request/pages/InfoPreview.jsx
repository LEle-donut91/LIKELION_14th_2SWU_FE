/**
 * =====================================================================
 * [H-03-02-01] 공개 정보 미리보기
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/InfoPreview.module.css";

// 일반 라이브러리
import { Fragment, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useCheckForm } from "@/features/request/hooks/useCheckForm";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { INFO_PREVIEW_SECTIONS } from "@/features/request/constants/requestConstants";

// Utils
import { getSelectedTitles } from "@/features/request/utils/requestUtils";

// API, Services
import {
  getInfoPreviewApi,
  postInfoPreviewApi,
} from "@/features/request/api/createApi";
import {
  getInfoPreviewService,
  postInfoPreviewService,
} from "@/features/request/services/createService";

// 일반 Components
import StepHeader from "@/features/request/components/Header/StepHeader";
import UserInfo from "@/features/request/components/User/UserInfo";
import DueDateState from "@/features/request/components/State/DueDateState";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import CheckOption from "@/features/request/components/Option/CheckOption";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";

// 페이지 컴포넌트
function InfoPreview() {
  // useNavigation 커스텀 훅의 함수
  const { handleGoNextWithTarget, handleGoBack } = useRequestNav();

  // path parameter (tempId)
  const paramId = useParams().id;

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  // [H-03-02-01] 공개 정보 미리보기 - 데이터 조회
  const { userName, userPart, dueDate, sections } = useMemo(
    () => getInfoPreviewService(getInfoPreviewApi(paramId)),
    [paramId],
  );

  // 체크된 항목은 form 하나로 관리 (isDefault 항목이 초기 체크 상태)
  const { form, setField, isSensitiveIncluded, isDefaultChecked } =
    useCheckForm(sections);

  // 열려 있는 시트 (한 번에 하나만 열림) - 값은 CHECK_FORM_FIELD_KEY 중 하나
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  // 민감정보 확인 모달의 열림/닫힘 상태
  const [isModalOpen, setModalOpen] = useState(false);

  // TODO: API 연동 로직 수정 필요
  // [H-03-02-01] 공개 정보 제출 후 [요청 완료] 페이지로 이동
  const handleGoSend = () => {
    const reqRefinedData = postInfoPreviewService(paramId, form);
    postInfoPreviewApi(reqRefinedData);

    handleGoNextWithTarget(REQUEST_ROUTES.send(paramId));
  };

  // 요청 보내기 버튼 클릭 핸들러 (민감정보가 있으면 확인 모달을 먼저 띄움)
  const handleSendBtnClick = () => {
    if (isSensitiveIncluded) {
      setModalOpen(true);
      return;
    }
    handleGoSend();
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="2" onClick={handleGoBack} />

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        <UserInfo
          isAgain={false}
          state="받는 사람"
          userName={userName}
          part={userPart}
        />

        <DueDateState
          isResponse={false}
          title="접근 기한"
          dueDate={`~ ${dueDate}`}
        />

        {/* 기본 정보 / 건강 정보 / 생활 정보 / 미리 남기는 말 */}
        {INFO_PREVIEW_SECTIONS.map(({ key, title, description }) => (
          <Fragment key={key}>
            <SafetyCardGroup
              title={title}
              information={getSelectedTitles(form[key], sections[key])}
              onClick={() => setOpenSheet(key)}
            />

            <DefaultSheet
              isOpen={openSheet === key}
              onClose={closeSheet}
              title={title}
              description={description}
              value={form[key]}
              onConfirm={(v) => setField(key, v)}
            >
              {(temp, setTemp) => (
                <CheckOption
                  data={sections[key]}
                  checkedValue={temp}
                  onChecked={setTemp}
                />
              )}
            </DefaultSheet>
          </Fragment>
        ))}

        <span className={`${styles.defaultTxt} typoBodySmall`}>
          {isDefaultChecked && (
            <>
              기본값이 선택되어 있어요.
              <br />
            </>
          )}
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
            민감 정보가 포함되어 있어요.
            <br />
            {userName}님에게 {dueDate}까지 정보를 공유할까요?
          </>
        }
        cancelTxt="취소"
        confirmTxt="공유"
        onConfirmClick={handleGoSend}
      />
    </div>
  );
}

export default InfoPreview;
