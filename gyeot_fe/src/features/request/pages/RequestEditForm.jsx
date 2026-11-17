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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useToast } from "@/shared/hooks/useToast";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { getErrorMessage } from "@/shared/utils/apiError";
import {
  REQUEST_FORM_FIELD_KEY,
  REQUEST_SHEET,
  DATE_TIME_SECTIONS,
  EDIT_FORM_VALIDATE_FIELDS,
} from "@/features/request/constants/requestConstants";

// Utils
import {
  getDateTimeText,
  getSelectedTitles,
  getCategoryInformationIds,
  replaceCategoryInformationIds,
} from "@/features/request/utils/requestUtils";
import { validateInput } from "@/features/request/utils/validateInput";

// API, Services
import {
  getRequestDetailApi,
  getInformationOptionsApi,
} from "@/features/request/api/getApi";
import {
  postCancelApi,
} from "@/features/request/api/postApi";
import { getEditFormService, getInformationOptionsService } from "@/features/request/services/getService";

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
import DefaultToast from "@/shared/components/Toast/DefaultToast";

// 페이지 컴포넌트
function RequestEditForm() {
  const paramId = useParams().id;
  const { handleGoBack, handleGoNext } = useRequestNav();
  const { toast, showToast, hideToast } = useToast();
  const { entryId, form: requestForm, initForm, setForm } = useRequestFormStore((state) => state);
  const formEntryId = `requestEdit:${paramId}`;
  const { data: detail, isPending: isDetailPending, error: detailError } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.detail(paramId),
    queryFn: () => getRequestDetailApi(paramId),
    select: getEditFormService,
    enabled: Boolean(paramId),
  });
  const { data: informationOptions, isPending: isInformationPending, error: informationError } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.informationOptions(detail?.helpType, paramId),
    queryFn: () => getInformationOptionsApi({ helpType: detail.helpType, requestId: paramId }),
    select: (response) => getInformationOptionsService(response, requestForm),
    enabled: Boolean(detail?.helpType && paramId),
  });
  useEffect(() => {
    if (detailError) showToast(getErrorMessage(detailError));
  }, [detailError, showToast]);

  useEffect(() => {
    if (informationError) showToast(getErrorMessage(informationError));
  }, [informationError, showToast]);

  const { userName, dueDate, initialRequestForm } = detail ?? {};
  const { categories = [], selectedIds = [], isSensitiveIncluded = false } = informationOptions ?? {};

  // 같은 요청의 수정 화면으로 돌아오면 사용자가 입력한 값을 유지
  useEffect(() => {
    if (!initialRequestForm || !informationOptions || entryId === formEntryId) return;
    initForm(formEntryId, {
      ...initialRequestForm,
      situationId: detail.situationId,
      helpType: detail.helpType,
      informationIds: informationOptions.defaultIds,
    });
  }, [initialRequestForm, informationOptions, entryId, formEntryId, initForm, detail]);

  const setRequestField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setCategorySelection = (items, ids) =>
    setForm((prev) => ({
      ...prev,
      informationIds: replaceCategoryInformationIds(prev.informationIds, items, ids),
    }));

  // 열려 있는 시트 (한 번에 하나만 열림) - REQUEST_SHEET(START/END) 또는 CHECK_FORM_FIELD_KEY 중 하나
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  // 모달의 열림/닫힘 상태
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isSensitiveModalOpen, setSensitiveModalOpen] = useState(false);

  // 다음 버튼 클릭 핸들러
  const handleNextBtnClick = () => {
    if (isDetailPending || isInformationPending || detailError || informationError) return;
    // 입력값 유효성 검사 (첫 번째 에러 문구 하나만 토스트로)
    const errors = validateInput(requestForm, new Date(), EDIT_FORM_VALIDATE_FIELDS);
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

  // 민감 정보 확인 모달의 확인 버튼
  const handleSensitiveConfirm = () => {
    setSensitiveModalOpen(false);
    handleGoNext(REQUEST_ROUTES.editCheck(paramId));
  };

  const { mutate: cancelRequest, isPending: isCanceling } = useMutation({
    mutationFn: postCancelApi,
    onSuccess: () => handleGoBack(),
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const handleCancelConfirm = () => {
    if (isCanceling) return;
    setCancelModalOpen(false);
    cancelRequest(paramId);
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <SubpageHeader title="요청 수정" rightText="1 / 2" onBackClick={handleGoBack} />

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        {isDetailPending || isInformationPending ? <div role="status">로딩중</div> : (
          <>
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
          {categories.filter(({ items }) => items.length > 0).map(({ key, title, description, items }) => (
            <Fragment key={key}>
              <SafetyCardGroup
                title={title}
                information={getSelectedTitles(getCategoryInformationIds(selectedIds, items), items)}
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
          </>
        )}
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
