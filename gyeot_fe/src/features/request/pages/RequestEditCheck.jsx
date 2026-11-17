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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { useToast } from "@/shared/hooks/useToast";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { getErrorMessage } from "@/shared/utils/apiError";

// API, Services
import {
  getRequestDetailApi,
  getInformationOptionsApi,
} from "@/features/request/api/getApi";
import {
  patchEditApi,
} from "@/features/request/api/patchApi";
import { getEditCheckService } from "@/features/request/services/getService";
import { patchEditService } from "@/features/request/services/patchService";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import UserInfo from "@/features/request/components/User/UserInfo";
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import DefaultToast from "@/shared/components/Toast/DefaultToast";

// 페이지 컴포넌트
function RequestEditCheck() {
  // useNavigation 커스텀 훅의 함수
  const { handleGoBack, handleGoBackTwice } = useRequestNav();

  // path parameter (요청 ID)
  const paramId = useParams().id;

  const requestForm = useRequestFormStore((state) => state.form);
  const { toast, showToast, hideToast } = useToast();
  // 선택한 정보 ID를 표시 이름으로 변환하기 위한 선택지 조회
  const { data: informationOptions, isPending: isInformationPending, error: informationError } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.informationOptions(requestForm.helpType, paramId),
    queryFn: () => getInformationOptionsApi({ helpType: requestForm.helpType, requestId: paramId }),
    enabled: Boolean(requestForm.helpType && paramId),
  });
  const { data: requestDetail, isPending: isDetailPending, error: detailError } = useQuery({
    queryKey: REQUEST_QUERY_KEYS.detail(paramId),
    queryFn: () => getRequestDetailApi(paramId),
    enabled: Boolean(paramId),
  });

  useEffect(() => {
    if (detailError) showToast(getErrorMessage(detailError));
  }, [detailError, showToast]);

  useEffect(() => {
    if (informationError) showToast(getErrorMessage(informationError));
  }, [informationError, showToast]);

  const {
    userName,
    isConfirmRequired,
    userPart,
    beforeInfoList,
    afterInfoList,
  } = getEditCheckService(requestDetail, requestForm, informationOptions);

  const { mutate: editRequest, isPending: isEditing } = useMutation({
    mutationFn: (form) => patchEditApi(patchEditService(paramId, form, requestDetail, informationOptions)),
    onSuccess: () => {
      handleGoBackTwice();
    },
    onError: (error) => {
      showToast(getErrorMessage(error));
    },
  });

  // [H-03-01-02] 재확인 요청 후 [요청 상세 · 요청자 뷰]로 이동
  const handleReconfirmBtnClick = () => {
    if (isEditing || isDetailPending || isInformationPending || detailError || informationError) return;
    const { payload } = patchEditService(paramId, requestForm, requestDetail, informationOptions);
    if (Object.keys(payload).length === 0) {
      showToast("변경된 내용이 없어요.");
      return;
    }
    editRequest(requestForm);
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title="요청 수정" rightText="2 / 2" onBackClick={handleGoBack} />

      {/* 실제 컨텐츠가 들어갈 자리 */}
      <main className={styles.content}>
        {isDetailPending || isInformationPending ? <div role="status">로딩중</div> : (
          <>
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
          </>
        )}
      </main>

      {/* 하단 Footer */}
      <LargeFooter
        title={isConfirmRequired ? "재확인 요청" : "요청 수정"}
        type="primary"
        onClick={handleReconfirmBtnClick}
      />
      {toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />}
    </div>
  );
}

export default RequestEditCheck;
