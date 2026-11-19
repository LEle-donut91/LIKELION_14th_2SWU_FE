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
import { useSearchParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestTargetsQuery } from "@/features/request/hooks/queries/useRequestTargetsQuery";
import { useInformationOptionsQuery } from "@/features/request/hooks/queries/useInformationOptionsQuery";
import { useSendRequestMutation } from "@/features/request/hooks/mutations/useSendRequestMutation";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useToast } from "@/shared/hooks/useToast";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";

// Utils
import { getSelectedUserInfo } from "@/features/request/utils/getSelectionInput";
import {
  getSelectedTitles,
  getCategoryInformationIds,
  replaceCategoryInformationIds,
} from "@/features/request/utils/getSafetyCardInfo";

// Services
import { getInformationOptionsService } from "@/features/request/services/informationOptionsService";

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

  // 이전 페이지가 "다시 부탁하기"였는지 여부
  const [searchParams] = useSearchParams();
  const reassignRequestId = searchParams.get("askAgain");

  // 열려 있는 시트 (한 번에 하나만 열림)
  const [openSheet, setOpenSheet] = useState(null);
  const closeSheet = () => setOpenSheet(null);

  // 민감정보 확인 모달의 열림/닫힘 상태
  const [isModalOpen, setModalOpen] = useState(false);

  // Zustand Store
  const {
    form: requestForm,
    setForm,
    resetForm,
  } = useRequestFormStore((state) => state);
  const hasForm = Boolean(requestForm.helpType);
  useEffect(() => {
    if (hasForm) return;
    showToast("작성 중인 요청 정보가 없어요.");
  }, [hasForm, showToast]);

  // 1. 대상 후보 조회 API
  const {
    data: users = [],
    isPending: isTargetPending,
  } = useRequestTargetsQuery(
    reassignRequestId
      ? { requestId: reassignRequestId }
      : { situationId: requestForm.situationId },
    { showToast },
  );

  // 2. 공개 항목 선택지 조회 (도움 종류로 조회하고, 다시 부탁하기에서는 기존 요청 ID도 전달)
  const {
    data: informationOptions,
    isPending: isInfoPending,
    refetch: refetchInformation,
  } = useInformationOptionsQuery(
    { helpType: requestForm.helpType, requestId: reassignRequestId },
    { enabled: Boolean(requestForm.helpType), showToast },
  );

  // 3. 도움 요청 생성 API
  const { mutate: sendRequest } = useSendRequestMutation({
    reassignRequestId,
    showToast,
    onRefreshInformation: refetchInformation,
    onSuccess: ({ requestId }) => {
      resetForm();
      handleGoNext(REQUEST_ROUTES.send(requestId), true);
    },
  });

  // GET 요청 로딩중 상태
  const isLoading =
  isTargetPending ||
  isInfoPending

  // API 응답 데이터 (정제된 형태)
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

  // 공개 항목 선택지 조회 후, 기본값이 있는 경우 requestForm에 반영
  useEffect(() => {
    if (!informationOptions) return;
    setForm((prev) => ({
      ...prev,
      informationIds: getInformationOptionsService(informationOptions, prev)
        .defaultIds,
    }));
  }, [informationOptions, setForm]);

  // 선택한 대상의 이름과 보호자 여부를 가져옴
  const { userName, userPart } = getSelectedUserInfo(users, requestForm.userId);

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

  // [민감 정보 확인] 모달의 confirm 버튼 핸들러 / 요청 보내기 핸들러
  const handleGoSend = () => {
    setModalOpen(false);
    sendRequest({ ...requestForm, informationIds: selectedIds });
  };

  // "요청 보내기" 버튼 핸들러 (민감정보가 있으면 확인 모달을 먼저 띄움)
  const handleSendBtnClick = () => {
    if (isSensitiveIncluded) {
      setModalOpen(true);
      return;
    }
    handleGoSend();
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <SubpageHeader
        title="요청 작성"
        rightText="2 / 2"
        onBackClick={handleGoBack}
      />
      {!isLoading && (
<>

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        <UserInfo
          isAgain={false}
          state="받는 사람"
          userName={userName}
          part={userPart}
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
</>
      )}
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
