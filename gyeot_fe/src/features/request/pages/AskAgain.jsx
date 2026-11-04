/**
 * =====================================================================
 * [N-06] 다시 부탁하기
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/AskAgain.module.css";

// 일반 라이브러리
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestForm } from "@/features/request/hooks/useRequestForm";
import { useToast } from "@/features/request/hooks/useToast";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import {
  REQUEST_FORM_FIELD_KEY,
  REQUEST_SHEET,
  DUE_DATE_SECTIONS,
  ASK_AGAIN_VALIDATE_FIELDS_FIXED,
  ASK_AGAIN_VALIDATE_FIELDS_FLEXIBLE,
} from "@/features/request/constants/requestConstants";

// Utils
import {
  getSelectedUserText,
  getDueDateText,
  isStartTimeEnsured,
  isDueDateFixed,
  isDueDateEditable,
} from "@/features/request/utils/requestUtils";

// API, Services
import {
  getAskAgainApi,
  postAskAgainApi,
} from "@/features/request/api/requesterApi";
import {
  getAskAgainService,
  postAskAgainService,
  postAskAgainIdService,
} from "@/features/request/services/requesterService";

// 일반 Components
import DefaultHeader from "@/features/request/components/Header/DefaultHeader";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import UserInfo from "@/features/request/components/User/UserInfo";
import SelectSection from "@/features/request/components/Section/SelectSection";
import DefaultSheet from "@/features/request/components/Sheet/DefaultSheet";
import TimeSheet from "@/features/request/components/Sheet/TimeSheet";
import UserOption from "@/features/request/components/Option/UserOption";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import DefaultToast from "@/features/request/components/Toast/DefaultToast";

// 페이지 컴포넌트
function AskAgain() {
  // useNavigation 커스텀 훅의 함수
  const { handleGoNext, handleGoBack } = useRequestNav();

  // path parameter (이전 요청 ID)
  const paramId = useParams().id;

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  // [N-06] 다시 부탁하기 - 데이터 조회
  const { reqType, reqMsg, infoList, userRecord, userLst, startAt } = useMemo(
    () => getAskAgainService(getAskAgainApi(paramId)),
    [paramId],
  );

  // 새 요청 대상 / 응답 기한 입력값 (시작 1시간 미만이면 응답 기한이 null로 고정됨)
  const { form, setField, validate } = useRequestForm(
    { startDateTime: startAt },
    { lockDueDate: true },
  );

  // 토스트 메시지
  const { toast, showToast, hideToast } = useToast();

  // 열려 있는 시트 (한 번에 하나만 열림)
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  // 응답 기한 항목 클릭 핸들러
  // - 응답 기한이 고정되어 있으면 시트를 열지 않고 안내 토스트만 노출
  const handleDueDateClick = () => {
    if (!isDueDateEditable(form, showToast)) return;
    setOpenSheet(REQUEST_SHEET.DUE_DATE);
  };

  // 다음 버튼 클릭 핸들러
  const handleNextBtnClick = () => {
    // 시작 시간이 이미 지났으면 토스트만 노출하고 종료
    if (!isStartTimeEnsured(form.startDateTime, showToast)) return;

    // 검증할 필드 설정
    const fields = isDueDateFixed(form)
      ? ASK_AGAIN_VALIDATE_FIELDS_FIXED
      : ASK_AGAIN_VALIDATE_FIELDS_FLEXIBLE;

    // 입력값 유효성 검사 (첫 번째 에러 문구 하나만 토스트로)
    const errors = validate(fields);
    const [firstError] = Object.values(errors);
    if (firstError) {
      showToast(firstError);
      return;
    }

    // TODO: API 연동 로직 수정 필요
    // [N-06] 다시 부탁하기 - 폼 제출
    const reqRefinedData = postAskAgainService(paramId, form);
    const resRawData = postAskAgainApi(reqRefinedData);
    const { tempId } = postAskAgainIdService(resRawData);

    // [공개 정보 미리보기] 페이지로 이동
    handleGoNext(REQUEST_ROUTES.infoPreview(tempId));
  };

  return (
    <div className={styles.page}>
      {/* 기본 헤더 */}
      <DefaultHeader title="다시 부탁하기" onClick={handleGoBack} />

      <div className={styles.content}>
        {/* 요청 요약 카드 */}
        <RequestSummary
          isAfterInfo={false}
          hasBeigeBorder={true}
          title="이전 요청 내용"
          hasTag={true}
          type={reqType}
          infoList={infoList}
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
          onClick={() => setOpenSheet(REQUEST_SHEET.USER)}
        />
        <DefaultSheet
          isOpen={openSheet === REQUEST_SHEET.USER}
          onClose={closeSheet}
          title="요청 대상"
          description="상황에 참여한 사람들에게만 요청을 보낼 수 있어요."
          value={form.userId}
          onConfirm={(v) => setField(REQUEST_FORM_FIELD_KEY.USER_ID, v)}
        >
          {(temp, setTemp) => (
            <UserOption
              data={userLst}
              selectedValue={temp}
              onSelect={setTemp}
            />
          )}
        </DefaultSheet>

        {/* 응답 기한 (시작까지 1시간 미만이면 "시작 시간까지"로 고정) */}
        <SelectSection
          title="응답 기한"
          isRequired
          text={getDueDateText(form.dueDate, isDueDateFixed(form))}
          width="large"
          onClick={handleDueDateClick}
        />
        <TimeSheet
          isOpen={openSheet === REQUEST_SHEET.DUE_DATE && !isDueDateFixed(form)}
          onClose={closeSheet}
          value={form.dueDate}
          onConfirm={(v) => setField(REQUEST_FORM_FIELD_KEY.DUE_DATE, v)}
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
