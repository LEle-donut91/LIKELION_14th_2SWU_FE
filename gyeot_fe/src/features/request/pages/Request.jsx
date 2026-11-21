/**
 * =====================================================================
 * [H-03-02] 요청 작성
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/Request.module.css";

// 일반 라이브러리
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestTargetsQuery } from "@/features/request/hooks/queries/useRequestTargetsQuery";
import { useSituationsQuery } from "@/features/request/hooks/queries/useSituationsQuery";
import { useToast } from "@/shared/hooks/useToast";

// Zustand Store
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useRequestErrorStore } from "@/features/request/stores/useRequestErrorStore";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { INITIAL_FORM } from "@/features/request/constants/initialFormConstants";
import { REQUEST_ERROR_TARGET_PAGE } from "@/features/request/constants/requestErrorConstants";
import {
  REQUEST_FORM_FIELD_KEY,
  REQUEST_SHEET,
} from "@/features/request/constants/requestFormConstants";
import {
  DATE_TIME_SECTIONS,
  DUE_DATE_SECTIONS,
} from "@/features/request/constants/dateTimeInputConstants";

// Utils
import { getDueDateForStart, toMinutes } from "@/features/request/utils/dueDateFormat";
import {
  isReadOnly,
  isPrerequisiteEnsured,
  requestValidateInput,
  isDueDateEntered,
} from "@/features/request/utils/validateInput";
import {
  getSelectedUser,
  getSelectedSituation,
  getSelectedSituationText,
  getSelectedUserText,
  getDateTimeText,
  getDueDateText,
} from "@/features/request/utils/getSelectionInput";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import RadioSection from "@/features/request/components/Section/RadioSection";
import SelectSection from "@/shared/components/SelectSection/SelectSection";
import InputSection from "@/shared/components/InputSection/InputSection";
import DefaultSheet from "@/shared/components/DefaultSheet/DefaultSheet";
import TimeSheet from "@/shared/components/TimeSheet/TimeSheet";
import SituationOption from "@/features/request/components/Option/SituationOption";
import UserOption from "@/features/request/components/Option/UserOption";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import DefaultToast from "@/shared/components/Toast/DefaultToast";

// 페이지 컴포넌트
function Request() {
  const { handleGoBack, handleGoNext } = useRequestNav();
  const paramId = useParams().id;
  const initializedParamId = useRef(null);
  const { toast, showToast, hideToast } = useToast();

  // 열려 있는 시트 (한 번에 하나만 열림)
  const [openSheet, setOpenSheet] = useState(() => {
    // 다른 페이지에서 전달 받은 에러 처리
    const { error } = useRequestErrorStore.getState();
    return error?.targetPage === REQUEST_ERROR_TARGET_PAGE.REQUEST ? error.sheet ?? null : null;
  });
  const locationInputRef = useRef(null);
  const contentInputRef = useRef(null);
  const closeSheet = () => setOpenSheet(null);

  // Zustand Store
  // 입력값 전체는 Zustand store의 form 하나
  const {
    entryId,
    form,
    initForm,
    changeSituation,
    changeUser,
    setForm,
    resetForm,
  } = useRequestFormStore((state) => state);

  // 1. 진행 중 상황 목록 조회
  const {
    data: situationData,
    isPending: isSituationsPending,
  } = useSituationsQuery({ showToast });
  const situation = situationData?.situation;

  // 2. 대상 후보 조회 API (상황 선택 후 호출, 상황이 바뀌면 자동으로 다시 조회)
  const {
    data: user = [],
    isPending: isTargetsPending,
  } = useRequestTargetsQuery({
    situationId:
      String(entryId) === paramId && String(form.situationId) === paramId
        ? form.situationId
        : undefined,
  }, {
    showToast,
    onSituationInvalid: () => setOpenSheet(REQUEST_SHEET.SITUATION),
  });

  // GET 요청 로딩중 상태
  const isLoading =
    isSituationsPending ||
    isTargetsPending;

  // 다른 페이지에서 전달 받은 에러 처리
  useEffect(() => {
    // 로딩중이면 무시
    if (isLoading) return;

    // 로딩 끝난 후 에러 처리
    const { error, setError } = useRequestErrorStore.getState();
    if (error?.targetPage !== REQUEST_ERROR_TARGET_PAGE.REQUEST) return;

    if (error.field === REQUEST_FORM_FIELD_KEY.LOCATION) {
      locationInputRef.current?.querySelector("input")?.focus();
    }

    if (error.field === REQUEST_FORM_FIELD_KEY.CONTENT) {
      contentInputRef.current?.querySelector("textarea")?.focus();
    }

    setError(null);
  }, [isLoading]);

  // 같은 진입(paramId)으로 돌아온 경우(예: 미리보기에서 뒤로가기) 입력값 유지
  // 다른 진입이면 새로 초기화 (초기값 전달)
  useEffect(() => {
    // store가 먼저 변경되고 URL이 갱신되기 전에는 이전 상황으로 초기화하지 않는다.
    if (initializedParamId.current === paramId) return;
    initializedParamId.current = paramId;
    if (String(entryId) !== paramId) {
      const selectedSituation = getSelectedSituation(situation, paramId);
      initForm(paramId, {
        situationId: paramId,
        situationStartDate: selectedSituation?.startDate ?? null,
        situationEndDate: selectedSituation?.endDate ?? null,
      });
    }
  }, [entryId, paramId, initForm, situation]);

  // 진입 또는 시작 일시 변경 시에만 확인 (조건: 시작까지 24시간 미만/응답 기한이 시작 시간 초과)
  // -  조건 만족 시, 응답 기한 값을 null로 설정 (화면엔 "시작 시간까지"로 표시)
  useEffect(() => {
    if (String(entryId) !== paramId) return;
    // store의 최신 값 읽기
    const current = useRequestFormStore.getState().form;

    // 시작 일시를 변경한 현재 시각으로 계산
    const result = getDueDateForStart(current.startDateTime, current.dueDate);

    // 보정값이 실제로 바뀐 경우에만 저장한다. null은 "시작 시간까지"로 표시된다.
    if (result.dueDate !== current.dueDate) setForm({ ...current, dueDate: result.dueDate });

    // 안내 메시지가 반환된 경우에만 토스트 메시지 출력
    if (result.message) showToast(result.message);
  }, [entryId, paramId, form.startDateTime, setForm, showToast]);

  useEffect(() => {
    const selectedSituation = getSelectedSituation(situation, form.situationId);
    if (!selectedSituation) return;
    setForm((current) => ({
      ...current,
      // 초기화 effect가 상황을 변경했다면 이전 렌더의 기간을 덮어쓰지 않는다.
      ...(String(current.situationId) === selectedSituation.id && {
        situationStartDate: selectedSituation.startDate,
        situationEndDate: selectedSituation.endDate,
      }),
    }));
  }, [situation, form.situationId, setForm]);

  // 하위 항목 (시작/종료/요청 대상/응답 기한) 시트 열기 핸들러
  const handleSubItemOpenSheet = (sheet) => {
    // 선행 조건(상황/도움 종류를 모두 선택)을 만족했을 때만 시트 열기
    if (isPrerequisiteEnsured(form, showToast)) setOpenSheet(sheet);
  };

  // 상황 선택 확정 핸들러
  // - store: 상황 변경 + 요청 대상 해제
  // - URL: :id도 새 상황 ID로 교체 (replace: 히스토리에 쌓지 않음)
  const handleSituationConfirm = (situationId) => {
    if (situationId === form.situationId) return;
    const selectedSituation = getSelectedSituation(situation, situationId);
    if (!selectedSituation) return;
    changeSituation({ ...selectedSituation, id: situationId });
    handleGoNext(REQUEST_ROUTES.request(situationId), true);
  };

  // 뒤로가기 버튼 핸들러 (작성 중이던 입력값 비우고 이전 페이지로)
  const handleHeaderBackClick = () => {
    resetForm();
    handleGoBack();
  };

  // Footer 버튼 핸들러
  const handleFooterBtnClick = () => {
    // 입력값 유효성 검사 (첫 번째 에러 문구 하나만 토스트로)
    const now = new Date();
    const result = requestValidateInput(form, now);
    const [firstError] = Object.values(result.errors);
    if (firstError) {
      // 시작 시간 초과 시 응답 기한에 null을 저장하기 위해 setForm 실행
      // 다른 입력 오류처럼 폼이 그대로면 저장하지 않는다.
      if (result.form !== form) setForm(result.form);
      showToast(firstError);
      return;
    }
    // [공개 정보 미리보기] 페이지로 이동
    setForm(result.form);
    if (result.message) showToast(result.message);
    handleGoNext(REQUEST_ROUTES.infoPreview(result.form.situationId));
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <SubpageHeader
        title="요청 작성"
        rightText="1 / 2"
        onBackClick={handleHeaderBackClick}
      />
      {!isLoading && (
<>
      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        {/* 상황 */}
        <SelectSection
          title="상황"
          isRequired
          text={getSelectedSituationText(situation, form.situationId)}
          width="large"
          onClick={() => setOpenSheet(REQUEST_SHEET.SITUATION)}
        />
        <DefaultSheet
          isOpen={openSheet === REQUEST_SHEET.SITUATION}
          onClose={closeSheet}
          title="상황"
          description="상황에 참여한 사람들에게만 요청을 보낼 수 있어요."
          value={form.situationId}
          onConfirm={(v) => handleSituationConfirm(v)}
        >
          {(temp, setTemp) =>
            <SituationOption
              data={situation}
              selectedValue={temp}
              onSelect={setTemp}
            />
          }
        </DefaultSheet>

        {/* 도움 종류 */}
        <RadioSection
          value={form.helpType}
          onChange={(v) => setForm({ ...form, helpType: v })}
        />

        {/* 시작 - 종료 */}
        <div className={styles.timeSectionContainer}>
          <SelectSection
            title="시작"
            isRequired
            text={getDateTimeText(form.startDateTime)}
            width="small"
            onClick={() => handleSubItemOpenSheet(REQUEST_SHEET.START)}
          />
          <SelectSection
            title="종료"
            isRequired
            text={getDateTimeText(form.endDateTime)}
            width="small"
            onClick={() => handleSubItemOpenSheet(REQUEST_SHEET.END)}
          />
        </div>
        <TimeSheet
          isOpen={openSheet === REQUEST_SHEET.START}
          onClose={closeSheet}
          value={form.startDateTime}
          onConfirm={(v) => setForm({ ...form, startDateTime: v })}
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
          value={form.endDateTime}
          onConfirm={(v) => setForm({ ...form, endDateTime: v })}
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
        {/* 선행 조건(상황/도움 종류를 모두 선택) 미충족 시 readOnly */}
        {/* 선행 조건(상황/도움 종류를 모두 선택)을 만족했을 때만 입력 가능 (onFocus) */}
        <div ref={locationInputRef}>
          <InputSection
            title="장소"
            isRequired
            size="small"
            value={form.location}
            readOnly={isReadOnly(form)}
            onFocus={() => isPrerequisiteEnsured(form, showToast)}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value || null })
            }
          />
        </div>

        {/* 부탁 내용 */}
        {/* 선행 조건(상황/도움 종류를 모두 선택) 미충족 시 readOnly */}
        {/* 선행 조건(상황/도움 종류를 모두 선택)을 만족했을 때만 입력 가능 (onFocus) */}
        <div ref={contentInputRef}>
          <InputSection
            title="부탁 내용"
            size="large"
            value={form.content}
            readOnly={isReadOnly(form)}
            onFocus={() => isPrerequisiteEnsured(form, showToast)}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value || null })
            }
          />
        </div>

        {/* 요청 대상 */}
        <SelectSection
          title="요청 대상"
          isRequired
          text={getSelectedUserText(user, form.userId)}
          width="large"
          onClick={() => handleSubItemOpenSheet(REQUEST_SHEET.USER)}
        />
        <DefaultSheet
          isOpen={openSheet === REQUEST_SHEET.USER}
          onClose={closeSheet}
          title="요청 대상"
          description="상황에 참여한 사람들에게만 요청을 보낼 수 있어요."
          value={form.userId}
          onConfirm={(v) => {
            const selectedUser = getSelectedUser(user, v);
            changeUser({ ...selectedUser, id: v });
          }}
        >
          {(temp, setTemp) =>
            <UserOption data={user} selectedValue={temp} onSelect={setTemp} />
          }
        </DefaultSheet>

        {/* 응답 기한 */}
        <SelectSection
          title="응답 기한"
          isRequired
          text={getDueDateText(form.dueDate)}
          width="large"
          onClick={() => handleSubItemOpenSheet(REQUEST_SHEET.DUE_DATE)}
        />
        <TimeSheet
          isOpen={openSheet === REQUEST_SHEET.DUE_DATE}
          onClose={closeSheet}
          value={form.dueDate}
          onConfirm={(v) => {
            // 1. 미입력·0분은 먼저 24시간으로 보정
            const dueDate = !isDueDateEntered(v) || toMinutes(v) === 0 ? { ...INITIAL_FORM.dueDate } : v;

            // 2. 사용자가 입력한 값 / 24시간 보정값 -> 아래 두 조건 중 하나라도 해당되는지 체크
            // - 1) 시작 시간을 초과 (현재+응답기한 > 시작시간)
            // - 2) 시작까지 남은 시간이 24시간 미만
            const result = getDueDateForStart(form.startDateTime, dueDate);

            // 조건 충족 시 null을 저장하고 토스트 출력. 아니면 입력된 기한을 그대로 저장하고 토스트 출력 X
            setForm({ ...form, dueDate: result.dueDate });
            if (result.message) showToast(result.message);
          }}
        >
          {(temp, setTemp) => (
            <DateTimeOption
              sections={DUE_DATE_SECTIONS}
              value={temp}
              onChange={setTemp}
            />
          )}
        </TimeSheet>
      </main>

      {/* 하단 Footer(버튼) */}
      <LargeFooter title="다음" type="primary" onClick={handleFooterBtnClick} />
</>
      )}
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

export default Request;
