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
import { useInformationOptionsQuery } from "@/features/request/hooks/queries/useInformationOptionsQuery";
import { useSendRequestMutation } from "@/features/request/hooks/mutations/useSendRequestMutation";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useToastStore } from "@/shared/stores/useToastStore";

// Constants
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";

// Utils
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
import Toast from "@/shared/components/Toast/Toast";

// 페이지 컴포넌트
function InfoPreview() {
  const { handleGoNext, handleGoBack } = useRequestNav(); // useNavigation 커스텀 훅의 함수
  const showToast = useToastStore((state) => state.showToast); // 토스트 메시지

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
    initInformationSelection,
  } = useRequestFormStore((state) => state);
  const hasForm = Boolean(requestForm.helpType);
  useEffect(() => {
    if (hasForm) return;
    showToast("작성 중인 요청 정보가 없어요.");
  }, [hasForm, showToast]);

  // 1. 공개 항목 선택지 조회 (도움 종류로 조회하고, 다시 부탁하기 흐름에서는 requestId도 전달)
  const {
    data: informationOptions,
    isPending,
    refetch: refetchInformation,
  } = useInformationOptionsQuery(
    { helpType: requestForm.helpType, requestId: reassignRequestId },
    { enabled: Boolean(requestForm.helpType), showToast },
  );

  // 2. 도움 요청 생성 API
  const { mutate: sendRequest } = useSendRequestMutation({
    reassignRequestId,
    showToast,
    onRefreshInformation: refetchInformation,
    onSuccess: ({ requestId }) => {
      resetForm();
      handleGoNext(REQUEST_ROUTES.send(requestId), true);
    },
  });

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

  // 조회 조건별 최초 기본값만 적용하고 이후 사용자 선택은 스토어에서 유지
  useEffect(() => {
    if (!informationOptions) return;
    initInformationSelection({
      helpType: requestForm.helpType,
      requestId: reassignRequestId,
      informationIds: getInformationOptionsService(informationOptions, requestForm)
        .defaultIds,
    });
  }, [informationOptions, requestForm, reassignRequestId, initInformationSelection]);

  // Zustand Store에 저장한 요청 대상 정보
  const { userName, isGuardian } = requestForm;

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
      {!isPending && (
<>

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        <UserInfo
          isAgain={false}
          state="받는 사람"
          userName={userName}
          part={isGuardian ? "보호자" : "나의 사람"}
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
          {/* 현재 기본값이 선택된 상태일 경우 (단, 다시 부탁하기 흐름이 아닐 때만) */}
          {!reassignRequestId && isDefaultChecked && (
            <>
              기본값이 선택되어 있어요.
              <br />
            </>
          )}
          {/* 현재 기본값이 선택되지 않은 상태일 때 (단, 다시 부탁하기 흐름일 땐 기본값 선택 여부와 관계없이 항상 이 문구만 출력) */}
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
      <Toast />
    </div>
  );
}

export default InfoPreview;
