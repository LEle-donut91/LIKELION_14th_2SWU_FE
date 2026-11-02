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
import { useMemo } from "react";
import { useParams } from "react-router-dom";

// Custom Hooks
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

// API, Services
import {
  getEditCheckApi,
  postEditReconfirmApi,
} from "@/features/request/api/requesterApi";
import {
  getEditCheckService,
} from "@/features/request/services/requesterService";

// 일반 Components
import StepHeader from "@/features/request/components/Header/StepHeader";
import RequestSummary from "@/features/request/components/Request/RequestSummary";
import UserInfo from "@/features/request/components/User/UserInfo";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";

// 페이지 컴포넌트
function RequestEditCheck() {
  // useNavigation 커스텀 훅의 함수
  const { handleGoBack, handleGoBackTwice } = useRequestNav();

  // path parameter (요청 ID)
  const paramId = useParams().id;

  // TODO: API 연동 시 useEffect로 교체 (지금은 mock 이라 렌더마다 호출돼도 문제 없음)
  // [H-03-01-02] 요청 수정 내용 확인 - 데이터 조회
  const { userName, userPart, beforeInfoList, afterInfoList } = useMemo(
    () => getEditCheckService(getEditCheckApi(paramId)),
    [paramId],
  );

  // TODO: API 연동 로직 수정 필요
  // [H-03-01-02] 재확인 요청 후 [요청 상세 · 요청자 뷰]로 이동
  const handleReconfirmBtnClick = () => {
    postEditReconfirmApi(paramId);

    // [요청 상세 · 요청자 뷰]로 이동
    handleGoBackTwice();
  };

  return (
    <div className={styles.page}>
      <StepHeader title="요청 수정" step="2" onClick={handleGoBack} />

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
        <span className={`${styles.guideTxt} typoBodySmall`}>
          확인 전까지 기존 내용과 접근 권한이 유지돼요.
          <br />
          담당자 거절 시, 요청이 취소되고 접근 권한이 회수돼요.
        </span>
      </main>

      {/* 하단 Footer */}
      <LargeFooter
        title="재확인 요청"
        type="primary"
        onClick={handleReconfirmBtnClick}
      />
    </div>
  );
}

export default RequestEditCheck;
