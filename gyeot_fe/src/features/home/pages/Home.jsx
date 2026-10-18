import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "@/features/home/pages/Home.module.css";
import MainHeader from "@/shared/components/main-header/MainHeader";
import BottomNav from "@/shared/components/BottomNav/BottomNav";
import { useHome } from "@/features/home/hooks/useHome";
import HomeEmpty from "@/features/home/components/HomeEmpty";
import StatusCardList from "@/features/home/components/StatusCardList";
import SectionTab from "@/features/home/components/SectionTab";
import SituationTabContent from "@/features/home/components/SituationTabContent";
import HelpFloatingButton from "@/features/home/components/HelpFloatingButton";
import SituationSelectSheet from "@/features/home/components/SituationSelectSheet";
import HomeToast from "@/features/home/components/HomeToast";
import HomeTestSwitcher from "@/features/home/components/HomeTestSwitcher"; // [테스트용] 제거 가능
import {
  HOME_NAVIGATION_PATH,
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

  const [activeTab, setActiveTab] = useState(SITUATION_TAB.MY);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 상황 종료 직후 진입 시 토스트 1회 노출
  // H-03-05에서 navigate("/home", { state: { isSituationEnded: true } })로 진입
  const isToastVisible = Boolean(location.state?.isSituationEnded);

  // 토스트가 사라지면 state를 비워 새로고침·뒤로가기 시 다시 뜨지 않게 함
  const handleToastHide = useCallback(() => {
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: null },
    );
  }, [navigate, location.pathname, location.search]);

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
    navigate(HOME_NAVIGATION_PATH.REQUEST_CREATE, { state: { situationId } }); // H-03-02

  // TODO: 와이어프레임 화면 코드와 App.jsx 라우트가 일치하지 않아 연결 보류
  // - 받은 요청 → 요청 상세(대상자 뷰) "H-03-01-tgt": App.jsx에 해당 코드 없음
  // - 보낸 요청 → 요청 상세(요청자 뷰) "H-03-01-B": App.jsx의 H-03-01-B는 RequestTarget(대상자)
  const handleReceivedRequestClick = (requestId) =>
    console.log("[TODO] 받은 요청 상세(H-03-01-tgt)", requestId);
  const handleSentRequestClick = (requestId) =>
    console.log("[TODO] 보낸 요청 상세(H-03-01-B)", requestId);

  // TODO: 알림은 MVP 제외(주석 1), 설정은 와이어프레임에 이동 화면 없음
  const handleAlarmClick = () => console.log("[TODO] 알림");
  const handleSettingClick = () => console.log("[TODO] 설정");

  // TODO: 공통 로딩·에러 UI 확정 후 교체
  if (isLoading) return null;
  if (hasError || !homeData) {
    return (
      <div className={styles.home}>
        <p className={styles.message}>홈 정보를 불러오지 못했어요.</p>
        <HomeTestSwitcher />
        <BottomNav />
      </div>
    );
  }

  const mySituations = homeData.mySituation?.situations ?? [];
  const tabContent =
    activeTab === SITUATION_TAB.MY
      ? homeData.mySituation
      : homeData.participatingSituation;

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
                content={tabContent}
                onSituationDetailClick={handleSituationDetailClick}
                onSituationCreateClick={handleSituationCreateClick}
                onReceivedRequestClick={handleReceivedRequestClick}
                onSentRequestClick={handleSentRequestClick}
              />
            </div>
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

      {isToastVisible && (
        <HomeToast message="상황을 종료했어요." onHide={handleToastHide} />
      )}

      {/* [테스트용] 상황별 화면 전환 - 제거 시 이 줄과 import만 삭제 */}
      <HomeTestSwitcher />

      <BottomNav />
    </div>
  );
}

export default Home;