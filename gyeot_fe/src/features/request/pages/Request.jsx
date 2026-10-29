// H-03-02
import styles from "@/features/request/pages/Request.module.css";

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
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestForm } from "@/features/request/hooks/useRequestForm";
import {
  getSelectUser,
  getSelectedSituation,
  getDateTimeText,
  getDueDateText,
} from "@/features/request/utils/requestUtils";
import {
  REQUEST_FORM_FIELD,
  REQUEST_SHEET,
  DATE_TIME_SECTIONS,
  DUE_DATE_SECTIONS,
} from "@/features/request/constants/requestConstants";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import {
  getReqFormService,
  postReqFormIdService,
  postReqFormService,
} from "../services/createService";
import { getReqFormApi, postReqFormApi } from "../api/createApi";

function Request() {
  const { handleGoBack, handleGoNext } = useRequestNav();
  const paramsId = useParams().id;

  // 입력값 전체는 form 하나에 있음 (필드별 타입은 useRequestForm.js 의 RequestForm 참고)
  const { form, setField, validate } = useRequestForm(paramsId);

  // 열려 있는 시트 (한 번에 하나만 열림)
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  const { situation, user } = useMemo(
    () => getReqFormService(getReqFormApi()),
    [],
  );

  // 화면 표시용 파생값 (state 아님)
  const selectedSituation = getSelectedSituation(situation, form.situationId);
  const selectedUser = getSelectUser(user, form.userId);

  // Footer 버튼 눌렀을 때 실행될 핸들러
  const handleFooterBtnClick = () => {
    const errors = validate();
    const [firstError] = Object.values(errors); // 첫 번째 에러 문구 하나만
    if (firstError) {
      alert(firstError);
      return;
    }

    // TODO: API 연동 로직 수정 필요
    const reqRefinedData = postReqFormService(form);
    const resRawData = postReqFormApi(reqRefinedData);
    const { reqId } = postReqFormIdService(resRawData);

    // [공개 정보 미리보기] 페이지로 이동
    handleGoNext(REQUEST_ROUTES.infoPreview(reqId));
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="1" onClick={handleGoBack} />

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        {/* 상황 */}
        <SelectSection
          title="상황 *"
          text={selectedSituation?.title ?? "선택"}
          width="large"
          onClick={() => setOpenSheet(REQUEST_SHEET.SITUATION)}
        />
        <DefaultSheet
          isOpen={openSheet === REQUEST_SHEET.SITUATION}
          onClose={closeSheet}
          title="상황"
          description="상황에 참여한 사람들에게만 요청을 보낼 수 있어요."
          value={form.situationId}
          onConfirm={(v) => setField(REQUEST_FORM_FIELD.SITUATION_ID, v)}
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
          onChange={(v) => setField(REQUEST_FORM_FIELD.HELP_TYPE, v)}
        />

        {/* 시작 - 종료 */}
        <div className={styles.timeSectionContainer}>
          <SelectSection
            title="시작 *"
            text={getDateTimeText(form.startDateTime)}
            width="small"
            onClick={() => setOpenSheet(REQUEST_SHEET.START)}
          />
          <SelectSection
            title="종료 *"
            text={getDateTimeText(form.endDateTime)}
            width="small"
            onClick={() => setOpenSheet(REQUEST_SHEET.END)}
          />
        </div>
        <TimeSheet
          isOpen={openSheet === REQUEST_SHEET.START}
          onClose={closeSheet}
          value={form.startDateTime}
          onConfirm={(v) => setField(REQUEST_FORM_FIELD.START_DATE_TIME, v)}
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
          onConfirm={(v) => setField(REQUEST_FORM_FIELD.END_DATE_TIME, v)}
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
          value={form.location}
          onChange={(e) => setField(REQUEST_FORM_FIELD.LOCATION, e.target.value || null)}
        />

        {/* 부탁 내용 */}
        <InputSection
          title="부탁 내용"
          size="large"
          value={form.content}
          onChange={(e) => setField(REQUEST_FORM_FIELD.CONTENT, e.target.value || null)}
        />

        {/* 요청 대상 */}
        <SelectSection
          title="요청 대상 *"
          text={selectedUser?.userName ?? "선택"}
          width="large"
          onClick={() => setOpenSheet(REQUEST_SHEET.USER)}
        />
        <DefaultSheet
          isOpen={openSheet === REQUEST_SHEET.USER}
          onClose={closeSheet}
          title="요청 대상"
          description="상황에 참여한 사람들에게만 요청을 보낼 수 있어요."
          value={form.userId}
          onConfirm={(v) => setField(REQUEST_FORM_FIELD.USER_ID, v)}
        >
          {(temp, setTemp) => (
            <UserOption data={user} selectedValue={temp} onSelect={setTemp} />
          )}
        </DefaultSheet>

        {/* 응답 기한 */}
        <SelectSection
          title="응답 기한 *"
          text={getDueDateText(form.dueDate)}
          width="large"
          onClick={() => setOpenSheet(REQUEST_SHEET.DUE_DATE)}
        />
        <TimeSheet
          isOpen={openSheet === REQUEST_SHEET.DUE_DATE}
          onClose={closeSheet}
          value={form.dueDate}
          onConfirm={(v) => setField(REQUEST_FORM_FIELD.DUE_DATE, v)}
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
    </div>
  );
}

export default Request;
