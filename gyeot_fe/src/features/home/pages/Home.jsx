import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "@/features/home/pages/Home.module.css";
import MainHeader from "@/shared/components/main-header/MainHeader";
import BottomNav from "@/shared/components/BottomNav/BottomNav";
import { useToastStore } from "@/shared/stores/useToastStore";
import Toast from "@/shared/components/Toast/Toast";
import { useHome } from "@/features/home/hooks/useHome";
import { useNoAssigneeNotice } from "@/features/home/hooks/useNoAssigneeNotice";
import HomeEmpty from "@/features/home/components/HomeEmpty";
import StatusCardList from "@/features/home/components/StatusCardList";
import SectionTab from "@/features/home/components/SectionTab";
import SituationTabContent from "@/features/home/components/SituationTabContent";
import HomeRequestSections from "@/features/home/components/HomeRequestSections";
import HelpFloatingButton from "@/features/home/components/HelpFloatingButton";
import SituationSelectSheet from "@/features/home/components/SituationSelectSheet";
import RequestModal from "@/features/home/components/RequestModal";
import {
  HOME_NAVIGATION_PATH,
  HOME_TOAST_MESSAGE,
  SITUATION_TAB,
  SITUATION_TAB_LIST,
} from "@/features/home/constants/homeConstants";

// 헤더 타이틀 (신규 사용자 / 기존 사용자)
const HEADER_TITLE = {
  NEW_USER: (
    <>
      나의 곁을
      <br />
      기다리고 있어요.
    </>
  ),
  DEFAULT: (
    <>
      나의 곁과
      <br />
      함께 하고 있어요.
    </>
  ),
};

// 홈 (H-00)
function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { homeData, isLoading, hasError } = useHome();

  // 토스트 (공통 스토어: 페이지를 이동해도 3초 동안 유지)
  // - 담당자 없음 안내 닫기 실패 (M-01), 상황 종료 직후 안내
  const showToast = useToastStore((state) => state.showToast);

  // 담당자 없음 안내 (M-01): 홈 조회와 함께 조회, 정상 홈 화면에서만 모달 표시
  const {
    currentItem: noAssigneeNotice,
    currentNumber: noAssigneeNoticeNumber,
    totalCount: noAssigneeNoticeCount,
    handleClose: handleNoAssigneeNoticeClose,
    handleAskAgain: handleNoAssigneeNoticeAskAgain,
  } = useNoAssigneeNotice({ onDismissError: showToast });

  const [activeTab, setActiveTab] = useState(SITUATION_TAB.MY);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 상황 종료 직후 진입 시 토스트 1회 노출
  // H-03-05에서 navigate("/home", { state: { isSituationEnded: true } })로 진입
  // 띄운 뒤 바로 state를 비워 새로고침·뒤로가기 시 다시 뜨지 않게 함
  const isSituationEnded = Boolean(location.state?.isSituationEnded);

  useEffect(() => {
    if (!isSituationEnded) return;
    showToast(HOME_TOAST_MESSAGE.SITUATION_ENDED);
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: null },
    );
  }, [isSituationEnded, showToast, navigate, location.pathname, location.search]);

  // 화면 이동 (App.jsx 라우트 기준)
  // 라우트에 id 파라미터가 없어 대상 id는 location.state로 전달
  const handleInviteClick = () =>
    navigate(HOME_NAVIGATION_PATH.ACQUAINTANCE_INVITE); // R-01
  const handleSafetyCardClick = () => navigate(HOME_NAVIGATION_PATH.CARD); // C-00
  // 경로가 있는 카드만 이동 (현재 공유중 → C-06)
  const handleStatusCardClick = (path) => {
    if (path) navigate(path);
  };
  const handleSituationCreateClick = () =>
    navigate(HOME_NAVIGATION_PATH.SITUATION_CREATE); // H-01
  const handleSituationDetailClick = (situationId) =>
    navigate(HOME_NAVIGATION_PATH.SITUATION_DETAIL, { state: { situationId } }); // H-03
  const handleRequestCreate = (situationId) =>
    navigate(HOME_NAVIGATION_PATH.REQUEST_CREATE(situationId)); // H-03-02

  const handleReceivedRequestClick = (requestId) =>
    navigate(HOME_NAVIGATION_PATH.REQUEST_DETAIL(requestId)); // H-03-01
  const handleSentRequestClick = (requestId) =>
    navigate(HOME_NAVIGATION_PATH.REQUEST_DETAIL(requestId)); // H-03-01

  // TODO: 알림은 MVP 제외(주석 1), 설정은 와이어프레임에 이동 화면 없음
  const handleAlarmClick = () => console.log("[TODO] 알림");
  const handleSettingClick = () => console.log("[TODO] 설정");

  // 공통 로딩·에러 UI
  if (isLoading) return null;
  if (hasError || !homeData) {
    return (
      <div className={styles.home}>
        <p className={styles.message}>홈 정보를 불러오지 못했어요.</p>
        <BottomNav />
      </div>
    );
  }

  // 탭별 상황 카드 (홈 통합 조회 situationCards.my / participating)
  const mySituations = homeData.situations[SITUATION_TAB.MY];
  const tabSituations = homeData.situations[activeTab];

  // 진행 중인 나의 상황이 1개면 바로 요청 작성, 2개 이상이면 상황 선택 시트
  const handleHelpClick = () => {
    if (mySituations.length === 1) {
      handleRequestCreate(mySituations[0].id);
      return;
    }
    setIsSheetOpen(true);
  };

  const handleSheetConfirm = (situationId) => {
    setIsSheetOpen(false);
    handleRequestCreate(situationId);
  };

  return (
    <div className={styles.home}>
      <MainHeader
        title={homeData.isNewUser ? HEADER_TITLE.NEW_USER : HEADER_TITLE.DEFAULT}
        hasAlarmButton
        hasSettingButton
        onAlarmClick={handleAlarmClick}
        onSettingClick={handleSettingClick}
      />

      <main className={styles.mainContent}>
        {homeData.isNewUser ? (
          <HomeEmpty
            onInviteClick={handleInviteClick}
            onSafetyCardClick={handleSafetyCardClick}
          />
        ) : (
          <div className={styles.mainContainer}>
            <StatusCardList
              summary={homeData.summary}
              onCardClick={handleStatusCardClick}
            />

            <div className={styles.sectionTabContainer}>
              <SectionTab
                tabList={SITUATION_TAB_LIST}
                activeKey={activeTab}
                onTabChange={setActiveTab}
              />
              <SituationTabContent
                tabKey={activeTab}
                situations={tabSituations}
                onSituationDetailClick={handleSituationDetailClick}
                onSituationCreateClick={handleSituationCreateClick}
              />
            </div>

            {/* 탭 밖 공통 영역: 탭과 관계없이 같은 목록 (mainContainer 간격 48 = 기존 섹션 간격) */}
            <HomeRequestSections
              receivedRequests={homeData.receivedRequests}
              sentRequests={homeData.sentRequests}
              upcomingSchedules={homeData.upcomingSchedules}
              onReceivedRequestClick={handleReceivedRequestClick}
              onSentRequestClick={handleSentRequestClick}
            />
          </div>
        )}
      </main>

      {mySituations.length > 0 && (
        <HelpFloatingButton onClick={handleHelpClick} />
      )}

      {isSheetOpen && (
        <SituationSelectSheet
          situations={mySituations}
          onClose={() => setIsSheetOpen(false)}
          onConfirm={handleSheetConfirm}
        />
      )}

      {/* M-01 담당자 없음 모달: 안내가 있으면 하나씩 표시 (닫으면 다음 안내) */}
      {noAssigneeNotice && (
        <RequestModal
          modalOpen
          modalItem={noAssigneeNotice}
          currentNumber={noAssigneeNoticeNumber}
          totalCount={noAssigneeNoticeCount}
          onCancelClick={handleNoAssigneeNoticeClose}
          onConfirmClick={handleNoAssigneeNoticeAskAgain}
        />
      )}

      {/* 토스트: 스토어 메시지가 있을 때만 그려짐 (toastArea는 하단 내비 위 위치 담당) */}
      <div className={styles.toastArea}>
        <Toast />
      </div>

      <BottomNav />
    </div>
  );
}

export default Home;
