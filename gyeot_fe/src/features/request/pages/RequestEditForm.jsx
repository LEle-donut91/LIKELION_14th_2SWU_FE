/**
 * =====================================================================
 * [H-03-01-02] 요청 수정 · 취소
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/RequestEditForm.module.css";

// 일반 라이브러리
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestDetailQuery } from "@/features/request/hooks/queries/useRequestDetailQuery";
import { useInformationOptionsQuery } from "@/features/request/hooks/queries/useInformationOptionsQuery";
import { useCancelRequestMutation } from "@/features/request/hooks/mutations/useCancelRequestMutation";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useRequestErrorStore } from "@/features/request/stores/useRequestErrorStore";
import { useToastStore } from "@/shared/stores/useToastStore";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_ERROR_TARGET_PAGE } from "@/features/request/constants/requestErrorConstants";
import {
  REQUEST_FORM_FIELD_KEY,
  REQUEST_SHEET,
} from "@/features/request/constants/requestFormConstants";
import { DATE_TIME_SECTIONS } from "@/features/request/constants/dateTimeInputConstants";

// Utils
import { getDateTimeText } from "@/features/request/utils/getSelectionInput";
import {
  getSelectedTitles,
  getCategoryInformationIds,
  replaceCategoryInformationIds,
} from "@/features/request/utils/getSafetyCardInfo";
import { editValidateInput } from "@/features/request/utils/validateInput";

// Services
import { getEditFormService } from "@/features/request/services/editRequestService";
import { getInformationOptionsService } from "@/features/request/services/informationOptionsService";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SelectSection from "@/shared/components/SelectSection/SelectSection";
import InputSection from "@/shared/components/InputSection/InputSection";
import TimeSheet from "@/shared/components/TimeSheet/TimeSheet";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import DefaultSheet from "@/shared/components/DefaultSheet/DefaultSheet";
import CheckOption from "@/features/request/components/Option/CheckOption";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import SmallFooter from "@/shared/components/SmallFooter/SmallFooter";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
import Toast from "@/shared/components/Toast/Toast";

// 페이지 컴포넌트
function RequestEditForm() {
  const paramId = useParams().id;
  const { handleGoBack, handleGoNext } = useRequestNav();
  const showToast = useToastStore((state) => state.showToast);

  // 열려 있는 시트 (한 번에 하나만 열림) - REQUEST_SHEET(START/END) 또는 CHECK_FORM_FIELD_KEY 중 하나
  const [openSheet, setOpenSheet] = useState(() => {
    // 다른 페이지에서 전달 받은 에러 처리
    const { error } = useRequestErrorStore.getState();
    return error?.targetPage === REQUEST_ERROR_TARGET_PAGE.EDIT_FORM && error.requestId === paramId
      ? error.sheet ?? null
      : null;
  });
  const closeSheet = () => setOpenSheet(null);

  // 다른 페이지에서 전달 받은 에러 처리
  useEffect(() => {
    const { error, setError } = useRequestErrorStore.getState();
    if (error?.targetPage !== REQUEST_ERROR_TARGET_PAGE.EDIT_FORM || error.requestId !== paramId) return;
    setError(null);
  }, [paramId]);

  // 모달의 열림/닫힘 상태
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isSensitiveModalOpen, setSensitiveModalOpen] = useState(false);

  // Zustand Store
  const {
    entryId,
    form: requestForm,
    initForm,
    setForm,
  } = useRequestFormStore((state) => state);
  const formEntryId = `requestEdit:${paramId}`;

  // 1. 요청 상세 조회 API (수정 폼 초기값) 
  const {
    data: detail,
    isPending: isDetailPending,
  } = useRequestDetailQuery(paramId, {
    showToast,
    select: getEditFormService,
  });

  // 2. 공개 항목 선택지 조회 API
  const {
    data: informationOptions,
    isPending: isInformationPending,
  } = useInformationOptionsQuery(
    { helpType: detail?.helpType, requestId: paramId },
    {
      showToast,
      select: (response) => getInformationOptionsService(response, requestForm),
      enabled: Boolean(detail?.helpType && paramId),
    },
  );

  // 3. 요청 취소 API
  const cancelMutation = useCancelRequestMutation(paramId, {
    showToast,
    onSuccess: () => handleGoBack(), // 성공 시 뒤로 가기
  });

  // API 응답 데이터 (정제된 형태)
  const { userName, dueDate, initialRequestForm } = detail ?? {};
  const {
    categories = [],
    selectedIds = [],
    isSensitiveIncluded = false,
  } = informationOptions ?? {};
  // GET 요청 로딩중 상태
  const isLoading =
    isDetailPending ||
    isInformationPending;


  // 같은 요청의 수정 화면으로 돌아오면 사용자가 입력한 값을 유지
  useEffect(() => {
    if (!initialRequestForm || !informationOptions || entryId === formEntryId)
      return;
    initForm(formEntryId, {
      ...initialRequestForm,
      situationId: detail.situationId,
      helpType: detail.helpType,
      informationIds: informationOptions.defaultIds,
    });
  }, [
    initialRequestForm,
    informationOptions,
    entryId,
    formEntryId,
    initForm,
    detail,
  ]);

  // 요청 입력폼(시작/종료/장소) 업데이트 (Zustand)
  const setRequestField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // 요청 입력폼(공개 정보 항목) 업데이트 (Zustand)
  const setCategorySelection = (items, ids) =>
    setForm((prev) => ({
      ...prev,
      informationIds: replaceCategoryInformationIds(
        prev.informationIds,
        items,
        ids,
      ),
    }));

  // 다음 버튼 클릭 handler
  const handleNextBtnClick = () => {
    // 입력값 유효성 검사 (첫 번째 에러 문구 하나만 토스트로)
    // 세 번째 인자는 현재 입력값과 비교할 기준값이다.
    // initialRequestForm은 service에서 최근 수정안의 after 값으로 만들며,
    // 수정안이 없으면 원래 요청의 startsAt·endsAt·place로 만든다.
    // defaultIds는 공개 항목 API가 selected로 내려준 기존 선택 ID 목록이다.
    // 현재 선택(requestForm.informationIds)과 비교해 공개 항목만 바꾼 경우도 구분한다.
    const errors = editValidateInput(requestForm, new Date(), {
      ...initialRequestForm,
      informationIds: informationOptions.defaultIds,
    });
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
    handleGoNext(REQUEST_ROUTES.editCheck(paramId));
  };

  // [민감 정보 확인] 모달의 confirm 버튼 handler
  const handleSensitiveConfirm = () => {
    setSensitiveModalOpen(false);
    handleGoNext(REQUEST_ROUTES.editCheck(paramId));
  };

  // [요청 취소] 모달의 confirm 버튼 handler
  const handleCancelConfirm = () => {
    if (cancelMutation.isPending) return;
    setCancelModalOpen(false);
    cancelMutation.mutate(paramId);
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <SubpageHeader
        title="요청 수정"
        rightText="1 / 2"
        onBackClick={handleGoBack}
      />

      {!isLoading && (
<>
      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
            {/* 시작 - 종료 */}
            <div className={styles.timeSectionContainer}>
              <SelectSection
                title="시작"
                isRequired
                text={getDateTimeText(requestForm.startDateTime)}
                border={
                  requestForm.startDateTime ? "borderActive" : "borderDefault"
                }
                width="small"
                onClick={() => setOpenSheet(REQUEST_SHEET.START)}
              />
              <SelectSection
                title="종료"
                isRequired
                text={getDateTimeText(requestForm.endDateTime)}
                border={
                  requestForm.endDateTime ? "borderActive" : "borderDefault"
                }
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
              title="장소"
              isRequired
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
              {categories
                .filter(({ items }) => items.length > 0)
                .map(({ key, title, description, items }) => (
                  <Fragment key={key}>
                    <SafetyCardGroup
                      title={title}
                      information={getSelectedTitles(
                        getCategoryInformationIds(selectedIds, items),
                        items,
                      )}
                      onClick={() => setOpenSheet(key)}
                    />

                    <DefaultSheet
                      isOpen={openSheet === key}
                      onClose={closeSheet}
                      title={title}
                      description={description}
                      value={getCategoryInformationIds(selectedIds, items)}
                      onConfirm={(v) => setCategorySelection(items, v)}
                    >
                      {(temp, setTemp) => (
                        <CheckOption
                          data={items}
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
</>
      )}

      {/* 토스트 (key 가 바뀌면 새로 마운트되어 타이머가 다시 시작됨) */}
      <Toast />
    </div>
  );
}

export default RequestEditForm;
