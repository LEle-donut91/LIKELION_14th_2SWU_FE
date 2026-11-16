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
import { useQuery } from "@tanstack/react-query";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useToast } from "@/features/request/hooks/useToast";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import {
  REQUEST_FORM_FIELD_KEY,
  REQUEST_SHEET,
  DUE_DATE_SECTIONS,
} from "@/features/request/constants/requestConstants";

// Utils
import {
  getSelectedUserText,
  getDueDateText,
  normalizeResponseDeadline,
  isPrerequisiteEnsured,
} from "@/features/request/utils/requestUtils";
import { validateInput } from "@/features/request/utils/validateInput";
import { getSelectedUser } from "@/features/request/utils/getSelectedItem";

// API, Services
import {
  getRequestTargetsApi,
  getInformationOptionsApi,
  getRequestDetailApi,
} from "@/features/request/api/getApi";
import { getRequestTargetsService, getAskAgainInformationService, getAskAgainDetailService } from "@/features/request/services/getService";

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
  // useNavigation 커스텀 훅의 함수
  const { handleGoNext, handleGoBack } = useRequestNav();

  // path parameter (이전 요청 ID)
  const paramId = useParams().id;

  // [N-06] 다시 부탁하기 - 데이터 조회
  const { data: userLst = [], isPending: isTargetsPending, error: targetsError } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.targets(null, paramId),
    queryFn: () => getRequestTargetsApi({ requestId: Number(paramId) }),
    select: getRequestTargetsService,
    enabled: Boolean(paramId),
  });
  const { data: information, isPending: isInformationPending, error: informationError } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.informationOptions(undefined, paramId),
    queryFn: () => getInformationOptionsApi({ requestId: Number(paramId) }),
    select: getAskAgainInformationService,
    enabled: Boolean(paramId),
  });
  const { data: detail, isPending: isDetailPending, error: detailError } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.detail(paramId),
    queryFn: () => getRequestDetailApi(paramId),
    select: getAskAgainDetailService,
    enabled: Boolean(paramId),
  });
  const { reqType, reqMsg, infoList = [], userRecord = [], initialForm } = detail ?? {};


  // 요청 작성과 진입 ID가 겹치지 않도록 구분하고, 같은 요청의 입력값은 유지
  const formEntryId = `askAgain:${paramId}`;
  const { entryId, form, initForm, changeUser, setForm, resetForm } =
    useRequestFormStore((state) => state);

  // 토스트 메시지
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (targetsError) showToast(targetsError.response?.data?.message);
  }, [targetsError, showToast]);

  useEffect(() => {
    if (informationError) showToast(informationError.response?.data?.message);
  }, [informationError, showToast]);

  useEffect(() => {
    if (detailError) showToast(detailError.response?.data?.message);
  }, [detailError, showToast]);

  useEffect(() => {
    if (!initialForm || entryId === formEntryId) return;
    initForm(formEntryId, initialForm);
  }, [initialForm, entryId, formEntryId, initForm]);


  // 열려 있는 시트 (한 번에 하나만 열림)
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  const handleSubItemOpenSheet = (sheet) => {
    if (entryId !== formEntryId || isDetailPending || detailError) return;
    if (isPrerequisiteEnsured(form, showToast)) setOpenSheet(sheet);
  };

  const handleHeaderBackClick = () => {
    resetForm();
    handleGoBack();
  };

  // 다음 버튼 클릭 핸들러
  const handleNextBtnClick = () => {
    if (isTargetsPending || isInformationPending || isDetailPending
      || targetsError || informationError || detailError || entryId !== formEntryId) return;

    // 입력값 유효성 검사 (첫 번째 에러 문구 하나만 토스트로)
    const now = new Date();
    const errors = validateInput(form, now, [
      REQUEST_FORM_FIELD_KEY.USER_ID,
      REQUEST_FORM_FIELD_KEY.DUE_DATE,
    ]);
    const [firstError] = Object.values(errors);
    if (firstError) {
      showToast(firstError);
      return;
    }

    const normalized = normalizeResponseDeadline(form, now);
    setForm(normalized.form);

    // [공개 정보 미리보기] 페이지로 이동
    handleGoNext(REQUEST_ROUTES.infoPreview(normalized.form.situationId));
  };

  return (
    <div className={styles.page}>
      {/* 기본 헤더 */}
      <SubpageHeader title="다시 부탁하기" onBackClick={handleHeaderBackClick} />

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
          text={getSelectedUserText(userLst, form.userId)}
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
            const selectedUser = getSelectedUser(userLst, v);
            changeUser({ ...selectedUser, id: v });
          }}
        >
          {(temp, setTemp) => (
            <UserOption
              data={userLst}
              selectedValue={temp}
              onSelect={setTemp}
            />
          )}
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
