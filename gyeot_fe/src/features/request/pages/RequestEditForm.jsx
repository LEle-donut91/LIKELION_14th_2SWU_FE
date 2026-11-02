/**
 * =====================================================================
 * [H-03-01-02] 요청 수정 · 취소
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/RequestEditForm.module.css";

// 일반 라이브러리
import { Fragment, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestForm } from "@/features/request/hooks/useRequestForm";
import { useCheckForm } from "@/features/request/hooks/useCheckForm";
import { useToast } from "@/features/request/hooks/useToast";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import {
  REQUEST_FORM_FIELD_KEY,
  REQUEST_SHEET,
  DATE_TIME_SECTIONS,
  INFO_PREVIEW_SECTIONS,
  EDIT_FORM_VALIDATE_FIELDS,
} from "@/features/request/constants/requestConstants";

// Utils
import {
  getDateTimeText,
  getSelectedTitles,
} from "@/features/request/utils/requestUtils";

// API, Services
import {
  getEditFormApi,
  postEditFormApi,
  patchRequestCancelApi,
} from "@/features/request/api/requesterApi";
import {
  getEditFormService,
  postEditFormService,
} from "@/features/request/services/requesterService";

// 일반 Components
import StepHeader from "@/features/request/components/Header/StepHeader";
import SelectSection from "@/features/request/components/Section/SelectSection";
import InputSection from "@/features/request/components/Section/InputSection";
import TimeSheet from "@/features/request/components/Sheet/TimeSheet";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import CheckOption from "@/features/request/components/Option/CheckOption";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import SmallFooter from "@/features/request/components/Footer/SmallFooter";
import DefaultModal from "@/features/request/components/Modal/DefaultModal";
import DefaultToast from "@/features/request/components/Toast/DefaultToast";

// 페이지 컴포넌트
function RequestEditForm() {
  // useNavigation 커스텀 훅의 함수
  const { handleGoBack, handleGoNext } = useRequestNav();

  // path parameter (요청 ID)
  const paramId = useParams().id;

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  // [H-03-01-02] 요청 수정 - 데이터 조회 (GET 1회)
  const { userName, dueDate, sections, initialRequestForm } = useMemo(
    () => getEditFormService(getEditFormApi(paramId)),
    [paramId],
  );

  // 시작/종료/장소 입력값 (isEditing이 true면 기존 수정안이 초기값)
  const {
    form: requestForm,
    setField: setRequestField,
    validate,
  } = useRequestForm(initialRequestForm);

  // 공유 정보 체크값 (sections 각 항목의 isDefault가 초기 체크 상태)
  const {
    form: checkForm,
    setField: setCheckField,
    isSensitiveIncluded,
  } = useCheckForm(sections);

  // 토스트 메시지
  const { toast, showToast, hideToast } = useToast();

  // 열려 있는 시트 (한 번에 하나만 열림) - REQUEST_SHEET(START/END) 또는 CHECK_FORM_FIELD_KEY 중 하나
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  // 모달의 열림/닫힘 상태
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isSensitiveModalOpen, setSensitiveModalOpen] = useState(false);

  // TODO: API 연동 로직 수정 필요
  // [H-03-01-02] 수정안 저장 후 [요청 수정 내용 확인] 페이지로 이동
  const handleGoEditCheck = () => {
    const reqRefinedData = postEditFormService(paramId, requestForm, checkForm);
    postEditFormApi(reqRefinedData);

    handleGoNext(REQUEST_ROUTES.editCheck(paramId));
  };

  // 다음 버튼 클릭 핸들러
  const handleNextBtnClick = () => {
    // 입력값 유효성 검사 (첫 번째 에러 문구 하나만 토스트로)
    const errors = validate(EDIT_FORM_VALIDATE_FIELDS);
    const [firstError] = Object.values(errors);
    if (firstError) {
      showToast(firstError);
      return;
    }

    // 민감정보가 있으면 확인 모달을 먼저 띄움
    if (isSensitiveIncluded) {
      setSensitiveModalOpen(true);
      return;
    }
    handleGoEditCheck();
  };

  // 민감 정보 확인 모달의 확인 버튼
  const handleSensitiveConfirm = () => {
    setSensitiveModalOpen(false);
    handleGoEditCheck();
  };

  // TODO: API 연동 로직 수정 필요
  // 요청 취소 모달의 확인 버튼
  const handleCancelConfirm = () => {
    patchRequestCancelApi(paramId);
    setCancelModalOpen(false);

    // [요청 상세 · 요청자 뷰]로 이동
    handleGoBack();
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
            text={getDateTimeText(requestForm.startDateTime)}
            border={
              requestForm.startDateTime ? "borderActive" : "borderDefault"
            }
            width="small"
            onClick={() => setOpenSheet(REQUEST_SHEET.START)}
          />
          <SelectSection
            title="종료 *"
            text={getDateTimeText(requestForm.endDateTime)}
            border={requestForm.endDateTime ? "borderActive" : "borderDefault"}
            width="small"
            onClick={() => setOpenSheet(REQUEST_SHEET.END)}
          />
        </div>
        <TimeSheet
          isOpen={openSheet === REQUEST_SHEET.START}
          onClose={closeSheet}
          value={requestForm.startDateTime}
          onConfirm={(v) =>
            setRequestField(REQUEST_FORM_FIELD_KEY.START_DATE_TIME, v)
          }
        >
          {(temp, setTemp) => (
            <DateTimeOption
              sections={DATE_TIME_SECTIONS}
              value={temp}
              onChange={setTemp}
            />
          )}
        </TimeSheet>
        <TimeSheet
          isOpen={openSheet === REQUEST_SHEET.END}
          onClose={closeSheet}
          value={requestForm.endDateTime}
          onConfirm={(v) =>
            setRequestField(REQUEST_FORM_FIELD_KEY.END_DATE_TIME, v)
          }
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
          value={requestForm.location}
          onChange={(e) =>
            setRequestField(
              REQUEST_FORM_FIELD_KEY.LOCATION,
              e.target.value || null,
            )
          }
        />

        <div className={styles.sectionGroup}>
          <span className={`${styles.groupTitle} typoTitleMedium`}>
            공유 정보
          </span>
          {/* 기본 정보 / 건강 정보 / 생활 정보 / 미리 남기는 말 */}
          {INFO_PREVIEW_SECTIONS.map(({ key, title, description }) => (
            <Fragment key={key}>
              <SafetyCardGroup
                title={title}
                information={getSelectedTitles(checkForm[key], sections[key])}
                onClick={() => setOpenSheet(key)}
              />

              <DefaultSheet
                isOpen={openSheet === key}
                onClose={closeSheet}
                title={title}
                description={description}
                value={checkForm[key]}
                onConfirm={(v) => setCheckField(key, v)}
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
        </div>
      </main>

      {/* 하단 Footer(버튼) */}
      <SmallFooter
        leftType="tertiary"
        leftTitle="요청 취소"
        rightTitle="다음"
        leftOnClick={() => setCancelModalOpen(true)}
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
            {userName}님에게 {dueDate}까지 정보를 공유할까요?
          </>
        }
        cancelTxt="취소"
        confirmTxt="공유"
        onConfirmClick={handleSensitiveConfirm}
      />

      {/* 토스트 (key 가 바뀌면 새로 마운트되어 타이머가 다시 시작됨) */}
      {toast && (
        <DefaultToast
          key={toast.id}
          message={toast.message}
          onHide={hideToast}
        />
      )}
    </div>
  );
}

export default RequestEditForm;
