/**
 * =====================================================================
 * [H-03-02] 요청 작성
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/Request.module.css";

// 일반 라이브러리
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useToast } from "@/features/request/hooks/useToast";

// Zustand Store
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import {
  REQUEST_FORM_FIELD_KEY,
  REQUEST_SHEET,
  DATE_TIME_SECTIONS,
  DUE_DATE_SECTIONS,
} from "@/features/request/constants/requestConstants";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

// Utils
import {
  getSelectedSituationText,
  getSelectedUserText,
  getDateTimeText,
  getDueDateText,
  normalizeResponseDeadline,
  isReadOnly,
  isPrerequisiteEnsured,
} from "@/features/request/utils/requestUtils";
import { validateInput } from "@/features/request/utils/validateInput";
import {
  getSelectedUser,
  getSelectedSituation,
} from "@/features/request/utils/getSelectedItem";

// API, Services
import { getReqFormApi } from "@/features/request/api/createApi";
import { getReqFormService } from "@/features/request/services/createService";
import { getRequestTargetsApi } from "@/features/request/api/getApi";
import { getRequestTargetsService } from "@/features/request/services/getService";

// 일반 Components
import StepHeader from "@/features/request/components/Header/StepHeader";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import RadioSection from "@/features/request/components/Section/RadioSection";
import SelectSection from "@/features/request/components/Section/SelectSection";
import InputSection from "@/features/request/components/Section/InputSection";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import TimeSheet from "@/features/request/components/Sheet/TimeSheet";
import SituationOption from "@/features/request/components/Option/SituationOption";
import UserOption from "@/features/request/components/Option/UserOption";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import DefaultToast from "@/features/request/components/Toast/DefaultToast";

// 페이지 컴포넌트
function Request() {
  // useNavigation 커스텀 훅의 함수
  const { handleGoBack, handleGoNext } = useRequestNav();

  // path parameter, useLocation
  const paramId = useParams().id;
  const location = useLocation();

  // 이전 페이지에서 전달받은 state 데이터 가져오기 (요청 대상 ID, 응답 기한)
  const state = location.state || {};
  const passedUserId = state[REQUEST_FORM_FIELD_KEY.USER_ID];
  const passedDueDate = state[REQUEST_FORM_FIELD_KEY.DUE_DATE];

  // TODO: 상황 목록 조회 API 연동 시 교체
  const { situation } = useMemo(() => getReqFormService(getReqFormApi()), []);

  // 입력값 전체는 Zustand store의 form 하나
  // - 같은 진입(paramId)으로 돌아온 경우(예: 미리보기에서 뒤로가기) 입력값 유지
  // - 다른 진입이면 새로 초기화 (초기값 전달)
  const { entryId, form, initForm, changeSituation, setForm, resetForm } =
    useRequestFormStore((state) => state);

  useState(() => {
    if (entryId !== paramId) {
      const selectedSituation = getSelectedSituation(situation, paramId);
      initForm(paramId, {
        situationId: paramId,
        situationStartDate: selectedSituation?.startDate ?? null,
        situationEndDate: selectedSituation?.endDate ?? null,
        ...(passedUserId && { userId: passedUserId }),
        ...(passedDueDate && { dueDate: passedDueDate }),
      });
    }
  });

  // 토스트 메시지
  const { toast, showToast, hideToast } = useToast();

  // 열려 있는 시트 (한 번에 하나만 열림)
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  // 하위 항목 (시작/종료/요청 대상/응답 기한) 시트 열기 핸들러
  const handleSubItemOpenSheet = (sheet) => {
    // 선행 조건(상황/도움 종류를 모두 선택)을 만족했을 때만 시트 열기
    if (isPrerequisiteEnsured(form, showToast)) setOpenSheet(sheet);
  };

  // 대상 후보 조회 (TanStack Query, 상황 선택 후 호출)
  // - 상황이 바뀌면 queryKey가 달라져 자동으로 다시 조회
  const {
    data: user = [],
    isPending: isTargetsPending,
    error: targetsError,
  } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.targets(form.situationId),
    queryFn: () =>
      getRequestTargetsApi({ situationId: Number(form.situationId) }),
    select: getRequestTargetsService,
    enabled: Boolean(form.situationId),
  });

  // API 호출 에러 처리
  useEffect(() => {
    if (!targetsError) return;
    showToast(targetsError.response?.data?.message);
  }, [targetsError, showToast]);

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

  // 뒤로가기: 작성 중이던 입력값 비우고 이전 페이지로
  const handleHeaderBackClick = () => {
    resetForm();
    handleGoBack();
  };

  // Footer 버튼 눌렀을 때 실행될 핸들러
  const handleFooterBtnClick = () => {
    // 입력값 유효성 검사 (첫 번째 에러 문구 하나만 토스트로)
    const now = new Date();
    const errors = validateInput(form, now);
    const [firstError] = Object.values(errors);
    if (firstError) {
      showToast(firstError);
      return;
    }
    // [공개 정보 미리보기] 페이지로 이동
    const normalized = normalizeResponseDeadline(form, now);
    setForm(normalized.form);
    handleGoNext(REQUEST_ROUTES.infoPreview(form.situationId));
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="1" onClick={handleHeaderBackClick} />

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        {/* 상황 */}
        <SelectSection
          title="상황 *"
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
          {(temp, setTemp) => (
            <SituationOption
              data={situation}
              selectedValue={temp}
              onSelect={setTemp}
            />
          )}
        </DefaultSheet>

        {/* 도움 종류 */}
        <RadioSection
          value={form.helpType}
          onChange={(v) => setForm({ ...form, helpType: v })}
        />

        {/* 시작 - 종료 */}
        <div className={styles.timeSectionContainer}>
          <SelectSection
            title="시작 *"
            text={getDateTimeText(form.startDateTime)}
            width="small"
            onClick={() => handleSubItemOpenSheet(REQUEST_SHEET.START)}
          />
          <SelectSection
            title="종료 *"
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
        <InputSection
          title="장소 *"
          size="small"
          value={form.location}
          readOnly={isReadOnly(form)}
          onFocus={() => isPrerequisiteEnsured(form, showToast)}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value || null })
          }
        />

        {/* 부탁 내용 */}
        {/* 선행 조건(상황/도움 종류를 모두 선택) 미충족 시 readOnly */}
        {/* 선행 조건(상황/도움 종류를 모두 선택)을 만족했을 때만 입력 가능 (onFocus) */}
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

        {/* 요청 대상 */}
        <SelectSection
          title="요청 대상 *"
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
            setForm((prev) => ({
              ...prev,
              userId: v,
              userName: selectedUser?.userName ?? null,
              isGuardian: selectedUser?.isGuardian ?? null,
            }));
          }}
        >
          {(temp, setTemp) =>
            isTargetsPending ? (
              <div>Loading...</div>
            ) : (
              <UserOption data={user} selectedValue={temp} onSelect={setTemp} />
            )
          }
        </DefaultSheet>

        {/* 응답 기한 */}
        <SelectSection
          title="응답 기한 *"
          text={getDueDateText(form.dueDate)}
          width="large"
          onClick={() => handleSubItemOpenSheet(REQUEST_SHEET.DUE_DATE)}
        />
        <TimeSheet
          isOpen={openSheet === REQUEST_SHEET.DUE_DATE}
          onClose={closeSheet}
          value={form.dueDate}
          onConfirm={(v) => setForm({ ...form, dueDate: v })}
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
