/**
 * =====================================================================
 * [H-03-01-02] 요청 수정 (내용 확인)
 *  - 페이지 컴포넌트
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/request/pages/RequestEditCheck.module.css";

// icons/images
import iconToggle from "@/shared/assets/icons/iconToggle.svg";

// 일반 라이브러리
import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestDetailQuery } from "@/features/request/hooks/queries/useRequestDetailQuery";
import { useInformationOptionsQuery } from "@/features/request/hooks/queries/useInformationOptionsQuery";
import { useEditRequestMutation } from "@/features/request/hooks/mutations/useEditRequestMutation";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useToastStore } from "@/shared/stores/useToastStore";

// Services
import { getEditCheckService } from "@/features/request/services/editRequestService";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import UserInfo from "@/features/request/components/User/UserInfo";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import Toast from "@/shared/components/Toast/Toast";

// 페이지 컴포넌트
function RequestEditCheck() {
  const { handleGoBack, handleGoBackTwice } = useRequestNav();
  const showToast = useToastStore((state) => state.showToast);
  const paramId = useParams().id;

  // Zustand Store
  const requestForm = useRequestFormStore((state) => state.form);
  const hasForm = Boolean(requestForm.helpType);
  useEffect(() => {
    if (hasForm) return;
    showToast("작성 중인 요청 정보가 없어요.");
  }, [hasForm, showToast]);

  // 1. 공개 항목 선택지 조회 API
  const {
    data: informationOptions,
    isPending: isInformationPending,
    refetch: refetchInformation,
  } = useInformationOptionsQuery(
    { helpType: requestForm.helpType, requestId: paramId },
    { enabled: Boolean(requestForm.helpType && paramId), showToast },
  );

  // 2. 요청 상세 조회 API
  const {
    data: requestDetail,
    isPending: isDetailPending,
  } = useRequestDetailQuery(paramId, { showToast });

  // 3. 요청 수정 API (변경된 필드만 PATCH - 바뀐 내용이 없으면 토스트만 표시)
  const { editRequest } = useEditRequestMutation({
    requestId: paramId,
    requestDetail,
    informationOptions,
    showToast,
    onSuccess: () => handleGoBackTwice(),
    onRefreshInformation: refetchInformation,
  });

  // API 응답 데이터 (정제된 형태)
  const {
    userName,
    isConfirmRequired,
    userPart,
    beforeInfoList,
    afterInfoList,
  } = getEditCheckService(requestDetail, requestForm, informationOptions);

  // GET 요청 로딩중 상태
  const isLoading =
    isDetailPending ||
    isInformationPending;

  // "재확인 요청" 버튼 핸들러
  const handleReconfirmBtnClick = () => {
    editRequest(requestForm);
  };

  return (
    <div className={styles.page}>
      <SubpageHeader
        title="요청 수정"
        rightText="2 / 2"
        onBackClick={handleGoBack}
      />

      {!isLoading && (
<>
      {/* 실제 컨텐츠가 들어갈 자리 */}
      <main className={styles.content}>
            {/* 변경 전 - 변경 후 카드 Container */}
            <div className={styles.cardContainer}>
              {/* 변경 전 Card */}
              <RequestSummary
                isAfterInfo={false}
                hasBeigeBorder={false}
                title="변경 전"
                hasTag={false}
                infoList={beforeInfoList}
              />

              {/* Toggle 아이콘 이미지 */}
              <div className={styles.imgContainer}>
                <img className={styles.toggleImg} src={iconToggle} />
              </div>

              {/* 변경 후 Card */}
              <RequestSummary
                isAfterInfo={true}
                hasBeigeBorder={false}
                title="변경 후"
                hasTag={false}
                infoList={afterInfoList}
              />
            </div>

            {/* 요청 대상 Card */}
            <UserInfo
              isAgain={false}
              state="받는 사람"
              userName={userName}
              part={userPart}
            />

            {/* 가이드 Text */}
            {isConfirmRequired && (
              <span className={`${styles.guideTxt} typoBodySmall`}>
                확인 전까지 기존 내용과 접근 권한이 유지돼요.
                <br />
                담당자 거절 시, 요청이 취소되고 접근 권한이 회수돼요.
              </span>
            )}
      </main>

      {/* 하단 Footer */}
      <LargeFooter
        title={isConfirmRequired ? "재확인 요청" : "재요청"}
        type="primary"
        onClick={handleReconfirmBtnClick}
      />
</>
      )}
      <Toast />
    </div>
  );
}

export default RequestEditCheck;
