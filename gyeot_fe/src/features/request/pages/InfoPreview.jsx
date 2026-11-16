/**
 * =====================================================================
 * [H-03-02-01] 공개 정보 미리보기
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/InfoPreview.module.css";

// 일반 라이브러리
import { Fragment, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useToast } from "@/features/request/hooks/useToast";
import { getErrorMessage } from "@/shared/utils/apiError";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

// Utils
import {
  getSelectedTitles,
  getSelectedUserInfo,
  getCategoryInformationIds,
  replaceCategoryInformationIds,
} from "@/features/request/utils/requestUtils";

// API, Services
import {
  getRequestTargetsApi,
  getInformationOptionsApi,
} from "@/features/request/api/getApi";
import {
  getRequestTargetsService,
  getInformationOptionsService,
} from "@/features/request/services/getService";
import { postCareRequestApi, postAskAgainApi } from "@/features/request/api/postApi";
import { postCareRequestService, postCareRequestResultService, postAskAgainService } from "@/features/request/services/postService";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import UserInfo from "@/features/request/components/User/UserInfo";
import DueDateState from "@/features/request/components/State/DueDateState";
import SafetyCardGroup from "@/features/request/components/SafetyCard/SafetyCardGroup";
import DefaultSheet from "@/shared/components/DefaultSheet/DefaultSheet";
import CheckOption from "@/features/request/components/Option/CheckOption";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
import DefaultToast from "@/shared/components/Toast/DefaultToast";

// 페이지 컴포넌트
function InfoPreview() {
  const { handleGoNext, handleGoBack } = useRequestNav(); // useNavigation 커스텀 훅의 함수
  const { toast, showToast, hideToast } = useToast(); // 토스트 메시지
  const { form: requestForm, setForm, resetForm } = useRequestFormStore((state) => state); // 요청 작성 폼 상태 관리
  const [searchParams] = useSearchParams();
  const reassignRequestId = searchParams.get("askAgain");

  // 요청 대상 후보 조회 (요청 작성 시 선택한 대상)
  const {
    data: users = [],
    isPending: isTargetsPending,
    error: targetsError,
  } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.targets(requestForm.situationId),
    queryFn: () =>
      getRequestTargetsApi({ situationId: Number(requestForm.situationId) }),
    select: getRequestTargetsService,
    enabled: Boolean(requestForm.situationId),
  });

  // API 호출 에러 처리
  useEffect(() => {
    if (!targetsError) return;
    showToast(getErrorMessage(targetsError));
  }, [targetsError, showToast]);

  // 도움 종류로 조회하고, 다시 부탁하기에서는 기존 요청 ID도 전달
  const {
    data: informationOptions,
    isPending: isInformationPending,
    error: informationError,
  } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.informationOptions(requestForm.helpType, reassignRequestId),
    queryFn: () => getInformationOptionsApi({
      helpType: requestForm.helpType,
      ...(reassignRequestId && { requestId: reassignRequestId }),
    }),
    enabled: Boolean(requestForm.helpType),
  });
  const {
    categories,
    selectedIds,
    isSensitiveIncluded,
    isDefaultChecked,
    dueDate,
  } = useMemo(
    () => getInformationOptionsService(informationOptions, requestForm),
    [informationOptions, requestForm],
  );

  // API 호출 에러 처리
  useEffect(() => {
    if (informationError) showToast(getErrorMessage(informationError));
  }, [informationError, showToast]);

  // 공개 항목 선택지 조회 후, 기본값이 있는 경우 requestForm에 반영
  useEffect(() => {
    if (!informationOptions) return;
    setForm((prev) => ({
      ...prev,
      informationIds: getInformationOptionsService(informationOptions, prev)
        .defaultIds,
    }));
  }, [informationOptions, setForm]);

  // 선택한 대상의 이름과 보호자 여부를 가져오는 함수
  const { userName, userPart } = getSelectedUserInfo(users, requestForm.userId);

  // 열려 있는 시트 (한 번에 하나만 열림) - 값은 CHECK_FORM_FIELD_KEY 중 하나
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  // 민감정보 확인 모달의 열림/닫힘 상태
  const [isModalOpen, setModalOpen] = useState(false);

  // 선택한 공개 항목을 카테고리별로 교체하는 함수
  const setCategorySelection = (categoryItems, ids) => {
    setForm((prev) => ({
      ...prev,
      informationIds: replaceCategoryInformationIds(
        prev.informationIds,
        categoryItems,
        ids,
      ),
    }));
  };

  // [H-03-02-01] 공개 정보 제출 후 [요청 완료] 페이지로 이동
  const { mutate: sendRequest, isPending: isSending } = useMutation({
    mutationFn: (form) => reassignRequestId
      ? postAskAgainApi(postAskAgainService(Number(reassignRequestId), form))
      : postCareRequestApi(postCareRequestService(form)),
    onSuccess: (data) => {
      const { requestId } = postCareRequestResultService(data);
      resetForm();
      handleGoNext(REQUEST_ROUTES.send(requestId), true);
    },
    onError: (error) => {
      showToast(getErrorMessage(error));
    },
  });

  const handleGoSend = () => {
    if (isSending) return;
    setModalOpen(false);
    sendRequest({ ...requestForm, informationIds: selectedIds });
  };

  // 요청 보내기 버튼 클릭 핸들러 (민감정보가 있으면 확인 모달을 먼저 띄움)
  const handleSendBtnClick = () => {
    if (isSending || isTargetsPending || targetsError || isInformationPending || informationError) return;

    if (isSensitiveIncluded) {
      setModalOpen(true);
      return;
    }
    handleGoSend();
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <SubpageHeader title="요청 작성" rightText="2 / 2" onBackClick={handleGoBack} />

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        <UserInfo
          isAgain={false}
          state="받는 사람"
          userName={isTargetsPending ? "..." : userName}
          part={isTargetsPending ? "..." : userPart}
        />

        <DueDateState
          isResponse={false}
          title="접근 기한"
          dueDate={`~ ${dueDate}`}
        />

        <div className={styles.sectionGroup}>
          <span className={`${styles.groupTitle} typoTitleMedium`}>
            공유 정보
          </span>
          {/* 기본 정보 / 건강 정보 / 생활 정보 / 미리 남기는 말 */}
          {isInformationPending && <div role="status">로딩중</div>}
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

export default InfoPreview;
