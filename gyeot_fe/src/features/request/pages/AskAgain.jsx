/**
 * =====================================================================
 * [N-06] 다시 부탁하기
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/AskAgain.module.css";

// 일반 라이브러리
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestTargetsQuery } from "@/features/request/hooks/queries/useRequestTargetsQuery";
import { useInformationOptionsQuery } from "@/features/request/hooks/queries/useInformationOptionsQuery";
import { useRequestDetailQuery } from "@/features/request/hooks/queries/useRequestDetailQuery";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useRequestErrorStore } from "@/features/request/stores/useRequestErrorStore";
import { useToast } from "@/shared/hooks/useToast";

// Services
import {
  getAskAgainInformationService,
  getAskAgainDetailService,
} from "@/features/request/services/askAgainService";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_ERROR_TARGET_PAGE } from "@/features/request/constants/requestErrorConstants";
import {
  REQUEST_SHEET,
  ASK_AGAIN_VALIDATE_FIELDS_FLEXIBLE,
} from "@/features/request/constants/requestFormConstants";
import { DUE_DATE_SECTIONS } from "@/features/request/constants/dateTimeInputConstants";

// Utils
import {
  isPrerequisiteEnsured,
  validateInput,
} from "@/features/request/utils/validateInput";
import { normalizeResponseDeadline } from "@/features/request/utils/dueDateUtils";
import {
  getSelectedUser,
  getSelectedUserText,
  getDueDateText,
} from "@/features/request/utils/getSelectionInput";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import UserInfo from "@/features/request/components/User/UserInfo";
import SelectSection from "@/shared/components/SelectSection/SelectSection";
import DefaultSheet from "@/shared/components/DefaultSheet/DefaultSheet";
import TimeSheet from "@/shared/components/TimeSheet/TimeSheet";
import UserOption from "@/features/request/components/Option/UserOption";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import DefaultToast from "@/shared/components/Toast/DefaultToast";

// 페이지 컴포넌트
function AskAgain() {
  const { handleGoNext, handleGoBack } = useRequestNav();
  const paramId = useParams().id;
  const { toast, showToast, hideToast } = useToast();

  // 열려 있는 시트 (한 번에 하나만 열림)
  const [openSheet, setOpenSheet] = useState(() => {
    const { error } = useRequestErrorStore.getState();
    return error?.targetPage === REQUEST_ERROR_TARGET_PAGE.ASK_AGAIN && error.requestId === paramId
      ? error.sheet ?? null
      : null;
  });
  const closeSheet = () => setOpenSheet(null);

  // 1. 대상 후보 조회 API
  const targetsQuery = useRequestTargetsQuery({ requestId: paramId }, { showToast });
  const refetchTargets = targetsQuery.refetch;

  // 2. 공개 정보 선택지 조회 API
  const informationQuery = useInformationOptionsQuery(
    { requestId: paramId },
    { select: getAskAgainInformationService, enabled: Boolean(paramId), showToast },
  );

  // 3. 요청 상세 조회 API
  const detailQuery = useRequestDetailQuery(paramId, {
    showToast,
    select: getAskAgainDetailService,
  });

  // 다른 페이지에서 전달 받은 에러 처리
  useEffect(() => {
    const { error, setError } = useRequestErrorStore.getState();
    const { changeUser } = useRequestFormStore.getState();
    if (error?.targetPage !== REQUEST_ERROR_TARGET_PAGE.ASK_AGAIN || error.requestId !== paramId) return;
    setError(null);
    if (error.refreshTargets) {
      changeUser({ id: null });
      refetchTargets({ cancelRefetch: false });
    }
  }, [paramId, refetchTargets]);

  // API 응답 데이터 (정제된 형태)
  const userList = targetsQuery.data ?? [];
  const information = informationQuery.data;
  const detail = detailQuery.data;
  const {
    reqType,
    reqMsg,
    infoList = [],
    userRecord = [],
    initialForm,
  } = detail ?? {};

  // 로딩/에러 등의 상태
  const isDetailReady = !detailQuery.isPending && !detailQuery.error;
  const isLoading =
    targetsQuery.isPending ||
    informationQuery.isPending ||
    detailQuery.isPending;
  const hasError = Boolean(
    targetsQuery.error || informationQuery.error || detailQuery.error,
  );

  // 요청 작성과 진입 ID가 겹치지 않도록 구분하고, 같은 요청의 입력값은 유지
  const formEntryId = `askAgain:${paramId}`;
  const { entryId, form, initForm, changeUser, setForm, resetForm } =
    useRequestFormStore((state) => state);
  useEffect(() => {
    if (!initialForm || entryId === formEntryId) return;
    initForm(formEntryId, initialForm);
  }, [initialForm, entryId, formEntryId, initForm]);

  // 항목 버튼 핸들러 (동작: 선택 시트 열기)
  const handleSubItemOpenSheet = (sheet) => {
    if (entryId !== formEntryId || !isDetailReady) return;
    if (isPrerequisiteEnsured(form, showToast)) setOpenSheet(sheet);
  };

  // 헤더의 이전 버튼 핸들러
  const handleHeaderBackClick = () => {
    resetForm();
    handleGoBack();
  };

  // 다음 버튼 핸들러
  const handleNextBtnClick = () => {
    if (isLoading || hasError || entryId !== formEntryId) return;

    // 입력값 유효성 검사 (첫 번째 에러 문구 하나만 토스트로)
    const now = new Date();
    const errors = validateInput(form, now, ASK_AGAIN_VALIDATE_FIELDS_FLEXIBLE);
    const [firstError] = Object.values(errors);
    if (firstError) {
      showToast(firstError);
      return;
    }

    const normalized = normalizeResponseDeadline(form, now);
    setForm(normalized.form);

    // [공개 정보 미리보기] 페이지로 이동
    const searchParams = new URLSearchParams({ askAgain: paramId });
    handleGoNext(
      `${REQUEST_ROUTES.infoPreview(normalized.form.situationId)}?${searchParams}`,
    );
  };

  return (
    <div className={styles.page}>
      {/* 기본 헤더 */}
      <SubpageHeader
        title="다시 부탁하기"
        onBackClick={handleHeaderBackClick}
      />

      <div className={styles.content}>
        {/* 요청 요약 카드 */}
        <RequestSummary
          isAfterInfo={false}
          hasBeigeBorder={true}
          title="이전 요청 내용"
          hasTag={true}
          type={reqType}
          infoList={[...infoList, ...(information ? [information] : [])]}
          message={reqMsg}
        />

        {/* 대상 이력 */}
        <div className={styles.userContainer}>
          <span className={`${styles.userTitle} typoBodyStrong`}>
            대상 이력
          </span>
          {userRecord.map(({ name, part, state }, index) => (
            <UserInfo
              key={`${name}-${index}`}
              isAgain={true}
              state={state}
              userName={name}
              part={part}
            />
          ))}
        </div>

        {/* 새 요청 대상 */}
        <SelectSection
          title="새 요청 대상"
          isRequired
          text={getSelectedUserText(userList, form.userId)}
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
            const selectedUser = getSelectedUser(userList, v);
            changeUser({ ...selectedUser, id: v });
          }}
        >
          {(temp, setTemp) =>
            targetsQuery.isFetching ? (
              <div role="status">로딩중</div>
            ) : (
              <UserOption
                data={userList}
                selectedValue={temp}
                onSelect={setTemp}
              />
            )
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
      </div>

      {/* 하단 푸터 */}
      <LargeFooter title="다음" type="primary" onClick={handleNextBtnClick} />

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

export default AskAgain;
